import React from 'react';
import { getLinkForMirroredSite, URL_TRANSFORM_EXAMPLES } from '../utils/getLinkForMirroredSite';

const DebugUrlTransformations: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', margin: '20px' }}>
      <h2>URL Transformation Debug</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#e0e0e0' }}>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Original URL</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Expected Mirror Path</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Actual Result</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {URL_TRANSFORM_EXAMPLES.map((example, index) => {
            const actual = getLinkForMirroredSite(example.input);
            const isCorrect = actual === example.output;
            
            return (
              <tr key={index}>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                  {example.input}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                  {example.output}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                  {actual}
                </td>
                <td 
                  style={{ 
                    padding: '8px', 
                    border: '1px solid #ccc',
                    backgroundColor: isCorrect ? '#c8e6c9' : '#ffcdd2',
                    color: isCorrect ? '#2e7d32' : '#c62828'
                  }}
                >
                  {isCorrect ? '✓ PASS' : '✗ FAIL'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <h3 style={{ marginTop: '20px' }}>Test a Custom URL</h3>
      <input
        type="text"
        id="custom-url"
        placeholder="Enter a stpauls.br URL to test"
        style={{ width: '400px', padding: '8px', marginRight: '10px' }}
      />
      <button 
        onClick={() => {
          const input = document.getElementById('custom-url') as HTMLInputElement;
          const result = getLinkForMirroredSite(input.value);
          alert(`Original: ${input.value}\nMirror Path: ${result}`);
        }}
        style={{ padding: '8px 16px' }}
      >
        Test URL
      </button>
    </div>
  );
};

export default DebugUrlTransformations;