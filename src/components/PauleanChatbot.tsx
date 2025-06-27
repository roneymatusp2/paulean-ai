import React, { useState, useRef, useEffect } from 'react'
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Sparkles, 
  Settings,
  Zap,
  Brain,
  Clock,
  Shield
} from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
  model?: string
}

interface ChatbotProps {
  isOpen: boolean
  onClose: () => void
}

const PauleanChatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<'auto' | 'o3' | 'gemini-pro' | 'gemini-flash'>('auto')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const models = [
    {
      id: 'auto' as const,
      name: 'Intelligent Routing',
      description: 'Best model automatically selected',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      badge: 'SMART'
    },
    {
      id: 'o3' as const,
      name: 'OpenAI O3',
      description: 'Advanced reasoning and analysis',
      icon: Sparkles,
      color: 'from-green-500 to-green-600',
      badge: 'PREMIUM'
    },
    {
      id: 'gemini-pro' as const,
      name: 'Gemini 2.5 Pro',
      description: 'Comprehensive educational support',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      badge: 'PRO'
    },
    {
      id: 'gemini-flash' as const,
      name: 'Gemini 2.5 Flash',
      description: 'Fast responses for quick queries',
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      badge: 'FAST'
    }
  ]

  const welcomeMessage: Message = {
    id: 'welcome',
    content: `Hello! I'm PAULEAN-AI, your intelligent educational assistant designed specifically for St. Paul's School.

I can help you with:
🎓 Lesson planning and curriculum alignment
📝 Assessment creation and marking guides  
👥 Pupil support and differentiation strategies
📧 Professional communication drafting
📊 Data analysis and reporting
💡 Creative teaching ideas and activities

How can I assist you today?`,
    sender: 'assistant',
    timestamp: new Date(),
    model: 'System'
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([welcomeMessage])
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Simulate AI response with intelligent routing
      const selectedModelInfo = models.find(m => m.id === selectedModel)
      const modelName = selectedModel === 'auto' ? 'Gemini 2.5 Pro' : selectedModelInfo?.name || 'Unknown'
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(inputValue, selectedModel),
        sender: 'assistant',
        timestamp: new Date(),
        model: modelName
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
        sender: 'assistant',
        timestamp: new Date(),
        model: 'Error Handler'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateResponse = (input: string, model: string): string => {
    const responses = {
      'lesson-planning': `I'd be delighted to help you create a comprehensive lesson plan! For St. Paul's School standards, I recommend structuring your lesson with clear learning objectives aligned to our British curriculum framework.

Key elements to include:
• Learning objectives (what pupils will know/do)
• Starter activity (5-10 minutes)
• Main teaching points with differentiation
• Pupil activities with success criteria
• Plenary and assessment opportunities

What subject and year group are you planning for? I can provide specific curriculum links and age-appropriate activities.`,

      'assessment': `Creating effective assessments is crucial for measuring pupil progress. I can help you design:

📝 **Formative Assessments:**
- Quick knowledge checks
- Exit tickets
- Peer assessment activities

📊 **Summative Assessments:**
- End of unit tests
- Practical assessments
- Portfolio evaluations

Would you like me to create a specific assessment for a particular topic or learning objective?`,

      'default': `Thank you for your question! As PAULEAN-AI, I'm here to support your educational needs with contextually relevant responses for St. Paul's School.

I understand you're asking about "${input}". Let me provide you with a comprehensive response tailored to our school's standards and British curriculum framework.

For more specific assistance, please let me know:
- Which year group you're working with
- The subject area
- Any particular learning objectives you're targeting

This helps me provide the most relevant and useful guidance for your teaching context.`
    }

    if (input.toLowerCase().includes('lesson') || input.toLowerCase().includes('plan')) {
      return responses['lesson-planning']
    } else if (input.toLowerCase().includes('assess') || input.toLowerCase().includes('test') || input.toLowerCase().includes('quiz')) {
      return responses['assessment']
    } else {
      return responses['default']
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sp-brand-blue to-sp-brand-red p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src="/logos/BRAND_ST PAULS_White Outline.png" 
                  alt="St. Paul's School" 
                  className="h-12 w-auto"
                />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                  <Bot className="w-4 h-4 text-sp-brand-blue" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold font-archer">PAULEAN-AI</h2>
                <p className="text-white/90 text-sm font-segoe">Educational Assistant for St. Paul's School</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Model Selection */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {models.map((model) => {
              const IconComponent = model.icon
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedModel === model.id
                      ? 'bg-white text-sp-brand-blue shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{model.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedModel === model.id
                      ? 'bg-sp-brand-blue text-white'
                      : 'bg-white/20 text-white'
                  }`}>
                    {model.badge}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-r from-sp-brand-blue to-sp-brand-red rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-1' : ''}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-sp-brand-blue to-sp-brand-blue/80 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-segoe leading-relaxed">{message.content}</p>
                </div>
                
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  {message.model && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {message.model}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-r from-sp-brand-blue to-sp-brand-red rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500 font-segoe">PAULEAN-AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask PAULEAN-AI about lesson planning, assessments, pupil support..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent font-segoe"
                rows={2}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-sp-brand-blue to-sp-brand-red text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 font-segoe text-center">
            PAULEAN-AI uses advanced AI routing to provide the best responses for St. Paul's School
          </div>
        </div>
      </div>
    </div>
  )
}

export default PauleanChatbot 