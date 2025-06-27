import React from 'react';

interface MirrorFrameProps {
  path?: string;
}

const MirrorFrame: React.FC<MirrorFrameProps> = ({ path = '/stpauls_site_mirror/index.html' }) => {
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
        src={path}
        style={{
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        title="St. Paul's School Mirror"
      />
    </div>
  );
};

export default MirrorFrame;