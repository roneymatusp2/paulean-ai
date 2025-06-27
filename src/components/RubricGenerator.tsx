import React, { useState } from 'react'
import { Award, Target, FileText, Download, Loader2, Wand2, Plus, Mic } from 'lucide-react'
import { advancedAIService } from '../services/aiService'
import PromptEnhancer from './PromptEnhancer'

interface RubricGeneratorProps {
  onClose?: () => void
}

const RubricGenerator: React.FC<RubricGeneratorProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    gradeLevel: '',
    pointScale: '4',
    standard: '',
    assignmentDescription: '',
    additionalCustomization: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [generatedRubric, setGeneratedRubric] = useState('')
  const [error, setError] = useState('')
  const [isEnhanced, setIsEnhanced] = useState(false)

  const gradeLevels = [
    'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
    'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
  ]

  const pointScales = ['3', '4', '5', '6']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateRubric = async () => {
    if (!formData.gradeLevel || !formData.standard || !formData.assignmentDescription) {
      setError('Please fill in Grade Level, Standard/Objective, and Assignment Description')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await advancedAIService.generateContent({
        toolId: 'rubric-generator',
        toolName: 'Rubric Generator',
        category: 'Assessment',
        formData: formData,
        priority: 'high'
      })

      if (response.success) {
        setGeneratedRubric(response.content)
      } else {
        throw new Error(response.error || 'Failed to generate rubric')
      }
    } catch (error) {
      console.error('Error generating rubric:', error)
      setError('Failed to generate rubric. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadRubric = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedRubric], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `rubric-${formData.gradeLevel}-${formData.standard.replace(/\s+/g, '-')}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-sp-brand-blue to-sp-brand-red rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rubric Generator</h1>
            <p className="text-gray-600">Generate a custom rubric for any assignment</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PromptEnhancer 
            onEnhance={setIsEnhanced}
            isEnhanced={isEnhanced}
          />
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Form */}
        <div className="bg-gradient-to-r from-sp-brand-blue/10 to-sp-brand-red/10 rounded-xl p-6 border border-sp-brand-blue/20">
          {/* Grade Level */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Grade Level: *
            </label>
            <select
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent"
              required
            >
              <option value="">Select Grade Level</option>
              {gradeLevels.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          {/* Point Scale */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Point Scale: *
            </label>
            <select
              name="pointScale"
              value={formData.pointScale}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent"
            >
              {pointScales.map(scale => (
                <option key={scale} value={scale}>{scale} Point Scale</option>
              ))}
            </select>
          </div>

          {/* Standard/Objective */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Standard / Objective: *
            </label>
            <div className="relative">
              <input
                type="text"
                name="standard"
                value={formData.standard}
                onChange={handleInputChange}
                placeholder="e.g., SWBAT write an argumentative essay"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent"
                required
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-sp-brand-blue">
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Assignment Description */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assignment Description: *
            </label>
            <div className="relative">
              <textarea
                name="assignmentDescription"
                value={formData.assignmentDescription}
                onChange={handleInputChange}
                placeholder="Write a persuasive essay that convinces the reader to change a school policy of your choosing"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent resize-none"
                rows={4}
                required
              />
              <button className="absolute right-3 top-3 text-gray-400 hover:text-sp-brand-blue">
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Additional Customization */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Customization for Rubric (Optional):
            </label>
            <div className="relative">
              <textarea
                name="additionalCustomization"
                value={formData.additionalCustomization}
                onChange={handleInputChange}
                placeholder="Be sure to include supporting arguments as a category assessed"
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
              onClick={generateRubric}
              disabled={isLoading || !formData.gradeLevel || !formData.standard || !formData.assignmentDescription}
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

        {/* Generated Rubric */}
        {generatedRubric && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-sp-brand-blue" />
                Generated Rubric
              </h3>
              <button
                onClick={downloadRubric}
                className="flex items-center gap-2 px-3 py-1 bg-sp-brand-blue text-white rounded-lg hover:bg-sp-brand-blue/90 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {generatedRubric}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RubricGenerator 