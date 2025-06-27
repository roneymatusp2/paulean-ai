import React, { useState } from 'react'
import { PenTool, Target, CheckCircle, Clock, FileText, Download, Loader2, Wand2, Plus, Minus } from 'lucide-react'
import { aiService } from '../services/aiService'

interface AssessmentBuilderProps {
  onClose?: () => void
}

const AssessmentBuilder: React.FC<AssessmentBuilderProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    subject: '',
    yearGroup: '',
    topic: '',
    assessmentType: 'quiz',
    questionCount: '10',
    questionTypes: ['multiple-choice'],
    difficulty: 'medium',
    duration: '30',
    markingScheme: 'points',
    instructions: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [generatedAssessment, setGeneratedAssessment] = useState('')
  const [error, setError] = useState('')

  const subjects = [
    'Mathematics', 'English', 'Science', 'History', 'Geography', 'Art', 'Music', 
    'Physical Education', 'Computing', 'Languages', 'Religious Studies', 'PSHE'
  ]

  const yearGroups = [
    'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
    'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
  ]

  const assessmentTypes = [
    { value: 'quiz', label: 'Quick Quiz', description: 'Short assessment for checking understanding' },
    { value: 'test', label: 'Formal Test', description: 'Comprehensive assessment with detailed marking' },
    { value: 'exam', label: 'Examination', description: 'Extended formal assessment' },
    { value: 'rubric', label: 'Assessment Rubric', description: 'Detailed marking criteria and standards' }
  ]

  const questionTypeOptions = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'short-answer', label: 'Short Answer' },
    { value: 'essay', label: 'Essay Questions' },
    { value: 'fill-blanks', label: 'Fill in the Blanks' },
    { value: 'matching', label: 'Matching' }
  ]

  const difficulties = [
    { value: 'easy', label: 'Easy', description: 'Basic recall and understanding' },
    { value: 'medium', label: 'Medium', description: 'Application and analysis' },
    { value: 'hard', label: 'Hard', description: 'Synthesis and evaluation' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleQuestionTypeChange = (questionType: string) => {
    setFormData(prev => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(questionType)
        ? prev.questionTypes.filter(type => type !== questionType)
        : [...prev.questionTypes, questionType]
    }))
  }

  const generateAssessment = async () => {
    if (!formData.subject || !formData.yearGroup || !formData.topic) {
      setError('Please fill in Subject, Year Group, and Topic fields')
      return
    }

    if (formData.questionTypes.length === 0) {
      setError('Please select at least one question type')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await aiService.generateContent({
        toolId: 'assessment-builder',
        toolName: 'Assessment Builder',
        category: 'Assessment',
        formData: {
          ...formData,
          questionTypes: formData.questionTypes.join(', ')
        },
        priority: 'high'
      })

      if (response.success) {
        setGeneratedAssessment(response.content)
      } else {
        throw new Error(response.error || 'Failed to generate assessment')
      }
    } catch (error) {
      console.error('Error generating assessment:', error)
      setError('Failed to generate assessment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadAssessment = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedAssessment], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `assessment-${formData.subject}-${formData.yearGroup}-${formData.topic.replace(/\s+/g, '-')}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
            <PenTool className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assessment Builder</h1>
            <p className="text-gray-600">Create quizzes, tests, and rubrics with AI assistance</p>
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
              Assessment Details
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

            {/* Topic */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic/Learning Area *
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="e.g., Algebra, Shakespeare, Cell Biology"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent"
                required
              />
            </div>

            {/* Assessment Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Assessment Type
              </label>
              <div className="grid grid-cols-1 gap-2">
                {assessmentTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setFormData(prev => ({ ...prev, assessmentType: type.value }))}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                      formData.assessmentType === type.value
                        ? 'border-sp-brand-blue bg-sp-brand-blue/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CheckCircle className={`w-5 h-5 mt-0.5 ${formData.assessmentType === type.value ? 'text-sp-brand-blue' : 'text-gray-400'}`} />
                    <div>
                      <div className={`font-medium ${formData.assessmentType === type.value ? 'text-sp-brand-blue' : 'text-gray-900'}`}>
                        {type.label}
                      </div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count and Duration */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <select
                  name="questionCount"
                  value={formData.questionCount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent"
                >
                  {[5, 10, 15, 20, 25, 30].map(count => (
                    <option key={count} value={count.toString()}>{count} questions</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent"
                >
                  {[15, 30, 45, 60, 90, 120].map(duration => (
                    <option key={duration} value={duration.toString()}>{duration} mins</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Question Types */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Question Types (Select multiple)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {questionTypeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleQuestionTypeChange(option.value)}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      formData.questionTypes.includes(option.value)
                        ? 'border-sp-brand-blue bg-sp-brand-blue/10 text-sp-brand-blue'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <CheckCircle className={`w-4 h-4 ${formData.questionTypes.includes(option.value) ? 'text-sp-brand-blue' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Difficulty Level
              </label>
              <div className="grid grid-cols-1 gap-2">
                {difficulties.map(diff => (
                  <button
                    key={diff.value}
                    onClick={() => setFormData(prev => ({ ...prev, difficulty: diff.value }))}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                      formData.difficulty === diff.value
                        ? 'border-sp-brand-blue bg-sp-brand-blue/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Target className={`w-5 h-5 mt-0.5 ${formData.difficulty === diff.value ? 'text-sp-brand-blue' : 'text-gray-400'}`} />
                    <div>
                      <div className={`font-medium ${formData.difficulty === diff.value ? 'text-sp-brand-blue' : 'text-gray-900'}`}>
                        {diff.label}
                      </div>
                      <div className="text-sm text-gray-600">{diff.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                placeholder="Any specific requirements, focus areas, or instructions for the assessment"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sp-brand-blue focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateAssessment}
              disabled={isLoading || !formData.subject || !formData.yearGroup || !formData.topic || formData.questionTypes.length === 0}
              className="w-full bg-gradient-to-r from-sp-brand-blue to-sp-brand-red text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Assessment...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Assessment
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
        </div>

        {/* Generated Assessment Panel */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sp-brand-blue" />
            Generated Assessment
          </h2>

          {!generatedAssessment ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <PenTool className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assessment generated yet</h3>
              <p className="text-gray-600">Configure your assessment settings and click "Generate Assessment" to create your quiz, test, or rubric.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Your Assessment</h3>
                <button
                  onClick={downloadAssessment}
                  className="flex items-center gap-2 px-3 py-1 bg-sp-brand-blue text-white rounded-lg hover:bg-sp-brand-blue/90 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {generatedAssessment}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AssessmentBuilder 