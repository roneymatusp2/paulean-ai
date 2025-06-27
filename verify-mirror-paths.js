const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Function to check HTML files for absolute paths
function checkHtmlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);
  const issues = [];
  
  // Check links
  $('link[href]').each((i, elem) => {
    const href = $(elem).attr('href');
    if (href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//'))) {
      issues.push({ file: filePath, type: 'link', value: href });
    }
  });
  
  // Check scripts
  $('script[src]').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src && (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//'))) {
      issues.push({ file: filePath, type: 'script', value: src });
    }
  });
  
  // Check images
  $('img[src]').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src && (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//'))) {
      issues.push({ file: filePath, type: 'img', value: src });
    }
  });
  
  // Check anchors
  $('a[href]').each((i, elem) => {
    const href = $(elem).attr('href');
    if (href && href.startsWith('https://www.stpauls.br')) {
      issues.push({ file: filePath, type: 'anchor', value: href });
    }
  });
  
  return issues;
}

// Recursively find all HTML files
function findHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html') || item.endsWith('.htm')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main function
function verifyMirror(mirrorPath) {
  console.log(`Checking mirror at: ${mirrorPath}`);
  
  if (!fs.existsSync(mirrorPath)) {
    console.error('Mirror path does not exist!');
    return;
  }
  
  const htmlFiles = findHtmlFiles(mirrorPath);
  console.log(`Found ${htmlFiles.length} HTML files`);
  
  let totalIssues = 0;
  
  for (const file of htmlFiles) {
    const issues = checkHtmlFile(file);
    if (issues.length > 0) {
      console.log(`\nIssues in ${path.relative(mirrorPath, file)}:`);
      issues.forEach(issue => {
        console.log(`  - ${issue.type}: ${issue.value}`);
      });
      totalIssues += issues.length;
    }
  }
  
  console.log(`\nTotal issues found: ${totalIssues}`);
  
  if (totalIssues === 0) {
    console.log('Great! No absolute paths found. The mirror should work correctly.');
  } else {
    console.log('Some absolute paths were found. You may need to update these manually.');
  }
}

// Run verification
const mirrorPath = path.join(__dirname, 'public', 'stpauls_site_mirror');
verifyMirror(mirrorPath);