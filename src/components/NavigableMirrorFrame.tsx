import React, { useState, useRef } from 'react';

interface NavigableMirrorFrameProps {
  initialPath?: string;
}

const NavigableMirrorFrame: React.FC<NavigableMirrorFrameProps> = ({ 
  initialPath = '/stpauls_site_mirror/index.html' 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentPath, setCurrentPath] = useState(initialPath);
  
  // Handle navigation within the iframe
  const handleIframeLoad = () => {
    try {
      if (iframeRef.current?.contentWindow) {
        // Intercept link clicks in the iframe
        const links = iframeRef.current.contentWindow.document.getElementsByTagName('a');
        Array.from(links).forEach(link => {
          link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
              e.preventDefault();
              // Navigate within the mirror
              const newPath = href.startsWith('/') ? href : `/${href}`;
              setCurrentPath(`/stpauls_site_mirror${newPath}`);
            }
          });
        });
      }
    } catch (error) {
      // Cross-origin restrictions may prevent accessing iframe content
      console.log('Cannot access iframe content due to cross-origin restrictions');
    }
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      zIndex: 1
    }}>
      <iframe
        ref={iframeRef}
        src={currentPath}
        style={{
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        title="St. Paul's School Mirror"
        onLoad={handleIframeLoad}
      />
    </div>
  );
};

export default NavigableMirrorFrame;