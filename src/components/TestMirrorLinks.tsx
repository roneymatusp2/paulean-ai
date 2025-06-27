import React from 'react';
import { getLinkForMirroredSite } from '../utils/getLinkForMirroredSite';

const TestMirrorLinks: React.FC = () => {
  // Simulate AI response sources
  const testSources = [
    {
      title: "About St. Paul's School",
      url: "https://www.stpauls.br/about-us"
    },
    {
      title: "Academic Excellence",
      url: "https://www.stpauls.br/academic"
    },
    {
      title: "Admissions Process", 
      url: "https://www.stpauls.br/admissions"
    },
    {
      title: "School Life",
      url: "https://www.stpauls.br/school-life"
    },
    {
      title: "Contact Us",
      url: "https://www.stpauls.br/contact-us.html"
    }
  ];

  return (
    <div style={{ 
      margin: '20px',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: '20px' }}>Test Mirror Links - Simulated AI Response</h2>
      
      <div style={{ 
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '8px',
        marginBottom: '15px'
      }}>
        <p style={{ marginBottom: '10px' }}>
          This is a simulated AI response. Check if the source links below correctly point to the mirror:
        </p>
      </div>

      <div style={{ 
        padding: '15px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px'
      }}>
        <h4 style={{ marginBottom: '10px' }}>Sources:</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {testSources.map((source, index) => {
            const mirroredUrl = getLinkForMirroredSite(source.url);
            
            return (
              <li key={index} style={{ marginBottom: '15px' }}>
                <a
                  href={mirroredUrl}
                  style={{ 
                    color: '#003366',
                    textDecoration: 'none',
                    display: 'block',
                    padding: '10px',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                  onClick={() => {
                    console.log('=== TEST LINK CLICK ===');
                    console.log('Original:', source.url);
                    console.log('Mirror:', mirroredUrl);
                    // Allow default navigation
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{source.title}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    Original: {source.url}
                  </div>
                  <div style={{ fontSize: '12px', color: '#0066cc', marginTop: '2px' }}>
                    Mirror: {mirroredUrl}
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TestMirrorLinks;