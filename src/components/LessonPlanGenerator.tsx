import React, { useState } from 'react'
import { BookOpen, Clock, Target, Users, Lightbulb, FileText, Download, Loader2, Wand2 } from 'lucide-react'
import { aiService } from '../services/aiService'

interface LessonPlanGeneratorProps {
  onClose?: () => void
}

const LessonPlanGenerator: React.FC<LessonPlanGeneratorProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    subject: '',
    yearGroup: '',
    topic: '',
    duration: '60',
    objectives: '',
    priorKnowledge: '',
    resources: '',
    differentiation: '',
    assessment: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState('')
  const [error, setError] = useState('')

  const subjects = [
    'Mathematics', 'English', 'Science', 'History', 'Geography', 'Art', 'Music', 
    'Physical Education', 'Computing', 'Languages', 'Religious Studies', 'PSHE'
  ]

  const yearGroups = [
    'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
    'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
  ]

  const durations = ['30', '45', '60', '90', '120']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateLessonPlan = async () => {
    if (!formData.subject || !formData.yearGroup || !formData.topic) {
      setError('Please fill in Subject, Year Group, and Topic fields')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await aiService.generateContent({
        toolId: 'lesson-planner',
        toolName: 'Lesson Plan Generator',
        category: 'Planning',
        formData: formData,
        priority: 'high'
      })

      if (response.success) {
        setGeneratedPlan(response.content)
      } else {
        throw new Error(response.error || 'Failed to generate lesson plan')
      }
    } catch (error) {
      console.error('Error generating lesson plan:', error)
      setError('Failed to generate lesson plan. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadPlan = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedPlan], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `lesson-plan-${formData.subject}-${formData.yearGroup}-${formData.topic.replace(/\s+/g, '-')}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lesson Plan Generator</h1>
            <p className="text-gray-600">Create comprehensive lesson plans aligned with British curriculum</p>
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
        {/* Form Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-sp-brand-blue/10 to-sp-brand-red/10 rounded-xl p-6 border border-sp-brand-blue/20">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-sp-brand-blue" />
              Lesson Details
            </h2>

            {/* Subject and Year Group */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Group *
                </label>
                <select
                  name="yearGroup"
                  value={formData.yearGroup}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent"
                  required
                >
                  <option value="">Select Year Group</option>
                  {yearGroups.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Topic and Duration */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic/Learning Focus *
                </label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  placeholder="e.g., Introduction to Fractions, World War II, Photosynthesis"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (mins)
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent"
                >
                  {durations.map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Objectives
              </label>
              <textarea
                name="objectives"
                value={formData.objectives}
                onChange={handleInputChange}
                placeholder="What should pupils know, understand, and be able to do by the end of the lesson?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Prior Knowledge */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prior Knowledge Required
              </label>
              <textarea
                name="priorKnowledge"
                value={formData.priorKnowledge}
                onChange={handleInputChange}
                placeholder="What do pupils need to know before this lesson?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent resize-none"
                rows={2}
              />
            </div>

            {/* Resources */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Resources
              </label>
              <textarea
                name="resources"
                value={formData.resources}
                onChange={handleInputChange}
                placeholder="Interactive whiteboard, textbooks, manipulatives, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent resize-none"
                rows={2}
              />
            </div>

            {/* Differentiation */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Differentiation Needs
              </label>
              <textarea
                name="differentiation"
                value={formData.differentiation}
                onChange={handleInputChange}
                placeholder="SEN pupils, EAL learners, more able pupils, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent resize-none"
                rows={2}
              />
            </div>

            {/* Assessment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Methods
              </label>
              <textarea
                name="assessment"
                value={formData.assessment}
                onChange={handleInputChange}
                placeholder="How will you assess learning during and after the lesson?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent resize-none"
                rows={2}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateLessonPlan}
              disabled={isLoading || !formData.subject || !formData.yearGroup || !formData.topic}
              className="w-full bg-gradient-to-r from-sp-brand-blue to-sp-brand-red text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Lesson Plan...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Lesson Plan
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

          {/* Tips */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-sp-brand-blue" />
              Planning Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Start with clear, measurable learning objectives</li>
              <li>• Consider your pupils' prior knowledge and experience</li>
              <li>• Plan for different learning styles and abilities</li>
              <li>• Include opportunities for assessment throughout</li>
              <li>• Ensure activities align with curriculum standards</li>
            </ul>
          </div>
        </div>

        {/* Generated Plan Panel */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sp-brand-blue" />
            Generated Lesson Plan
          </h2>

          {!generatedPlan ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lesson plan generated yet</h3>
              <p className="text-gray-600">Fill in the form and click "Generate Lesson Plan" to create your comprehensive lesson plan.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Your Lesson Plan</h3>
                <button
                  onClick={downloadPlan}
                  className="flex items-center gap-2 px-3 py-1 bg-sp-brand-blue text-white rounded-lg hover:bg-sp-brand-blue/90 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {generatedPlan}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LessonPlanGenerator 