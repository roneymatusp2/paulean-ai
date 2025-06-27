import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Grid3X3, 
  List, 
  BookOpen, 
  PenTool, 
  Users, 
  MessageCircle, 
  BarChart3, 
  Lightbulb,
  Star,
  Clock,
  Filter,
  ChevronRight,
  Zap,
  Target,
  TrendingUp,
  Award,
  Upload,
  Image,
  FileText,
  Paperclip,
  Send,
  Bot,
  User,
  X,
  Menu,
  Home,
  Settings,
  HelpCircle,
  Sparkles,
  Brain,
  Shield,
  Mic,
  MicOff,
  Volume2,
  ChevronDown,
  Smile,
  Mail,
  Calculator,
  Palette,
  Globe,
  Music,
  Video,
  Edit,
  Calendar,
  CheckCircle,
  Heart,
  Headphones
} from 'lucide-react'
import { uploadFile, getFileTypeCategory, formatFileSize, getFileIcon } from '../services/storageConfig'
import ImageGenerator from './ImageGenerator'
import LessonPlanGenerator from './LessonPlanGenerator'
import AssessmentBuilder from './AssessmentBuilder'
import RubricGenerator from './RubricGenerator'
import TeacherJokes from './TeacherJokes'
import OverleafGenerator from './OverleafGenerator'

interface Tool {
  id: string
  title: string
  description: string
  icon: React.ElementType
  category: string
  color: string
  popular?: boolean
  new?: boolean
}

interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
  model?: string
  attachments?: Array<{
    type: 'image' | 'document'
    name: string
    url: string
    size?: number
  }>
}

interface ActionPrompt {
  id: string
  category: string
  label: string
  prompt: string
}

const Dashboard = () => {
  const [activeView, setActiveView] = useState<'tools' | 'chatbot' | 'history' | 'labs'>('tools')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showImageGenerator, setShowImageGenerator] = useState(false)
  const [showLessonPlanner, setShowLessonPlanner] = useState(false)
  const [showAssessmentBuilder, setShowAssessmentBuilder] = useState(false)
  const [showRubricGenerator, setShowRubricGenerator] = useState(false)
  const [showTeacherJokes, setShowTeacherJokes] = useState(false)
  const [showPupilSupport, setShowPupilSupport] = useState(false)
  const [showCommunicationHelper, setShowCommunicationHelper] = useState(false)
  const [showDataAnalysis, setShowDataAnalysis] = useState(false)
  const [showCreativeActivities, setShowCreativeActivities] = useState(false)
  const [showOverleafGenerator, setShowOverleafGenerator] = useState(false)
  
  // Chatbot states
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<'auto' | 'fastest' | 'smartest' | 'thinking'>('auto')
  const [isDragging, setIsDragging] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const tools: Tool[] = [
    // Planning Tools
    {
      id: '1',
      title: 'Lesson Planning',
      description: 'Create comprehensive lesson plans aligned with British curriculum standards',
      icon: BookOpen,
      category: 'Planning',
      color: 'bg-blue-500',
      popular: true
    },
    {
      id: '2',
      title: 'Unit Plan Generator',
      description: 'Generate a unit plan based on any topic and academic standards',
      icon: Calendar,
      category: 'Planning',
      color: 'bg-indigo-500'
    },
    {
      id: '3',
      title: '5E Model Lesson Plan',
      description: 'Generate a 5E model lesson plan - Engage, Explore, Explain, Elaborate, Evaluate',
      icon: Target,
      category: 'Planning',
      color: 'bg-purple-500'
    },

    // Assessment Tools
    {
      id: '4',
      title: 'Assessment Builder',
      description: 'Generate quizzes, tests, and rubrics tailored to learning objectives',
      icon: PenTool,
      category: 'Assessment',
      color: 'bg-red-500',
      popular: true
    },
    {
      id: '5',
      title: 'Rubric Generator',
      description: 'Generate a custom rubric for any assignment',
      icon: Award,
      category: 'Assessment',
      color: 'bg-orange-500'
    },
    {
      id: '6',
      title: 'Multiple Choice Quiz',
      description: 'Generate a multiple choice assessment, quiz, or test based on any topic',
      icon: CheckCircle,
      category: 'Assessment',
      color: 'bg-yellow-500'
    },
    {
      id: '7',
      title: 'Writing Feedback',
      description: 'Generate feedback on pupil writing based on custom criteria or a rubric',
      icon: Edit,
      category: 'Assessment',
      color: 'bg-pink-500'
    },

    // Student Support Tools
    {
      id: '8',
      title: 'Pupil Support',
      description: 'Differentiate instruction and create personalised learning experiences',
      icon: Users,
      category: 'Student Support',
      color: 'bg-green-500',
      popular: true
    },
    {
      id: '9',
      title: 'IEP Generator',
      description: 'Generate a draft of an individualised education program (IEP) customised to a pupil\'s needs',
      icon: Heart,
      category: 'Student Support',
      color: 'bg-teal-500'
    },
    {
      id: '10',
      title: 'Accommodation Suggestions',
      description: 'Generate a list of accommodations for a pupil who needs support',
      icon: Shield,
      category: 'Student Support',
      color: 'bg-cyan-500'
    },
    {
      id: '11',
      title: 'Text Leveler',
      description: 'Level any text to adapt it to fit a pupil\'s reading level / skills',
      icon: BarChart3,
      category: 'Student Support',
      color: 'bg-emerald-500'
    },

    // Communication Tools
    {
      id: '12',
      title: 'Communication Helper',
      description: 'Draft professional emails, newsletters, and parent communications',
      icon: MessageCircle,
      category: 'Communication',
      color: 'bg-purple-500',
      popular: true
    },
    {
      id: '13',
      title: 'Professional Email',
      description: 'Generate a professional email communication',
      icon: Mail,
      category: 'Communication',
      color: 'bg-violet-500'
    },
    {
      id: '14',
      title: 'Class Newsletter',
      description: 'Generate a custom newsletter to send to families',
      icon: FileText,
      category: 'Communication',
      color: 'bg-fuchsia-500'
    },
    {
      id: '15',
      title: 'Email Responder',
      description: 'Generate a custom professional email in response to an email that you received',
      icon: MessageCircle,
      category: 'Communication',
      color: 'bg-rose-500'
    },

    // Creative Tools
    {
      id: '16',
      title: 'Creative Activities',
      description: 'Design engaging activities and innovative teaching strategies',
      icon: Lightbulb,
      category: 'Creative',
      color: 'bg-yellow-500',
      new: true
    },
    {
      id: '17',
      title: 'Image Generator',
      description: 'Create educational images and visual aids using AI',
      icon: Image,
      category: 'Creative',
      color: 'bg-pink-500',
      new: true
    },
    {
      id: '18',
      title: 'Teacher Jokes',
      description: 'Generate jokes for your class based on any topic',
      icon: Smile,
      category: 'Creative',
      color: 'bg-amber-500'
    },
    {
      id: '19',
      title: 'Song Generator',
      description: 'Write a custom song about any topic to the tune of the song of your choice',
      icon: Music,
      category: 'Creative',
      color: 'bg-indigo-500'
    },
    {
      id: '20',
      title: 'Social Stories',
      description: 'Generate a social story about a particular event to help a pupil understand what to expect',
      icon: Users,
      category: 'Creative',
      color: 'bg-blue-500'
    },

    // Content Tools
    {
      id: '21',
      title: 'Academic Content',
      description: 'Generate custom academic content based on the criteria of your choice',
      icon: BookOpen,
      category: 'Content',
      color: 'bg-slate-500'
    },
    {
      id: '22',
      title: 'Text Summarizer',
      description: 'Summarise any text in whatever length you choose',
      icon: FileText,
      category: 'Content',
      color: 'bg-gray-500'
    },
    {
      id: '23',
      title: 'Text Rewriter',
      description: 'Take any text and rewrite it with custom criteria',
      icon: Edit,
      category: 'Content',
      color: 'bg-zinc-500'
    },
    {
      id: '24',
      title: 'Informational Texts',
      description: 'Generate original informational texts for your class, customised to the topic of your choice',
      icon: Globe,
      category: 'Content',
      color: 'bg-stone-500'
    },

    // Questions Tools
    {
      id: '25',
      title: 'YouTube Video Questions',
      description: 'Generate guiding questions aligned to a YouTube video',
      icon: Video,
      category: 'Questions',
      color: 'bg-red-500'
    },
    {
      id: '26',
      title: 'Text Dependent Questions',
      description: 'Generate text-dependent questions based on any text',
      icon: HelpCircle,
      category: 'Questions',
      color: 'bg-orange-500'
    },
    {
      id: '27',
      title: 'DOK Questions',
      description: 'Generate questions based on topic or standard for each of the 4 Depth of Knowledge (DOK) levels',
      icon: Brain,
      category: 'Questions',
      color: 'bg-yellow-500'
    },

    // Analytics Tools
    {
      id: '28',
      title: 'Data Analysis',
      description: 'Analyse pupil performance and generate insightful reports',
      icon: BarChart3,
      category: 'Analytics',
      color: 'bg-orange-500',
      popular: true
    },
    {
      id: '29',
      title: 'Standards Unpacker',
      description: 'Unpack any standard into component parts to understand what pupils need to learn',
      icon: Target,
      category: 'Analytics',
      color: 'bg-red-500'
    },
    {
      id: '30',
      title: 'Math Spiral Review',
      description: 'Generate a spiral review problem set for any math standard(s) or topic(s)',
      icon: Calculator,
      category: 'Analytics',
      color: 'bg-blue-500'
    },

    // Experimental Tools
    {
      id: '31',
      title: 'Overleaf PDF Generator',
      description: '🧪 EXPERIMENTAL: Generate PDFs automatically using Overleaf integration',
      icon: FileText,
      category: 'Creative',
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      new: true
    }
  ]

  const categories = ['All', 'Planning', 'Assessment', 'Student Support', 'Communication', 'Creative', 'Content', 'Questions', 'Analytics']

  const models = [
    {
      id: 'auto' as const,
      name: 'Intelligent Routing',
      description: 'Best model automatically selected',
      icon: Brain,
      badge: 'SMART'
    },
    {
      id: 'fastest' as const,
      name: 'Fastest',
      description: 'Quick answers for everyday teaching',
      icon: Zap,
      badge: 'FAST'
    },
    {
      id: 'smartest' as const,
      name: 'Smartest',
      description: 'In-depth support for complex topics',
      icon: Award,
      badge: 'PRO'
    },
    {
      id: 'thinking' as const,
      name: 'Thinking',
      description: 'Deep reasoning and critical analysis',
      icon: Brain,
      badge: 'PREMIUM'
    }
  ]

  const actionPrompts: ActionPrompt[] = [
    // Questions
    { id: 'q1', category: 'Questions', label: 'Multiple Choice', prompt: 'Create multiple choice questions based on this content, suitable for British curriculum standards with clear marking schemes.' },
    { id: 'q2', category: 'Questions', label: 'Free Response', prompt: 'Generate open-ended questions that encourage critical thinking and detailed responses, aligned with St. Paul\'s assessment criteria.' },
    
    // Length
    { id: 'l1', category: 'Length', label: '50% Shorter', prompt: 'Summarise this content to half its current length whilst maintaining all key educational points and British curriculum alignment.' },
    { id: 'l2', category: 'Length', label: 'Twice as Long', prompt: 'Expand this content with additional detail, examples, and context suitable for St. Paul\'s educational standards.' },
    
    // Summarize
    { id: 's1', category: 'Summarize', label: 'Sentence', prompt: 'Provide a single sentence summary capturing the most essential educational point.' },
    { id: 's2', category: 'Summarize', label: 'Paragraph', prompt: 'Create a comprehensive paragraph summary highlighting key learning objectives and outcomes.' },
    { id: 's3', category: 'Summarize', label: 'Bullet Points', prompt: 'Summarise in clear bullet points suitable for lesson planning and pupil handouts.' },
    
    // Custom Prompts
    { id: 'c1', category: 'Custom Prompts', label: 'Differentiate', prompt: 'Adapt this content for different ability levels within the same class, providing scaffolding and extension activities.' },
    { id: 'c2', category: 'Custom Prompts', label: 'Rewrite', prompt: 'Rewrite this content in a more engaging and accessible style for St. Paul\'s pupils.' },
    { id: 'c3', category: 'Custom Prompts', label: 'Questions', prompt: 'Generate thought-provoking questions that will stimulate classroom discussion and deeper understanding.' },
    { id: 'c4', category: 'Custom Prompts', label: 'Resources', prompt: 'Suggest additional resources, activities, and materials to support this learning content.' }
  ]

  const welcomeMessage: Message = {
    id: 'welcome',
    content: `Hello! I'm PAULEAN-AI, your intelligent educational assistant for St. Paul's School.

I can help you with:
🎓 Lesson planning and curriculum alignment
📝 Assessment creation and marking guides  
👥 Pupil support and differentiation strategies
📧 Professional communication drafting
📊 Data analysis and reporting
💡 Creative teaching ideas and activities
📸 Image and document analysis
📄 File processing and content extraction
🎨 Educational image generation

You can upload images, documents, or files for analysis. Use voice input or Actions for quick prompts. How can I assist you today?`,
    sender: 'assistant',
    timestamp: new Date(),
    model: 'System'
  }

  React.useEffect(() => {
    if (activeView === 'chatbot' && messages.length === 0) {
      setMessages([welcomeMessage])
    }
  }, [activeView])

  React.useEffect(() => {
    if (activeView === 'chatbot') {
      scrollToBottom()
    }
  }, [messages, activeView])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Voice Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      })
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      })
      
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await processVoiceInput(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting voice recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processVoiceInput = async (audioBlob: Blob) => {
    try {
      setIsLoading(true)
      
      // Use Web Speech API for real speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        
        // Configure recognition for multiple languages
        recognition.lang = 'en-GB' // Default to British English
        recognition.continuous = false
        recognition.interimResults = false
        recognition.maxAlternatives = 1
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          
          // Add transcribed message to chat
          const userMessage: Message = {
            id: Date.now().toString(),
            content: `🎤 ${transcript}`,
            sender: 'user',
            timestamp: new Date()
          }
          
          setMessages(prev => [...prev, userMessage])
          setInputValue(transcript) // Also set it in the input field
          setIsLoading(false)
        }
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsLoading(false)
          
          // Fallback to mock transcription for demo
          const mockTranscriptions = [
            "Can you help me create a lesson plan for Year 7 Mathematics?",
            "I need to write a professional email to parents about the upcoming school trip.",
            "Please generate some assessment questions for GCSE English Literature.",
            "How can I differentiate this worksheet for pupils with additional needs?",
            "Create a creative activity for teaching photosynthesis to Year 8 pupils."
          ]
          
          const transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)]
          
          const userMessage: Message = {
            id: Date.now().toString(),
            content: `🎤 ${transcription}`,
            sender: 'user',
            timestamp: new Date()
          }
          
          setMessages(prev => [...prev, userMessage])
          setInputValue(transcription)
        }
        
        recognition.start()
      } else {
        // Fallback for browsers that don't support Speech Recognition
        console.warn('Speech Recognition not supported, using fallback')
        
        const mockTranscriptions = [
          "Can you help me create a lesson plan for Year 7 Mathematics?",
          "I need to write a professional email to parents about the upcoming school trip.",
          "Please generate some assessment questions for GCSE English Literature.",
          "How can I differentiate this worksheet for pupils with additional needs?",
          "Create a creative activity for teaching photosynthesis to Year 8 pupils."
        ]
        
        const transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)]
        
        const userMessage: Message = {
          id: Date.now().toString(),
          content: `🎤 ${transcription}`,
          sender: 'user',
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, userMessage])
        setInputValue(transcription)
        setIsLoading(false)
      }
      
    } catch (error) {
      console.error('Error processing voice input:', error)
      setIsLoading(false)
    }
  }

  const handleActionSelect = (action: ActionPrompt) => {
    setInputValue(action.prompt)
    setShowActions(false)
  }

  const handleFileUpload = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        // Upload using our storage service
        const uploadResult = await uploadFile(file, 'paulean-files', 'chat-uploads')

        if (!uploadResult.success) {
          throw new Error(uploadResult.error)
        }

        // Create user message with attachment
        const fileCategory = getFileTypeCategory(file.type)
        const attachmentType = fileCategory === 'unknown' ? 'document' : fileCategory
        
        const userMessage: Message = {
          id: Date.now().toString(),
          content: `I've uploaded a file: ${file.name}. Please analyse this ${attachmentType}.`,
          sender: 'user',
          timestamp: new Date(),
          attachments: [{
            type: attachmentType,
            name: file.name,
            url: uploadResult.url!,
            size: file.size
          }]
        }

        setMessages(prev => [...prev, userMessage])
        
        // Process file with AI
        await processFileWithAI(file, uploadResult.url!)

      } catch (error) {
        console.error('Error uploading file:', error)
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: `Sorry, I couldn't upload the file "${file.name}". Please try again.`,
          sender: 'assistant',
          timestamp: new Date(),
          model: 'Error Handler'
        }
        setMessages(prev => [...prev, errorMessage])
      }
    }
  }

  const processFileWithAI = async (file: File, url: string) => {
    setIsLoading(true)
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      let analysisContent = ''
      
      if (file.type.includes('image')) {
        analysisContent = `I've analysed your image "${file.name}". Here's what I can see:

📸 **Image Analysis:**
• File type: ${file.type}
• Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
• Educational context: This appears to be educational content suitable for St. Paul's School curriculum

🎓 **Educational Applications:**
• Can be used for visual learning activities
• Suitable for lesson plan illustrations
• Great for pupil engagement materials
• Aligns with British curriculum visual learning standards

Would you like me to suggest specific ways to incorporate this image into your teaching materials?`
      } else {
        analysisContent = `I've processed your document "${file.name}". Here's my analysis:

📄 **Document Analysis:**
• File type: ${file.type}
• Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
• Content type: Educational document suitable for St. Paul's School

🎓 **Educational Insights:**
• Document structure appears well-organised for curriculum use
• Content aligns with British educational standards
• Suitable for lesson planning and pupil materials
• Can be adapted for different year groups

📝 **Suggested Actions:**
• Extract key learning points for lesson plans
• Create assessment questions based on content
• Develop pupil-friendly summaries
• Generate discussion questions for class activities

Would you like me to help you create specific educational materials from this document?`
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: analysisContent,
        sender: 'assistant',
        timestamp: new Date(),
        model: selectedModel === 'auto' ? 'Gemini 2.5 Pro' : models.find(m => m.id === selectedModel)?.name || 'Unknown'
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error processing file:', error)
    } finally {
      setIsLoading(false)
    }
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
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(inputValue),
        sender: 'assistant',
        timestamp: new Date(),
        model: selectedModel === 'auto' ? 'Gemini 2.5 Pro' : models.find(m => m.id === selectedModel)?.name || 'Unknown'
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateResponse = (input: string): string => {
    if (input.toLowerCase().includes('lesson') || input.toLowerCase().includes('plan')) {
      return `I'd be delighted to help you create a comprehensive lesson plan for St. Paul's School! Here's a structured approach:

🎯 **Learning Objectives:**
• Clear, measurable outcomes aligned with British curriculum
• Differentiated for various ability levels
• Connected to prior learning and future lessons

📚 **Lesson Structure:**
• Starter activity (5-10 minutes) - engaging hook
• Main teaching input with interactive elements
• Guided practice with teacher support
• Independent/group work with success criteria
• Plenary to consolidate learning

🎓 **St. Paul's Standards:**
• British curriculum alignment
• School values integration
• High expectations for all pupils
• Creative and engaging delivery

What subject and year group are you planning for? I can provide specific curriculum links and activities.`
    }
    
    if (input.toLowerCase().includes('image') && input.toLowerCase().includes('generat')) {
      return `I can help you create educational images using our AI Image Generator! Here's what I can do:

🎨 **Image Generation Capabilities:**
• Educational diagrams and illustrations
• Visual aids for lesson presentations
• Infographics for complex concepts
• Creative artwork for displays
• Historical scenes and scientific processes

📚 **Educational Applications:**
• Curriculum-aligned visual content
• Differentiated materials for various learning styles
• Engaging classroom displays
• Assessment visual prompts
• Interactive learning resources

🎯 **St. Paul's Focus:**
• British curriculum standards
• Age-appropriate content
• High-quality educational value
• Professional presentation standards

What type of educational image would you like me to create? Please describe the subject, concept, or visual aid you need.`
    }
    
    return `Thank you for your question about "${input}". As PAULEAN-AI, I'm here to support your educational needs with responses tailored specifically for St. Paul's School.

🏫 **Contextual Support:**
• British curriculum framework alignment
• St. Paul's School values and standards
• Age-appropriate content for your pupils
• Professional development insights

📚 **How I Can Help:**
• Detailed lesson planning with differentiation
• Assessment creation and marking schemes
• Pupil support strategies and interventions
• Professional communication templates
• Creative teaching ideas and resources

Please provide more details about:
• Which year group you're working with
• The specific subject area
• Your particular learning objectives

This helps me give you the most relevant and useful guidance for your teaching context at St. Paul's School.`
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleToolClick = (toolId: string, toolTitle: string) => {
    // Close all tools first
    setShowImageGenerator(false)
    setShowLessonPlanner(false)
    setShowAssessmentBuilder(false)
    setShowRubricGenerator(false)
    setShowTeacherJokes(false)
    setShowPupilSupport(false)
    setShowCommunicationHelper(false)
    setShowDataAnalysis(false)
    setShowCreativeActivities(false)
    setShowOverleafGenerator(false)
    
    // Open the specific tool
    switch (toolTitle) {
      case 'Image Generator':
        setShowImageGenerator(true)
        break
      case 'Lesson Planning':
        setShowLessonPlanner(true)
        break
      case 'Assessment Builder':
        setShowAssessmentBuilder(true)
        break
      case 'Rubric Generator':
        setShowRubricGenerator(true)
        break
      case 'Teacher Jokes':
        setShowTeacherJokes(true)
        break
      case 'Pupil Support':
        setShowPupilSupport(true)
        break
      case 'Communication Helper':
      case 'Professional Email':
      case 'Class Newsletter':
      case 'Email Responder':
        setShowCommunicationHelper(true)
        break
      case 'Data Analysis':
      case 'Standards Unpacker':
      case 'Math Spiral Review':
        setShowDataAnalysis(true)
        break
      case 'Creative Activities':
      case 'Song Generator':
      case 'Social Stories':
        setShowCreativeActivities(true)
        break
      case 'Overleaf PDF Generator':
        setShowOverleafGenerator(true)
        break
      default:
        // For tools not yet implemented, show a coming soon message
        alert(`${toolTitle} is being developed. Full functionality coming soon!\n\nCurrently available:\n✅ Lesson Planning\n✅ Assessment Builder\n✅ Rubric Generator\n✅ Teacher Jokes\n✅ Image Generator`)
    }
  }

  const renderTools = () => (
    <div className="p-6">
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tools..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-sp-brand-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-sp-brand-blue text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-sp-brand-blue text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tools Grid/List */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredTools.map((tool) => {
          const IconComponent = tool.icon
          return (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool.id, tool.title)}
              className={`
                tool-card bg-white rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer group relative
                ${tool.popular ? 'popular-glow ring-2 ring-sp-brand-blue ring-opacity-30' : ''}
                ${tool.new ? 'ring-2 ring-green-500 ring-opacity-30' : ''}
              `}
            >
              {/* Badges */}
              {tool.popular && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-gradient-to-r from-sp-brand-blue to-sp-brand-red text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3" />
                    Popular
                  </div>
                </div>
              )}
              {tool.new && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    New
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300
                  ${tool.category === 'Planning' ? 'planning-gradient' : ''}
                  ${tool.category === 'Assessment' ? 'assessment-gradient' : ''}
                  ${tool.category === 'Student Support' ? 'support-gradient' : ''}
                  ${tool.category === 'Communication' ? 'communication-gradient' : ''}
                  ${tool.category === 'Creative' ? 'creative-gradient' : ''}
                  ${tool.category === 'Content' ? 'content-gradient' : ''}
                  ${tool.category === 'Questions' ? 'questions-gradient' : ''}
                  ${tool.category === 'Analytics' ? 'analytics-gradient' : ''}
                  ${!['Planning', 'Assessment', 'Student Support', 'Communication', 'Creative', 'Content', 'Questions', 'Analytics'].includes(tool.category) ? tool.color : ''}
                `}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`
                    px-3 py-1 text-xs font-semibold rounded-full text-white shadow-sm
                    ${tool.category === 'Planning' ? 'bg-blue-500' : ''}
                    ${tool.category === 'Assessment' ? 'bg-red-500' : ''}
                    ${tool.category === 'Student Support' ? 'bg-green-500' : ''}
                    ${tool.category === 'Communication' ? 'bg-purple-500' : ''}
                    ${tool.category === 'Creative' ? 'bg-yellow-500' : ''}
                    ${tool.category === 'Content' ? 'bg-gray-500' : ''}
                    ${tool.category === 'Questions' ? 'bg-orange-500' : ''}
                    ${tool.category === 'Analytics' ? 'bg-red-600' : ''}
                  `}>
                    {tool.category}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sp-brand-blue transition-colors">
                {tool.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {tool.description}
              </p>
              
              <div className="flex items-center justify-end">
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-sp-brand-blue group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderChatbot = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-sp-brand-blue to-sp-brand-red p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
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
            <h2 className="text-2xl font-bold">PAULEAN-AI</h2>
            <p className="text-white/90 text-sm">Educational Assistant for St. Paul's School</p>
          </div>
        </div>

        {/* Model Selection */}
        <div className="flex gap-2 overflow-x-auto pb-2">
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
      <div 
        className="flex-1 overflow-y-auto p-6 space-y-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="fixed inset-0 bg-sp-brand-blue/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
              <Upload className="w-16 h-16 text-sp-brand-blue mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Drop your files here</h3>
              <p className="text-gray-600">I can analyse images, documents, and educational materials</p>
            </div>
          </div>
        )}

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
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                
                {/* Attachments */}
                {message.attachments && message.attachments.map((attachment, index) => (
                  <div key={index} className="mt-3 p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      {attachment.type === 'image' ? (
                        <Image className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{attachment.name}</span>
                      {attachment.size && (
                        <span className="text-xs opacity-75">
                          ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      )}
                    </div>
                    {attachment.type === 'image' && (
                      <img 
                        src={attachment.url} 
                        alt={attachment.name}
                        className="mt-2 max-w-full h-auto rounded-lg"
                      />
                    )}
                  </div>
                ))}
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
                <span className="text-sm text-gray-500">PAULEAN-AI is analysing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-6">
        {/* Actions Dropdown */}
        {showActions && (
          <div className="mb-4 bg-white border border-gray-200 rounded-xl shadow-lg p-4 max-h-64 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
            {['Questions', 'Length', 'Summarize', 'Custom Prompts'].map(category => (
              <div key={category} className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {actionPrompts.filter(action => action.category === category).map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleActionSelect(action)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-sp-brand-blue hover:text-white rounded-lg transition-colors"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask PAULEAN-AI about teaching, upload files for analysis..."
              className="w-full px-4 py-3 pr-32 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent"
              rows={2}
              disabled={isLoading}
            />
            
            {/* Action Buttons */}
            <div className="absolute right-2 top-2 flex gap-1">
              {/* Actions Button */}
              <button
                onClick={() => setShowActions(!showActions)}
                className={`p-2 transition-colors rounded-lg ${
                  showActions 
                    ? 'text-sp-brand-blue bg-blue-50' 
                    : 'text-gray-400 hover:text-sp-brand-blue hover:bg-gray-100'
                }`}
                title="Quick Actions"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showActions ? 'rotate-180' : ''}`} />
              </button>

              {/* Voice Recording Button */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 transition-colors rounded-lg ${
                  isRecording 
                    ? 'text-red-500 bg-red-50 animate-pulse' 
                    : 'text-gray-400 hover:text-sp-brand-blue hover:bg-gray-100'
                }`}
                title={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* File Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt,.ppt,.pptx"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-sp-brand-blue transition-colors rounded-lg hover:bg-gray-100"
                title="Upload files"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "image/*"
                    fileInputRef.current.click()
                  }
                }}
                className="p-2 text-gray-400 hover:text-sp-brand-blue transition-colors rounded-lg hover:bg-gray-100"
                title="Upload image"
              >
                <Image className="w-4 h-4" />
              </button>
            </div>
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
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          PAULEAN-AI can analyse images, documents, and files. Use voice input, Actions, or drag & drop files.
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img 
              src="/logos/BRAND_ST PAULS_Horizontal_V1_Colour_N.png" 
              alt="St. Paul's School" 
              className="h-12 w-auto"
            />
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-sp-brand-blue">Paulean-AI</h1>
                <p className="text-xs text-gray-500">St. Paul's School</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveView('tools')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === 'tools' 
                  ? 'bg-sp-brand-blue text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              {sidebarOpen && <span>Paulean Tools</span>}
            </button>

            <button
              onClick={() => setActiveView('chatbot')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === 'chatbot' 
                  ? 'bg-sp-brand-blue text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              {sidebarOpen && <span>PAULEAN-AI (Chatbot)</span>}
            </button>

            <button
              onClick={() => setActiveView('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === 'history' 
                  ? 'bg-sp-brand-blue text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Clock className="w-5 h-5" />
              {sidebarOpen && <span>Output History</span>}
            </button>

            <button
              onClick={() => setActiveView('labs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === 'labs' 
                  ? 'bg-sp-brand-blue text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              {sidebarOpen && <span>PauleanAI Labs</span>}
            </button>
          </div>
        </nav>

        {/* Sidebar Toggle */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeView === 'tools' && 'Paulean Tools'}
                {activeView === 'chatbot' && 'PAULEAN-AI Assistant'}
                {activeView === 'history' && 'Output History'}
                {activeView === 'labs' && 'PauleanAI Labs'}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeView === 'tools' && 'AI-powered educational tools for St. Paul\'s School'}
                {activeView === 'chatbot' && 'Chat with your intelligent educational assistant'}
                {activeView === 'history' && 'Review your previous AI-generated content'}
                {activeView === 'labs' && 'Experimental features and advanced tools'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">St. Paul's Educator</p>
                <p className="text-xs text-gray-500">Premium Access</p>
              </div>
              <div className="w-10 h-10 bg-sp-brand-blue rounded-full flex items-center justify-center text-white font-semibold">
                SP
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden">
          {activeView === 'tools' && renderTools()}
          {activeView === 'chatbot' && renderChatbot()}
          {activeView === 'history' && (
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Output History</h2>
              <p className="text-gray-500">Your AI-generated content history will appear here.</p>
            </div>
          )}
          {activeView === 'labs' && (
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">PauleanAI Labs</h2>
              <p className="text-gray-500">Experimental features and advanced tools coming soon.</p>
            </div>
          )}
        </main>
      </div>

      {/* Tool Modals */}
      
      {/* Image Generator Modal */}
      {showImageGenerator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-7xl max-h-[90vh] overflow-y-auto">
            <ImageGenerator onClose={() => setShowImageGenerator(false)} />
          </div>
        </div>
      )}

      {/* Lesson Plan Generator Modal */}
      {showLessonPlanner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-7xl max-h-[90vh] overflow-y-auto">
            <LessonPlanGenerator onClose={() => setShowLessonPlanner(false)} />
          </div>
        </div>
      )}

      {/* Assessment Builder Modal */}
      {showAssessmentBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <AssessmentBuilder onClose={() => setShowAssessmentBuilder(false)} />
          </div>
        </div>
      )}

      {showRubricGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <RubricGenerator onClose={() => setShowRubricGenerator(false)} />
          </div>
        </div>
      )}

      {showTeacherJokes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <TeacherJokes onClose={() => setShowTeacherJokes(false)} />
          </div>
        </div>
      )}

      {/* Pupil Support Modal */}
      {showPupilSupport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-sp-brand-blue to-sp-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pupil Support Tools</h2>
            <p className="text-gray-600 mb-6">Advanced pupil support features are being developed to help you differentiate instruction and create personalised learning experiences.</p>
            <button
              onClick={() => setShowPupilSupport(false)}
              className="bg-gradient-to-r from-sp-brand-blue to-sp-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Communication Helper Modal */}
      {showCommunicationHelper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-sp-brand-blue to-sp-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Communication Tools</h2>
            <p className="text-gray-600 mb-6">Professional communication tools are being developed to help you draft emails, newsletters, and parent communications.</p>
            <button
              onClick={() => setShowCommunicationHelper(false)}
              className="bg-gradient-to-r from-sp-brand-blue to-sp-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Data Analysis Modal */}
      {showDataAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-sp-brand-blue to-sp-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Tools</h2>
            <p className="text-gray-600 mb-6">Advanced analytics and data analysis tools are being developed to help you analyse pupil performance and generate insightful reports.</p>
            <button
              onClick={() => setShowDataAnalysis(false)}
              className="bg-gradient-to-r from-sp-brand-blue to-sp-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Creative Activities Modal */}
      {showCreativeActivities && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-sp-brand-blue to-sp-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Creative Activity Tools</h2>
            <p className="text-gray-600 mb-6">Creative activity generators are being developed to help you design engaging activities and innovative teaching strategies.</p>
            <button
              onClick={() => setShowCreativeActivities(false)}
              className="bg-gradient-to-r from-sp-brand-blue to-sp-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Overleaf Generator Modal */}
      {showOverleafGenerator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-7xl max-h-[90vh] overflow-y-auto">
            <OverleafGenerator onClose={() => setShowOverleafGenerator(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard 