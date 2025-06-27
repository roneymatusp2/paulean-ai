import React, { useState } from 'react'
import { Smile, Mic, FileText, Download, Loader2, Wand2 } from 'lucide-react'
import { aiService } from '../services/aiService'

interface TeacherJokesProps {
  onClose?: () => void
}

const TeacherJokes: React.FC<TeacherJokesProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    gradeLevel: '9th grade',
    additionalCustomization: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [generatedJokes, setGeneratedJokes] = useState('')
  const [error, setError] = useState('')

  const gradeLevels = [
    'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
    'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateJokes = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await aiService.generateContent({
        toolId: 'teacher-jokes',
        toolName: 'Teacher Jokes',
        category: 'Creative',
        formData: {
          ...formData,
          topic: `Generate appropriate classroom jokes for ${formData.gradeLevel} pupils at St. Paul's School`
        },
        priority: 'medium'
      })

      if (response.success) {
        setGeneratedJokes(response.content)
      } else {
        throw new Error(response.error || 'Failed to generate jokes')
      }
    } catch (error) {
      console.error('Error generating jokes:', error)
      setError('Failed to generate jokes. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadJokes = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedJokes], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `teacher-jokes-${formData.gradeLevel.replace(/\s+/g, '-')}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Smile className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teacher Jokes</h1>
            <p className="text-gray-600">Generate jokes for your class based on any topic</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Form */}
        <div className="bg-gradient-to-r from-sp-brand-blue/10 to-sp-brand-red/10 rounded-xl p-6 border border-sp-brand-blue/20">
          {/* Grade Level */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Grade level: *
            </label>
            <select
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent"
              required
            >
              {gradeLevels.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          {/* Additional Customization */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Customization (Optional):
            </label>
            <div className="relative">
              <textarea
                name="additionalCustomization"
                value={formData.additionalCustomization}
                onChange={handleInputChange}
                placeholder="Make it about mitosis"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent resize-none"
                rows={3}
              />
              <button className="absolute right-3 top-3 text-gray-400 hover:text-sp-brand-blue">
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Web Search and Generate Buttons */}
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <span className="w-5 h-5">🌐</span>
              Web Search
            </button>
            <button
              onClick={generateJokes}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-sp-brand-blue to-sp-brand-red text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Generated Jokes */}
        {generatedJokes && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-sp-brand-blue" />
                Generated Jokes
              </h3>
              <button
                onClick={downloadJokes}
                className="flex items-center gap-2 px-3 py-1 bg-sp-brand-blue text-white rounded-lg hover:bg-sp-brand-blue/90 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {generatedJokes}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherJokes 