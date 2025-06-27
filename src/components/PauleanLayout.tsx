import React, { useState } from 'react';
import FloatingPauleanButton from './FloatingPauleanButton';
import PauleanChatModal from './PauleanChatModal';

interface PauleanLayoutProps {
  children: React.ReactNode;
}

const PauleanLayout: React.FC<PauleanLayoutProps> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Main app content */}
      {children}
      
      {/* Floating Action Button */}
      <FloatingPauleanButton 
        onClick={toggleChat} 
        isOpen={isChatOpen} 
      />
      
      {/* Chat Modal */}
      <PauleanChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
};

export default PauleanLayout;