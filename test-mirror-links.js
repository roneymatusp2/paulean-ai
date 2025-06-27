// Quick test script to verify mirror link transformations
import { getLinkForMirroredSite } from './src/utils/getLinkForMirroredSite.js';

const testUrls = [
  'https://www.stpauls.br/',
  'https://www.stpauls.br/about-us',
  'https://www.stpauls.br/about-us/',
  'https://www.stpauls.br/academic',
  'https://www.stpauls.br/admissions',
  'https://www.stpauls.br/school-life',
  'https://www.stpauls.br/contact-us.html',
];

console.log('=== Testing Mirror Link Transformations ===\n');

testUrls.forEach(url => {
  const mirrorPath = getLinkForMirroredSite(url);
  console.log(`Original: ${url}`);
  console.log(`Mirror:   ${mirrorPath}`);
  console.log('---');
});