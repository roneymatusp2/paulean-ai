import React, { useState } from 'react'
import { Image, Wand2, Download, Loader2, BookOpen, Beaker, Map, BarChart3, Palette, Eye } from 'lucide-react'

interface ImageGeneratorProps {
  onClose?: () => void
}

interface GeneratedImage {
  url: string
  prompt: string
  timestamp: Date
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('')
  const [subject, setSubject] = useState('')
  const [yearGroup, setYearGroup] = useState('')
  const [style, setStyle] = useState<'diagram' | 'illustration' | 'infographic' | 'historical' | 'scientific'>('illustration')
  const [size, setSize] = useState<'1024x1024' | '1792x1024' | '1024x1792'>('1024x1024')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [error, setError] = useState('')

  const subjects = [
    'Mathematics', 'English', 'Science', 'History', 'Geography', 'Art', 'Music', 
    'Physical Education', 'Computing', 'Languages', 'Religious Studies', 'PSHE'
  ]

  const yearGroups = [
    'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
    'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
  ]

  const styleOptions = [
    { value: 'illustration', label: 'Illustration', icon: Palette, description: 'Colorful, engaging educational illustrations' },
    { value: 'diagram', label: 'Diagram', icon: BarChart3, description: 'Clear diagrams with labels and arrows' },
    { value: 'infographic', label: 'Infographic', icon: Eye, description: 'Professional infographics with data visualization' },
    { value: 'historical', label: 'Historical', icon: Map, description: 'Period-accurate historical scenes' },
    { value: 'scientific', label: 'Scientific', icon: Beaker, description: 'Detailed scientific illustrations and processes' }
  ]

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your image')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Enhanced educational prompt
      const educationalPrompt = `Educational content for St. Paul's School: ${prompt}${subject ? ` for ${subject}` : ''}${yearGroup ? ` suitable for ${yearGroup} pupils` : ''}. 
      Style: Professional, curriculum-appropriate, suitable for British education standards. 
      High quality, clear, engaging for pupils and teachers. ${getStyleDescription(style)}`

      const imageApiKey = import.meta.env.VITE_IMAGE_GENERATOR_API
      
      if (!imageApiKey) {
        throw new Error('Image Generator API key not configured. Please check your environment variables.')
      }

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${imageApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: educationalPrompt,
          n: 1,
          size: size,
          quality: 'hd',
          style: 'natural'
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.message)
      }

      if (data.data && data.data.length > 0) {
        const newImage: GeneratedImage = {
          url: data.data[0].url,
          prompt: prompt,
          timestamp: new Date()
        }
        
        setGeneratedImages(prev => [newImage, ...prev])
        setPrompt('') // Clear the prompt after successful generation
      }

    } catch (error) {
      console.error('Image generation failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getStyleDescription = (styleValue: string): string => {
    const descriptions = {
      diagram: 'Create as a clear educational diagram with labels and arrows, simple line art style.',
      illustration: 'Create as a colorful educational illustration, engaging and age-appropriate.',
      infographic: 'Create as a professional infographic with charts, icons, and clear typography.',
      historical: 'Create as a historical scene or period-accurate illustration, detailed and educational.',
      scientific: 'Create as a scientific illustration with accurate details, cross-sections, or processes.'
    }
    return descriptions[styleValue as keyof typeof descriptions] || ''
  }

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `paulean-ai-${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Image className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Image Generator</h1>
            <p className="text-gray-600">Create educational images and visual aids using AI</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generation Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-sp-brand-blue/10 to-sp-brand-red/10 rounded-xl p-6 border border-sp-brand-blue/20">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-sp-brand-blue" />
              Generate Educational Image
            </h2>

            {/* Image Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Description *
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the educational image you want to create (e.g., 'A diagram showing the water cycle with evaporation, condensation, and precipitation')"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent resize-none"
                rows={3}
                disabled={isLoading}
              />
            </div>

            {/* Subject and Year Group */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject (Optional)
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent"
                  disabled={isLoading}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Group (Optional)
                </label>
                <select
                  value={yearGroup}
                  onChange={(e) => setYearGroup(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent"
                  disabled={isLoading}
                >
                  <option value="">Select Year Group</option>
                  {yearGroups.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Style Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Image Style
              </label>
              <div className="grid grid-cols-1 gap-2">
                {styleOptions.map(option => {
                  const IconComponent = option.icon
                  return (
                    <button
                      key={option.value}
                      onClick={() => setStyle(option.value as any)}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                        style === option.value
                          ? 'border-sp-brand-blue bg-sp-brand-blue/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      disabled={isLoading}
                    >
                      <IconComponent className={`w-5 h-5 ${style === option.value ? 'text-sp-brand-blue' : 'text-gray-500'}`} />
                      <div>
                        <div className={`font-medium ${style === option.value ? 'text-sp-brand-blue' : 'text-gray-900'}`}>
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Size
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent"
                disabled={isLoading}
              >
                <option value="1024x1024">Square (1024×1024) - Best for general use</option>
                <option value="1792x1024">Landscape (1792×1024) - Best for presentations</option>
                <option value="1024x1792">Portrait (1024×1792) - Best for posters</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateImage}
              disabled={isLoading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-sp-brand-blue to-sp-brand-red text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Educational Image
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* Usage Tips */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sp-brand-blue" />
              Tips for Better Results
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Be specific about what you want to show (e.g., "cross-section of a plant cell showing nucleus, mitochondria, and chloroplasts")</li>
              <li>• Include the educational purpose (e.g., "for explaining photosynthesis to Year 7 pupils")</li>
              <li>• Mention if you need labels, arrows, or annotations</li>
              <li>• Specify the visual style that best suits your lesson</li>
              <li>• Consider your pupils' age when describing complexity level</li>
            </ul>
          </div>
        </div>

        {/* Generated Images */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Image className="w-5 h-5 text-sp-brand-blue" />
            Generated Images ({generatedImages.length})
          </h2>

          {generatedImages.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images generated yet</h3>
              <p className="text-gray-600">Create your first educational image using the form on the left.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {generatedImages.map((image, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-sm text-gray-700 mb-2">{image.prompt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {image.timestamp.toLocaleString()}
                      </span>
                      <button
                        onClick={() => downloadImage(image.url, image.prompt)}
                        className="flex items-center gap-2 px-3 py-1 bg-sp-brand-blue text-white rounded-lg hover:bg-sp-brand-blue/90 transition-colors text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageGenerator 