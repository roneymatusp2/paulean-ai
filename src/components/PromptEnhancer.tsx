import React, { useState } from 'react'
import { Sparkles, Wand2, X } from 'lucide-react'

interface PromptEnhancerProps {
  onEnhance: (enhanced: boolean) => void
  isEnhanced: boolean
}

const PromptEnhancer: React.FC<PromptEnhancerProps> = ({ onEnhance, isEnhanced }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => onEnhance(!isEnhanced)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
          ${isEnhanced 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
            : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
          }
        `}
      >
        {isEnhanced ? (
          <>
            <Wand2 className="w-4 h-4" />
            Enhanced
            <X className="w-3 h-3 ml-1" />
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Enhance
          </>
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            {isEnhanced 
              ? 'Enhanced mode: More detailed, comprehensive content'
              : 'Click to enhance: Get more detailed and creative results'
            }
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PromptEnhancer 