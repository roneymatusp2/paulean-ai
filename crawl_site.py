#!/usr/bin/env python3
"""
St. Paul's School – Full-Site Crawler + HTML→Markdown Exporter (Corrected)
========================================================================
Usage (CLI):
    python crawl_site.py --base https://www.stpauls.br --out data/site_output

Features:
• Breadth-first crawl restricted to the *same* hostname.
• Normalizes URLs (strips query strings, fragments, enforces trailing slash).
• Saves raw HTML and converted Markdown side-by-side.
• Adds HTML <title> as H1 in the Markdown file.
• Generates `sitemap.json` (list of successfully crawled URLs) and `crawler_state.json` (for resuming).
• Respects robots.txt (requires `reppy` library, falls back if not installed).
• Implements request retries for transient network errors.
• Graceful handling of KeyboardInterrupt (Ctrl+C) for saving state.
• Filters out common non-HTML file extensions.
• Detailed logging to `crawler.log` and console.
"""
from __future__ import annotations

import argparse
import json
import logging
import re
import signal
import sys
import time
from collections import deque
from pathlib import Path
from urllib.parse import urljoin, urlparse, urldefrag

import requests
from bs4 import BeautifulSoup
from html2text import HTML2Text
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from tqdm import tqdm

try:
    from reppy.robots import Robots
    REPPY_AVAILABLE = True
except ImportError:
    REPPY_AVAILABLE = False
    # Explicitly log if reppy is not found, as it's an optional dependency
    # This logging will happen at import time.
    # print("INFO: 'reppy' library not found. robots.txt checking will be skipped. "
    #       "To enable, install with: pip install reppy (may require C++ build tools on Windows)", file=sys.stderr)


# --- Configuration ---
USER_AGENT = "PauleanCrawler/1.2 (+https://www.stpauls.br/botinfo)" # Incremented version
REQUEST_TIMEOUT = 25
DELAY_BETWEEN_REQUESTS_DEFAULT = 1.0
MAX_RETRIES = 3
RETRY_BACKOFF_FACTOR = 0.5
SAVE_STATE_INTERVAL_DEFAULT = 10 # Save every N successfully processed pages
MAX_PAGES_DEFAULT = 2000

# --- Logging Setup ---
logger = logging.getLogger("crawler")
if logger.hasHandlers(): # Clear existing handlers to prevent duplication on re-runs
    logger.handlers.clear()

logger.setLevel(logging.INFO) # Default level
log_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(module)s - %(message)s')

console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(log_formatter)
logger.addHandler(console_handler)
file_log_handler = None # Will be initialized in main()

# --- Global Variables for State Management ---
# These are used to manage the crawl state across function calls and signal handling
g_processed_urls: set[str] = set()
g_url_queue: deque[str] = deque()
g_base_domain: str = ""
g_output_dir: Path | None = None # Set in main, used by signal handler
g_stop_crawling: bool = False
g_cmd_args = None # To store parsed command-line arguments


# --- Helper Functions ---
def setup_file_logging(log_file_path: Path):
    global file_log_handler
    if file_log_handler: # If a file handler already exists (e.g. from a previous init)
        logger.removeHandler(file_log_handler)
        file_log_handler.close()

    file_log_handler = logging.FileHandler(log_file_path, mode='a', encoding='utf-8')
    file_log_handler.setFormatter(log_formatter)
    logger.addHandler(file_log_handler)
    if g_cmd_args and g_cmd_args.verbose: # Ensure file handler also respects verbose
        file_log_handler.setLevel(logging.DEBUG)


def normalize_url(url_str: str, base_for_relative: str | None = None) -> str | None:
    try:
        # Ensure base_for_relative is an absolute URL if provided
        if base_for_relative and not urlparse(base_for_relative).scheme:
            logger.debug(f"Base for relative URL '{base_for_relative}' is not absolute. Cannot reliably join with '{url_str}'.")
            # Attempt to make base_for_relative absolute if it's a path from the global base domain
            if g_base_domain and base_for_relative.startswith('/'):
                parsed_g_base = urlparse(f"http://{g_base_domain}") # Scheme doesn't matter much here
                base_for_relative = urljoin(f"{parsed_g_base.scheme or 'http'}://{g_base_domain}", base_for_relative)
            else:
                return None


        # Join if base_for_relative is provided (making url_str absolute)
        absolute_url_str = urljoin(base_for_relative, url_str) if base_for_relative else url_str

        url_no_fragment, _ = urldefrag(absolute_url_str)
        parsed_url = urlparse(url_no_fragment)

        if parsed_url.scheme not in ('http', 'https'):
            logger.debug(f"Skipping URL with non-http(s) scheme: {url_str}")
            return None

        # Ensure netloc is present; if not, it's likely a malformed or incomplete URL
        if not parsed_url.netloc:
            logger.debug(f"URL '{url_str}' (resolved to '{absolute_url_str}') lacks a network location (domain).")
            return None

        path_part = parsed_url.path if parsed_url.path else "/"
        if not path_part.startswith('/'): # Should not happen if urljoin was used correctly
            path_part = '/' + path_part

        # Add trailing slash for paths that don't look like files (no extension)
        if not Path(path_part).suffix and not path_part.endswith('/'):
            path_part += '/'

        # Reconstruct without query parameters
        return f"{parsed_url.scheme}://{parsed_url.netloc}{path_part}"
    except ValueError as e:
        logger.warning(f"Normalization failed for URL: '{url_str}' (Base: '{base_for_relative}'). Error: {e}")
        return None


def get_url_domain(url_str: str) -> str | None:
    try:
        return urlparse(url_str).netloc
    except ValueError:
        return None


def create_http_session() -> requests.Session:
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})
    retry_strategy = Retry(
        total=MAX_RETRIES, read=MAX_RETRIES, connect=MAX_RETRIES,
        backoff_factor=RETRY_BACKOFF_FACTOR,
        status_forcelist=[429, 500, 502, 503, 504], # HTTP status codes to retry on
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session


def is_link_crawlable(link_href: str, current_page_url: str) -> bool:
    global g_base_domain # Uses the global base domain set at the start of the crawl
    if not link_href or link_href.startswith(("#", "mailto:", "tel:", "javascript:")):
        return False

    # Common file extensions to exclude (can be expanded)
    excluded_extensions = (
        '.pdf', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.bmp',
        '.zip', '.tar', '.gz', '.rar', '.7z', '.bz2',
        '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.ods', '.odp',
        '.mp3', '.mp4', '.avi', '.mov', '.wmv', '.flv', '.ogg', '.mkv',
        '.css', '.js', '.jsonld', '.webmanifest',
        '.xml', '.rss', '.atom', '.txt' # Exclude .txt unless specifically needed
    )
    try:
        # Check path part of the link for excluded extensions
        # This handles relative links like "/path/to/file.pdf" correctly
        parsed_link_path_only = urlparse(link_href).path.lower()
        if any(parsed_link_path_only.endswith(ext) for ext in excluded_extensions):
            return False
    except ValueError: # If link_href is malformed
        return False

    # Normalize the link to an absolute URL to check its domain
    normalized_full_url = normalize_url(link_href, current_page_url)
    if not normalized_full_url:
        return False # Could not be normalized, likely invalid

    # Check if the domain of the normalized link matches the global base domain
    return get_url_domain(normalized_full_url) == g_base_domain


class RobotsChecker:
    def __init__(self, start_url_for_robots: str):
        self.robots_parser_instance = None
        if REPPY_AVAILABLE:
            parsed_start = urlparse(start_url_for_robots)
            self.robots_txt_url = f"{parsed_start.scheme}://{parsed_start.netloc}/robots.txt"
            try:
                # Use a temporary session for fetching robots.txt to keep it isolated
                with requests.Session() as temp_robots_session:
                    temp_robots_session.headers.update({"User-Agent": USER_AGENT})
                    # Pass the session to reppy if it supports it, or let it handle fetching
                    self.robots_parser_instance = Robots.fetch(self.robots_txt_url, session=temp_robots_session, timeout=REQUEST_TIMEOUT)
                logger.info(f"Fetched and parsed robots.txt from {self.robots_txt_url}")
            except Exception as e:
                logger.warning(f"Failed to fetch/parse robots.txt from {self.robots_txt_url}: {e}. Assuming all paths are allowed.")
        else:
            # This message is now printed at import time if reppy is not found
            pass


    def is_allowed(self, url_to_check: str) -> bool:
        if self.robots_parser_instance and REPPY_AVAILABLE:
            try:
                return self.robots_parser_instance.allowed(url_to_check, USER_AGENT)
            except Exception as e:
                logger.warning(f"Error during robots.txt check for '{url_to_check}': {e}. Assuming allowed.")
                return True # Default to allowed on error during check
        return True # Default to allowed if reppy is not available or parser failed to init


def save_crawl_state(state_file: Path, sitemap_file: Path):
    global g_processed_urls, g_url_queue, g_base_domain
    try:
        current_state_data = {
            "processed_urls": sorted(list(g_processed_urls)),
            "url_queue": list(g_url_queue),
            "base_domain": g_base_domain
        }
        # Atomic write: write to a temporary file then rename
        temp_state_path = state_file.with_suffix(".tmp")
        with temp_state_path.open("w", encoding="utf-8") as f:
            json.dump(current_state_data, f, indent=2)
        temp_state_path.replace(state_file) # Atomic rename
        logger.debug(f"Crawl state saved to {state_file}")

        # Save sitemap (only successfully processed URLs from the correct domain)
        temp_sitemap_path = sitemap_file.with_suffix(".tmp")
        valid_sitemap_urls = [url for url in g_processed_urls if get_url_domain(url) == g_base_domain]
        with temp_sitemap_path.open("w", encoding="utf-8") as f:
            json.dump(sorted(valid_sitemap_urls), f, indent=2)
        temp_sitemap_path.replace(sitemap_file)
        logger.debug(f"Sitemap saved to {sitemap_file}")
    except Exception as e:
        logger.error(f"Failed to save crawl state: {e}", exc_info=True)


def load_crawl_state(state_file: Path, current_run_base_url: str) -> bool:
    global g_processed_urls, g_url_queue, g_base_domain

    current_run_domain = get_url_domain(current_run_base_url)
    if not current_run_domain:
        logger.error(f"Cannot determine domain for current base URL '{current_run_base_url}'. Cannot load state.")
        g_base_domain = "" # Ensure it's reset
        return False

    if state_file.exists():
        try:
            with state_file.open("r", encoding="utf-8") as f:
                loaded_state_data = json.load(f)

            state_file_domain = loaded_state_data.get("base_domain")
            if state_file_domain != current_run_domain:
                logger.warning(f"Domain in state file ('{state_file_domain}') does not match current run ('{current_run_domain}'). Starting fresh.")
                g_base_domain = current_run_domain # Set to current run's domain
                g_processed_urls = set()
                g_url_queue = deque()
                return False # Indicate fresh start

            # Domains match, load the state
            g_base_domain = state_file_domain
            g_processed_urls = set(loaded_state_data.get("processed_urls", []))
            g_url_queue = deque(loaded_state_data.get("url_queue", []))
            logger.info(f"Resumed crawl state: {len(g_processed_urls)} processed, {len(g_url_queue)} in queue for domain '{g_base_domain}'.")
            return True # State loaded successfully
        except Exception as e:
            logger.error(f"Error loading state from '{state_file}', starting fresh: {e}", exc_info=True)

    # If no state file or error during load, initialize for a fresh start
    g_base_domain = current_run_domain
    g_processed_urls = set()
    g_url_queue = deque()
    return False # Indicate fresh start


def process_page_content(page_url: str, http_session: requests.Session, output_directory: Path) -> list[str]:
    global g_processed_urls, g_url_queue # Needed to check against already seen/queued links

    discovered_new_links = []
    try:
        logger.debug(f"Fetching content for: {page_url}")
        response = http_session.get(page_url, timeout=REQUEST_TIMEOUT)
        response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)

        content_type_header = response.headers.get("Content-Type", "").lower()
        if not ("html" in content_type_header or "xml" in content_type_header): # Allow XML for sitemaps etc.
            logger.info(f"Skipping non-HTML/XML content at '{page_url}' (Type: {content_type_header})")
            return []

        page_html_content = response.text

        # Determine file path structure based on URL
        parsed_page_url = urlparse(page_url)
        url_path_segments = [segment for segment in parsed_page_url.path.split('/') if segment] # Filter empty segments

        target_save_directory = output_directory
        file_base_name = "index" # Default for directory-like URLs (e.g., /about/)

        if url_path_segments:
            last_segment = url_path_segments[-1]
            if Path(last_segment).suffix: # If last segment looks like a file (e.g., page.html)
                target_save_directory = output_directory.joinpath(*url_path_segments[:-1])
                file_base_name = Path(last_segment).stem # Use filename without extension
            else: # Last segment is a directory name
                target_save_directory = output_directory.joinpath(*url_path_segments)
                # file_base_name remains "index"

        target_save_directory.mkdir(parents=True, exist_ok=True)

        # Define file paths for HTML and Markdown
        html_output_path = target_save_directory / f"{file_base_name}.html"
        md_output_path = target_save_directory / f"{file_base_name}.md"

        # Save raw HTML content
        with html_output_path.open("w", encoding="utf-8", errors="replace") as f:
            f.write(page_html_content)

        # Parse HTML with BeautifulSoup and convert to Markdown
        soup = BeautifulSoup(page_html_content, "html.parser")
        html_title_tag = soup.title.string.strip() if soup.title and soup.title.string else "No Title"

        markdown_converter = HTML2Text()
        markdown_converter.body_width = 0 # No line wrapping
        markdown_converter.ignore_links = False # Keep links for context
        markdown_converter.ignore_images = True # Typically not needed for text processing
        markdown_content_body = markdown_converter.handle(page_html_content)

        # Prepend HTML title as H1 in Markdown
        final_markdown_text = f"# {html_title_tag}\n\n{markdown_content_body}"
        with md_output_path.open("w", encoding="utf-8", errors="replace") as f:
            f.write(final_markdown_text)

        # Log relative path for cleaner output
        relative_md_log_path = md_output_path.relative_to(output_directory.parent if output_directory.parent else output_directory)
        logger.info(f"Saved: '{page_url}' (Title: '{html_title_tag}') to '{relative_md_log_path}'")

        # Extract and filter new links from the page
        for anchor_tag in soup.find_all("a", href=True):
            link_href_attr = anchor_tag["href"]
            if is_link_crawlable(link_href_attr, page_url): # Checks domain and filters
                normalized_link_url = normalize_url(link_href_attr, page_url)
                if normalized_link_url and \
                        normalized_link_url not in g_processed_urls and \
                        normalized_link_url not in g_url_queue:
                    discovered_new_links.append(normalized_link_url)

        return list(set(discovered_new_links)) # Return unique new links found on this page

    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed for '{page_url}': {e}")
    except IOError as e:
        logger.error(f"File I/O error while processing '{page_url}': {e}")
    except Exception as e:
        logger.error(f"Unexpected error processing page '{page_url}': {e}", exc_info=True)
    return [] # Return empty list on error


def signal_interrupt_handler(sig, frame):
    global g_stop_crawling, g_output_dir # Access globals
    if g_stop_crawling: # If already trying to stop (e.g., second Ctrl+C)
        logger.warning("Second interrupt signal received. Forcing exit...")
        sys.exit(1) # Force exit
    logger.warning("Interrupt signal received. Attempting graceful shutdown...")
    g_stop_crawling = True
    # Note: Actual state saving happens in the finally block of the main crawl loop


def run_crawl_main_loop(start_url: str, output_dir: Path, max_pages: int, resume_crawl: bool, ignore_robots_txt: bool, request_delay: float, save_interval: int):
    global g_processed_urls, g_url_queue, g_base_domain, g_output_dir, g_stop_crawling

    g_output_dir = output_dir # Set global for signal handler access

    # Load state or initialize for a fresh start
    if resume_crawl:
        load_crawl_state(output_dir / "crawler_state.json", start_url)
    else: # Fresh start
        g_processed_urls = set()
        g_url_queue = deque()
        g_base_domain = get_url_domain(start_url)

    if not g_base_domain: # Critical: if base domain couldn't be determined
        logger.critical(f"Could not determine base domain for start URL '{start_url}'. Aborting crawl.")
        return

    # Define state and sitemap file paths
    state_file_path = output_dir / "crawler_state.json"
    sitemap_file_path = output_dir / "sitemap.json"

    # Initialize queue if empty (fresh start or empty loaded queue)
    if not g_url_queue:
        normalized_start_url = normalize_url(start_url, start_url) # Normalize start_url against itself
        if normalized_start_url:
            g_url_queue.append(normalized_start_url)
        else:
            logger.critical(f"Start URL '{start_url}' could not be normalized. Aborting crawl.")
            return

    # Setup HTTP session and RobotsChecker
    http_session = create_http_session()
    robots_checker = RobotsChecker(start_url) if not ignore_robots_txt else None

    # Register signal handlers for graceful interruption (Ctrl+C)
    signal.signal(signal.SIGINT, signal_interrupt_handler)
    signal.signal(signal.SIGTERM, signal_interrupt_handler)

    processed_pages_since_last_save = 0

    # Progress bar setup
    pbar_initial_processed_count = len(g_processed_urls)
    # Target total for pbar is max_pages, but it won't exceed this.
    # The actual number of items to process is dynamic due to queue changes.
    pbar_display_total = max_pages

    with tqdm(total=pbar_display_total, initial=pbar_initial_processed_count, unit="page", desc=f"Crawling {g_base_domain}") as pbar:
        try:
            while g_url_queue and len(g_processed_urls) < max_pages and not g_stop_crawling:
                current_url_to_crawl = g_url_queue.popleft()

                if current_url_to_crawl in g_processed_urls:
                    logger.debug(f"URL '{current_url_to_crawl}' already processed (found in queue). Skipping.")
                    # Don't update pbar here, it was counted when first added to g_processed_urls
                    continue

                # Safeguard: Check domain again (should be handled by is_link_crawlable, but good for direct queue manipulation)
                if get_url_domain(current_url_to_crawl) != g_base_domain:
                    logger.warning(f"Skipping off-domain URL from queue: '{current_url_to_crawl}' (Expected: '{g_base_domain}')")
                    g_processed_urls.add(current_url_to_crawl) # Mark as processed to avoid re-queueing
                    if pbar.n < pbar.total: pbar.update(1) # Update progress if not yet at total
                    continue

                # Check robots.txt permission
                if robots_checker and not robots_checker.is_allowed(current_url_to_crawl):
                    logger.info(f"Skipping URL disallowed by robots.txt: '{current_url_to_crawl}'")
                    g_processed_urls.add(current_url_to_crawl) # Mark as processed
                    if pbar.n < pbar.total: pbar.update(1)
                    continue

                # Process the page (fetch, save, extract links)
                newly_discovered_links = process_page_content(current_url_to_crawl, http_session, output_dir)
                g_processed_urls.add(current_url_to_crawl) # Add to processed set *after* attempting to process
                if pbar.n < pbar.total: pbar.update(1) # Increment progress bar

                # Add newly discovered valid links to the queue
                for new_link_url in newly_discovered_links:
                    # Redundant checks (already in is_link_crawlable/normalize_url) but safe
                    if new_link_url not in g_processed_urls and new_link_url not in g_url_queue:
                        g_url_queue.append(new_link_url)

                # Dynamically adjust pbar.total if the queue grows, but not beyond max_pages
                # This makes the progress bar more representative of "work to do"
                current_potential_total = min(max_pages, len(g_url_queue) + len(g_processed_urls))
                if current_potential_total > pbar.total and pbar.total < max_pages:
                    pbar.total = current_potential_total
                    # pbar.refresh() # Not always needed, tqdm updates total on next iteration

                processed_pages_since_last_save += 1
                if processed_pages_since_last_save >= save_interval:
                    save_crawl_state(state_file_path, sitemap_file_path)
                    processed_pages_since_last_save = 0 # Reset counter

                # Apply delay if specified
                if request_delay > 0 and not g_stop_crawling: # Don't delay if stopping
                    time.sleep(request_delay)

        except Exception as e: # Catch any unexpected errors during the main loop
            logger.critical(f"Critical error occurred in the crawl loop: {e}", exc_info=True)
        finally:
            # This block executes whether the loop finished normally, by interruption, or error
            logger.info("Crawl loop is ending. Saving final state...")
            save_crawl_state(state_file_path, sitemap_file_path)
            http_session.close() # Close the HTTP session

            # Log summary
            actual_processed_this_run = pbar.n - pbar_initial_processed_count
            logger.info(f"Crawl finished or was interrupted. Processed in this session: {actual_processed_this_run} pages.")
            logger.info(f"Total unique URLs in sitemap ('{sitemap_file_path.name}'): {len(g_processed_urls)}.")
            if g_stop_crawling:
                logger.info("Crawl was stopped due to an interrupt signal.")


if __name__ == "__main__":
    # Argument parsing
    parser = argparse.ArgumentParser(
        description="St. Paul's School Full-Site Crawler (Corrected)",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter # Shows default values in --help
    )
    parser.add_argument("--base", required=True, help="Base URL to start crawling (e.g., https://www.stpauls.br)")
    parser.add_argument("--out", required=True, type=Path, help="Output directory for crawled data")
    parser.add_argument("--max", type=int, default=MAX_PAGES_DEFAULT, help="Maximum number of pages to crawl")
    parser.add_argument("--delay", type=float, default=DELAY_BETWEEN_REQUESTS_DEFAULT, help="Delay in seconds between requests")
    parser.add_argument("--save-interval", type=int, default=SAVE_STATE_INTERVAL_DEFAULT, help="Save state every N pages processed")
    parser.add_argument("--no-resume", action="store_true", help="Start a fresh crawl, ignoring any saved state.")
    parser.add_argument("--ignore-robots", action="store_true", help="Ignore robots.txt rules.")
    parser.add_argument("--verbose", "-v", action="store_true", help="Enable verbose (DEBUG level) logging.")

    g_cmd_args = parser.parse_args() # Store parsed args globally

    # Configure logging level based on verbosity
    if g_cmd_args.verbose:
        logger.setLevel(logging.DEBUG)
        # Ensure all handlers also get the DEBUG level
        for handler in logger.handlers:
            handler.setLevel(logging.DEBUG)

    # Create output directory if it doesn't exist
    try:
        g_cmd_args.out.mkdir(parents=True, exist_ok=True)
    except Exception as e:
        logger.critical(f"Could not create output directory '{g_cmd_args.out}': {e}")
        sys.exit(1)

    # Setup file logging now that output directory is confirmed
    setup_file_logging(g_cmd_args.out / "crawler.log")

    # Log initial crawler configuration
    logger.info(f"Crawler starting. Config: Base='{g_cmd_args.base}', Output='{g_cmd_args.out}', MaxPages='{g_cmd_args.max}', Delay='{g_cmd_args.delay}', SaveInterval='{g_cmd_args.save_interval}'")
    if g_cmd_args.no_resume:
        logger.info("Fresh crawl initiated (--no-resume specified). Any previous state will be ignored.")
    if g_cmd_args.ignore_robots:
        logger.info("robots.txt checking will be skipped (--ignore-robots specified).")
    if not REPPY_AVAILABLE and not g_cmd_args.ignore_robots:
        logger.warning("'reppy' library not found, robots.txt checking is disabled. Use --ignore-robots to suppress this warning or install 'reppy'.")


    # Main execution block
    try:
        run_crawl_main_loop(
            start_url=g_cmd_args.base,
            output_dir=g_cmd_args.out,
            max_pages=g_cmd_args.max,
            resume_crawl=not g_cmd_args.no_resume,
            ignore_robots_txt=g_cmd_args.ignore_robots,
            request_delay=g_cmd_args.delay,
            save_interval=g_cmd_args.save_interval
        )
    except KeyboardInterrupt: # Catch Ctrl+C at the outermost level
        logger.warning("KeyboardInterrupt caught at main execution level. Crawler is shutting down.")
        # State saving should have been handled by the signal handler and/or finally block in run_crawl_main_loop
        sys.exit(130) # Standard exit code for Ctrl+C
    except Exception as e:
        logger.critical(f"An unhandled critical exception occurred at the main execution level: {e}", exc_info=True)
        sys.exit(1) # General error exit code

    logger.info("Crawler finished all tasks successfully.")
    sys.exit(0) # Success