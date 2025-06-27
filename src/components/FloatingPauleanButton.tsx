import React from 'react';

interface FloatingPauleanButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const FloatingPauleanButton: React.FC<FloatingPauleanButtonProps> = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-50
        w-16 h-16 
        bg-gradient-to-br from-blue-600 to-blue-700
        hover:from-blue-700 hover:to-blue-800
        rounded-full
        shadow-lg hover:shadow-xl
        transform transition-all duration-300
        hover:scale-110
        flex items-center justify-center
        group
        overflow-hidden
        ${isOpen ? 'scale-95' : ''}
      `}
      aria-label={isOpen ? "Close Paulean AI Chat" : "Open Paulean AI Chat"}
    >
      {isOpen ? (
        // Close icon when chat is open
        <svg
          className="w-8 h-8 transition-transform duration-300 group-hover:scale-110 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        // Paulean AI icon
        <img
          src="/paulean_ai.png"
          alt="Paulean AI"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      )}
      
      {/* Notification dot */}
      {!isOpen && (
        <span className="absolute top-0 right-0 block h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
      
      {/* Tooltip */}
      <span className={`
        absolute right-full mr-3 top-1/2 -translate-y-1/2
        bg-gray-900 text-white text-sm rounded-lg px-3 py-2
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        whitespace-nowrap
        pointer-events-none
        ${isOpen ? 'hidden' : ''}
      `}>
        Chat with Paulean AI
      </span>
    </button>
  );
};

export default FloatingPauleanButton;