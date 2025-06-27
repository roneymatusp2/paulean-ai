/**
 * Utility to transform canonical URLs to mirrored site links
 */

export function getMirroredSiteLink(originalUrl: string): string {
  try {
    // Remove the protocol and domain
    const url = new URL(originalUrl);
    let path = url.pathname;
    
    // Remove leading slash
    if (path.startsWith('/')) {
      path = path.substring(1);
    }
    
    // Handle root path
    if (path === '' || path === '/') {
      return '/stpauls_site_mirror/index.html';
    }
    
    // Remove trailing slash
    if (path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    
    // Check if the path has a file extension
    const hasExtension = /\.[^/]+$/.test(path);
    
    if (hasExtension) {
      // Already has an extension, just prepend the mirror path
      return `/stpauls_site_mirror/${path}`;
    } else {
      // No extension, assume it's a directory and needs index.html
      return `/stpauls_site_mirror/${path}/index.html`;
    }
  } catch (error) {
    console.error('Error transforming URL:', error);
    // Fallback to a simple transformation
    const path = originalUrl.replace('https://www.stpauls.br/', '').replace('http://www.stpauls.br/', '');
    if (!path || path === '/') {
      return '/stpauls_site_mirror/index.html';
    }
    return `/stpauls_site_mirror/${path}`;
  }
}