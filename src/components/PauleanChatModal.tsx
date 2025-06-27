import React, { useEffect, useRef } from 'react';
import PauleanChat from './PauleanChat';

interface PauleanChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PauleanChatModal: React.FC<PauleanChatModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className={`
        fixed inset-0 z-50
        bg-black bg-opacity-50
        flex items-end justify-end
        transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={handleBackdropClick}
    >
      <div
        className={`
          bg-white rounded-t-2xl lg:rounded-2xl
          w-full lg:w-[500px] xl:w-[600px]
          h-[90vh] lg:h-[700px]
          max-h-[90vh]
          flex flex-col
          shadow-2xl
          transform transition-all duration-300 ease-out
          ${isOpen ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-y-0 lg:translate-x-full'}
          lg:mr-6 lg:mb-6
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
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
        <div className="flex-1 overflow-hidden">
          <PauleanChat />
        </div>
      </div>
    </div>
  );
};

export default PauleanChatModal;