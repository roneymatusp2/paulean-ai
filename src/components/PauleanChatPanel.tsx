import React, { useEffect, useRef } from 'react';
import PauleanChat from './PauleanChat';

interface PauleanChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PauleanChatPanel: React.FC<PauleanChatPanelProps> = ({ isOpen, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when panel is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 bg-black transition-opacity duration-300 z-40
          ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div
        ref={panelRef}
        className={`
          fixed right-0 top-0 h-full z-50
          bg-white shadow-2xl
          w-full sm:w-[480px] lg:w-[600px]
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center gap-3">
            {/* St. Paul's Logo or AI Icon */}
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Paulean AI</h2>
              <p className="text-sm text-blue-100">St. Paul's School Assistant</p>
            </div>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            aria-label="Close chat"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Chat Content */}
        <div className="h-full pb-16">
          <PauleanChat />
        </div>
      </div>
    </>
  );
};

export default PauleanChatPanel;