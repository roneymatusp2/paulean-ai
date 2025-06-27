import React, { useState } from 'react';

const MirrorViewer: React.FC = () => {
  const [iframeSrc] = useState('/stpauls_site_mirror/index.html');

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      zIndex: 9999
    }}>
      <div style={{
        height: '40px',
        backgroundColor: '#003366',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
      }}>
        <span>St. Paul's School Mirror Viewer</span>
        <button
          onClick={() => window.close()}
          style={{
            padding: '5px 15px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
      <iframe
        src={iframeSrc}
        style={{
          width: '100%',
          height: 'calc(100% - 40px)',
          border: 'none'
        }}
        title="St. Paul's Mirror"
      />
    </div>
  );
};

export default MirrorViewer;