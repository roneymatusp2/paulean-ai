import React from 'react';
import { getLinkForMirroredSite, testUrlTransformations } from './utils/getLinkForMirroredSite';

export const TestMirror: React.FC = () => {
  // Run the transformation tests on component mount
  React.useEffect(() => {
    testUrlTransformations();
  }, []);

  const testUrls = [
    'https://www.stpauls.br/',
    'https://www.stpauls.br/about-us/',
    'https://www.stpauls.br/academics/curriculum/',
    'https://www.stpauls.br/contact.html',
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mirror Link Testing</h2>
      
      <h3>1. Direct Mirror Access Test</h3>
      <p>Click to test if mirror is accessible:</p>
      <ul>
        <li><a href="/stpauls_site_mirror/index.html" target="_blank">Homepage</a></li>
        <li><a href="/stpauls_site_mirror/about-us/index.html" target="_blank">About Us</a></li>
      </ul>
      
      <h3>2. URL Transformation Test</h3>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Original URL</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Transformed URL</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Test Link</th>
          </tr>
        </thead>
        <tbody>
          {testUrls.map((url, index) => {
            const transformed = getLinkForMirroredSite(url);
            return (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{url}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transformed}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <a href={transformed} target="_blank">Test</a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <h3>3. Console Output</h3>
      <p>Check the browser console for transformation test results.</p>
    </div>
  );
};