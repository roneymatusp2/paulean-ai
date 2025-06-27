/**
 * Transform a canonical stpauls.br URL to the local mirror path
 * Handles various URL formats and wget output conventions
 */
export function getLinkForMirroredSite(originalUrl: string): string {
  try {
    // Log for debugging
    console.log('Transforming URL:', originalUrl);
    
    // Parse the URL
    const url = new URL(originalUrl);
    
    // Only transform stpauls.br URLs
    if (!url.hostname.includes('stpauls.br')) {
      console.warn(`URL ${originalUrl} is not from stpauls.br, returning original`);
      return originalUrl;
    }
    
    // Start with the base mirror path
    let mirrorPath = '/stpauls_site_mirror';
    
    // Get the pathname
    let pathname = url.pathname;
    
    // Remove trailing slash for processing
    if (pathname.endsWith('/') && pathname !== '/') {
      pathname = pathname.slice(0, -1);
    }
    
    // Handle root path
    if (pathname === '/' || pathname === '') {
      return `${mirrorPath}/index.html`;
    }
    
    // Remove leading slash for concatenation
    if (pathname.startsWith('/')) {
      pathname = pathname.substring(1);
    }
    
    // Check if the path already has an extension
    const hasExtension = /\.[a-zA-Z0-9]+$/.test(pathname);
    
    if (hasExtension) {
      // Already has extension, use as is
      mirrorPath += `/${pathname}`;
    } else {
      // No extension - Based on our mirror, these are .html files
      mirrorPath = `${mirrorPath}/${pathname}.html`;
      console.log(`No extension found. Using: ${mirrorPath}`);
    }
    
    return mirrorPath;
    
  } catch (error) {
    console.error('Error transforming URL:', error);
    // If we can't parse the URL, try a simple string replacement
    return originalUrl
      .replace('https://www.stpauls.br', '/stpauls_site_mirror')
      .replace('http://www.stpauls.br', '/stpauls_site_mirror')
      .replace('https://stpauls.br', '/stpauls_site_mirror')
      .replace('http://stpauls.br', '/stpauls_site_mirror');
  }
}

// Example transformations
export const URL_TRANSFORM_EXAMPLES = [
  {
    input: 'https://www.stpauls.br/',
    output: '/stpauls_site_mirror/index.html',
    description: 'Homepage'
  },
  {
    input: 'https://www.stpauls.br/about-us/',
    output: '/stpauls_site_mirror/about-us.html',
    description: 'About Us with trailing slash'
  },
  {
    input: 'https://www.stpauls.br/about-us',
    output: '/stpauls_site_mirror/about-us.html',
    description: 'About Us without trailing slash'
  },
  {
    input: 'https://www.stpauls.br/contact-us.html',
    output: '/stpauls_site_mirror/contact-us.html',
    description: 'Contact with extension'
  },
  {
    input: 'https://www.stpauls.br/admissions',
    output: '/stpauls_site_mirror/admissions.html',
    description: 'Admissions page'
  },
  {
    input: 'https://www.stpauls.br/academic',
    output: '/stpauls_site_mirror/academic.html',
    description: 'Academic section'
  },
  {
    input: 'https://www.stpauls.br/school-life',
    output: '/stpauls_site_mirror/school-life.html',
    description: 'School Life section'
  },
  {
    input: 'https://www.stpauls.br/alumni',
    output: '/stpauls_site_mirror/alumni.html',
    description: 'Alumni section'
  }
];

// Export a test function for verification
export function testUrlTransformations() {
  console.log('Testing URL transformations:\n');
  
  URL_TRANSFORM_EXAMPLES.forEach(example => {
    const result = getLinkForMirroredSite(example.input);
    const isCorrect = result === example.output;
    
    console.log(`Input: ${example.input}`);
    console.log(`Expected: ${example.output}`);
    console.log(`Actual: ${result}`);
    console.log(`Status: ${isCorrect ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`Description: ${example.description}\n`);
  });
}