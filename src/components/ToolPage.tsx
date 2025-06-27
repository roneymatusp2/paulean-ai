import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  Copy, 
  Download, 
  Share2, 
  Sparkles,
  BookOpen,
  PenTool,
  Users,
  MessageCircle,
  BarChart3,
  Lightbulb,
  Star,
  Clock,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
  Brain,
  Cpu
} from 'lucide-react'
import { advancedAIService, type AIRequest } from '../services/aiService'

const ToolPage = () => {
  const { toolId } = useParams()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [formData, setFormData] = useState<Record<string, string>>({})

  // Mock tool data - in real app, this would come from an API
  const getToolData = (id: string) => {
    const tools: Record<string, any> = {
      '1': {
        name: 'Lesson Plan Generator',
        category: 'Planning',
        icon: BookOpen,
        description: 'Create comprehensive lesson plans aligned with curriculum standards in minutes',
        color: 'bg-sp-brand-blue',
        fields: [
          { name: 'subject', label: 'Subject', type: 'select', options: ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Art', 'Music', 'PE'], required: true },
          { name: 'yearGroup', label: 'Year Group', type: 'select', options: ['Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'], required: true },
          { name: 'topic', label: 'Lesson Topic', type: 'text', placeholder: 'e.g., Introduction to Fractions', required: true },
          { name: 'duration', label: 'Lesson Duration', type: 'select', options: ['30 minutes', '45 minutes', '60 minutes', '90 minutes'], required: true },
          { name: 'objectives', label: 'Learning Objectives', type: 'textarea', placeholder: 'What should pupils learn by the end of this lesson?', required: true },
          { name: 'priorKnowledge', label: 'Prior Knowledge Required', type: 'textarea', placeholder: 'What should pupils already know?', required: false },
          { name: 'resources', label: 'Available Resources', type: 'textarea', placeholder: 'List any specific resources or materials available', required: false }
        ]
      },
      '16': {
        name: 'Quiz Generator',
        category: 'Assessment',
        icon: PenTool,
        description: 'Generate quizzes with various question types',
        color: 'bg-sp-brand-red',
        fields: [
          { name: 'subject', label: 'Subject', type: 'select', options: ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Art', 'Music', 'PE'], required: true },
          { name: 'yearGroup', label: 'Year Group', type: 'select', options: ['Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'], required: true },
          { name: 'topic', label: 'Quiz Topic', type: 'text', placeholder: 'e.g., World War II', required: true },
          { name: 'questionCount', label: 'Number of Questions', type: 'select', options: ['5', '10', '15', '20', '25'], required: true },
          { name: 'questionTypes', label: 'Question Types', type: 'select', options: ['Multiple Choice', 'True/False', 'Short Answer', 'Mixed'], required: true },
          { name: 'difficulty', label: 'Difficulty Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'], required: true },
          { name: 'instructions', label: 'Special Instructions', type: 'textarea', placeholder: 'Any specific requirements or focus areas?', required: false }
        ]
      }
    }
    return tools[id] || tools['1'] // Default to lesson plan generator
  }

  const toolData = getToolData(toolId || '1')

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const [aiResponse, setAiResponse] = useState<{
    provider: string
    model: string
    tokens?: number
    cost?: number
    duration?: number
  } | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setAiResponse(null)
    
    try {
      // Create AI request
      const aiRequest: AIRequest = {
        toolId: toolId || '1',
        toolName: toolData.name,
        category: toolData.category,
        formData: formData,
        userId: 'current-user' // In real app, get from auth
      }

      console.log('🚀 Generating content with AI...', aiRequest)
      
      // Call real AI service
      const response = await advancedAIService.generateContent(aiRequest)
      
      if (response.success) {
        setGeneratedContent(response.content)
        setAiResponse({
          provider: response.provider,
          model: response.model,
          tokens: response.tokens,
          cost: response.cost,
          duration: Date.now() // This would be calculated in the service
        })
        console.log('✅ AI Generation successful:', response)
      } else {
        console.error('❌ AI Generation failed:', response.error)
        setGeneratedContent(`# Error Generating Content

⚠️ **Generation Failed**

**Error:** ${response.error}

**Provider:** ${response.provider}
**Model:** ${response.model}

Please try again or contact support if the issue persists.

---

**Troubleshooting Tips:**
- Check your internet connection
- Ensure all required fields are filled
- Try simplifying your request
- Contact support if errors persist`)
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error)
      setGeneratedContent(`# Unexpected Error

⚠️ **Something went wrong**

An unexpected error occurred while generating your content. Please try again.

**Error Details:**
${error instanceof Error ? error.message : 'Unknown error'}

If this problem persists, please contact our support team.`)
    }
    
    setIsGenerating(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    // Show toast notification
  }

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${toolData.name.toLowerCase().replace(/\s+/g, '-')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const IconComponent = toolData.icon

  const tips = [
    "Be specific with your requirements for better results",
    "Include learning objectives to align with curriculum standards",
    "Consider your pupils' prior knowledge when setting difficulty",
    "Review and customise the generated content to fit your teaching style",
    "Save successful prompts for future use"
  ]

  return (
    <div className="min-h-screen bg-sp-bg-light">
      {/* Header */}
      <header className="bg-sp-bg-white shadow-sm border-b border-sp-bg-medium sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="p-2 hover:bg-sp-bg-light rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-sp-text-medium" />
              </Link>
              
              <div className="flex items-center space-x-3">
                <div className={`${toolData.color} p-2 rounded-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-sp-text-primary font-archer">{toolData.name}</h1>
                  <p className="text-sm text-sp-text-medium font-segoe">{toolData.description}</p>
                </div>
              </div>
            </div>
            
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/logos/BRAND_ST PAULS_Primary logo_P.png" 
                alt="St. Paul's School" 
                className="h-8 w-auto"
              />
              <div className="border-l border-sp-bg-medium pl-2">
                <div className="text-sm font-bold text-sp-brand-blue font-archer">PauleanAI</div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-sp-bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-sp-brand-red" />
                <h2 className="text-lg font-bold text-sp-text-primary font-archer">Generate Content</h2>
              </div>
              
              <form className="space-y-6">
                {toolData.fields.map((field: any) => (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-sp-text-primary mb-2 font-archer">
                      {field.label}
                      {field.required && <span className="text-sp-brand-red ml-1">*</span>}
                    </label>
                    
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full px-4 py-3 border border-sp-bg-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent font-segoe"
                        required={field.required}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map((option: string) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full px-4 py-3 border border-sp-bg-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent resize-none font-segoe"
                        required={field.required}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border border-sp-bg-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent font-segoe"
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-sp-brand-red to-sp-brand-red/90 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-sp-hover transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Generate {toolData.category === 'Planning' ? 'Lesson Plan' : 'Quiz'}
                    </>
                  )}
                </button>
              </form>

              {/* Tips Section */}
              <div className="mt-8 p-4 bg-sp-brand-blue/5 rounded-xl border border-sp-brand-blue/10">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-sp-brand-blue" />
                  <h3 className="font-semibold text-sp-brand-blue font-archer">Tips for Better Results</h3>
                </div>
                <ul className="space-y-2">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-sp-text-medium font-segoe">
                      <CheckCircle className="w-4 h-4 text-sp-brand-blue mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Output Area */}
          <div className="lg:col-span-2">
            <div className="bg-sp-bg-white rounded-2xl shadow-card">
              {/* Output Header */}
              <div className="flex items-center justify-between p-6 border-b border-sp-bg-medium">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sp-brand-blue/10 rounded-lg">
                    <BookOpen className="w-5 h-5 text-sp-brand-blue" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-sp-text-primary font-archer">Generated Content</h2>
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-sp-text-medium font-segoe">
                        {generatedContent ? 'Ready to use' : 'Fill the form and click generate'}
                      </p>
                      {aiResponse && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 px-2 py-1 bg-sp-brand-blue/10 rounded-full">
                            <Brain className="w-3 h-3 text-sp-brand-blue" />
                            <span className="text-xs font-medium text-sp-brand-blue">{aiResponse.provider}</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-sp-text-secondary/10 rounded-full">
                            <Cpu className="w-3 h-3 text-sp-text-secondary" />
                            <span className="text-xs font-medium text-sp-text-secondary">{aiResponse.model}</span>
                          </div>
                          {aiResponse.tokens && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-sp-brand-red/10 rounded-full">
                              <Zap className="w-3 h-3 text-sp-brand-red" />
                              <span className="text-xs font-medium text-sp-brand-red">{aiResponse.tokens} tokens</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {generatedContent && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 text-sp-text-medium hover:text-sp-brand-blue hover:bg-sp-bg-light rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-2 text-sp-text-medium hover:text-sp-brand-blue hover:bg-sp-bg-light rounded-lg transition-colors"
                      title="Download as file"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 text-sp-text-medium hover:text-sp-brand-blue hover:bg-sp-bg-light rounded-lg transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Output Content */}
              <div className="p-6">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-sp-brand-blue/20 border-t-sp-brand-blue rounded-full animate-spin"></div>
                      <Brain className="w-6 h-6 text-sp-brand-red absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h3 className="text-lg font-semibold text-sp-text-primary mt-4 font-archer">
                      Generating your {toolData.category === 'Planning' ? 'lesson plan' : toolData.category === 'Assessment' ? 'quiz' : 'content'}...
                    </h3>
                    <p className="text-sp-text-medium text-center max-w-md mt-2 font-segoe">
                      Our AI is creating personalised content based on your requirements. This may take a few moments.
                    </p>
                    
                    {/* AI Routing Info */}
                    <div className="mt-6 p-4 bg-sp-bg-light rounded-xl border border-sp-bg-medium max-w-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu className="w-4 h-4 text-sp-brand-blue" />
                        <span className="text-sm font-semibold text-sp-brand-blue font-archer">AI Routing</span>
                      </div>
                      <p className="text-xs text-sp-text-medium font-segoe">
                        {toolData.category === 'Planning' || toolData.category === 'Assessment' 
                          ? 'Using Claude AI - Optimised for educational content'
                          : toolData.category === 'Communication'
                          ? 'Using OpenAI GPT-4 - Best for professional writing'
                          : toolData.category === 'Creative' && toolData.name.includes('Music')
                          ? 'Using TopMedia AI - Specialised for audio generation'
                          : toolData.category === 'Creative' && toolData.name.includes('Writing')
                          ? 'Using Mistral AI - Excellent for creative content'
                          : 'Using OpenAI GPT-4 - General purpose AI'
                        }
                      </p>
                    </div>
                  </div>
                ) : generatedContent ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-segoe text-sp-text-primary leading-relaxed">
                      {generatedContent}
                    </pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="p-4 bg-sp-bg-light rounded-full mb-4">
                      <IconComponent className="w-12 h-12 text-sp-text-medium" />
                    </div>
                    <h3 className="text-lg font-semibold text-sp-text-primary mb-2 font-archer">
                      Ready to Generate Content
                    </h3>
                    <p className="text-sp-text-medium max-w-md font-segoe">
                      Fill out the form on the left with your requirements and click the generate button to create your {toolData.category === 'Planning' ? 'lesson plan' : 'quiz'}.
                    </p>
                    
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                      <div className="text-center p-4 bg-sp-bg-light rounded-lg">
                        <Clock className="w-8 h-8 text-sp-brand-blue mx-auto mb-2" />
                        <div className="font-semibold text-sp-text-primary font-archer">Fast</div>
                        <div className="text-sm text-sp-text-medium font-segoe">Generated in seconds</div>
                      </div>
                      <div className="text-center p-4 bg-sp-bg-light rounded-lg">
                        <Target className="w-8 h-8 text-sp-brand-red mx-auto mb-2" />
                        <div className="font-semibold text-sp-text-primary font-archer">Accurate</div>
                        <div className="text-sm text-sp-text-medium font-segoe">Curriculum aligned</div>
                      </div>
                      <div className="text-center p-4 bg-sp-bg-light rounded-lg">
                        <Star className="w-8 h-8 text-sp-text-primary mx-auto mb-2" />
                        <div className="font-semibold text-sp-text-primary font-archer">Quality</div>
                        <div className="text-sm text-sp-text-medium font-segoe">Professional standard</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Features */}
            {generatedContent && (
              <div className="mt-6 bg-sp-bg-white rounded-2xl shadow-card p-6">
                <h3 className="text-lg font-bold text-sp-text-primary mb-4 font-archer">What's Next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-sp-bg-medium rounded-lg hover:border-sp-brand-blue/20 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <PenTool className="w-5 h-5 text-sp-brand-blue" />
                      <div className="font-semibold text-sp-text-primary font-archer">Customise Further</div>
                    </div>
                    <p className="text-sm text-sp-text-medium font-segoe">
                      Edit the generated content to perfectly match your teaching style and classroom needs.
                    </p>
                  </div>
                  <div className="p-4 border border-sp-bg-medium rounded-lg hover:border-sp-brand-blue/20 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-sp-brand-red" />
                      <div className="font-semibold text-sp-text-primary font-archer">Share with Colleagues</div>
                    </div>
                    <p className="text-sm text-sp-text-medium font-segoe">
                      Share this content with your teaching team for collaborative planning and feedback.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToolPage 