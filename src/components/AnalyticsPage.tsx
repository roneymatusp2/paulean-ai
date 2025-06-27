import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  BarChart3, 
  Brain, 
  Cpu, 
  Zap, 
  Clock, 
  DollarSign,
  Activity,
  TrendingUp,
  Users,
  Calendar,
  PieChart
} from 'lucide-react'
import { advancedAIService } from '../services/aiService'

interface AnalyticsData {
  totalGenerations: number
  totalTokens: number
  totalCost: string
  avgDuration: number
  providerStats: Record<string, number>
  recentGenerations: any[]
}

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week')

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const data = await advancedAIService.getUsageAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    }
    setLoading(false)
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'OpenAI': return 'bg-green-500'
      case 'Claude': return 'bg-purple-500'
      case 'Mistral': return 'bg-orange-500'
      case 'TopMedia': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'OpenAI': return <Brain className="w-4 h-4" />
      case 'Claude': return <Cpu className="w-4 h-4" />
      case 'Mistral': return <Zap className="w-4 h-4" />
      case 'TopMedia': return <Activity className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sp-bg-light">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sp-brand-blue"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sp-bg-light">
      {/* Header */}
      <div className="bg-white border-b border-sp-bg-medium">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="p-2 hover:bg-sp-bg-light rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-sp-text-medium" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-sp-text-primary font-archer">AI Analytics</h1>
                <p className="text-sp-text-medium font-segoe">Monitor your AI usage and performance</p>
              </div>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex bg-sp-bg-light rounded-lg p-1">
              {(['day', 'week', 'month'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-white text-sp-brand-blue shadow-sm'
                      : 'text-sp-text-medium hover:text-sp-text-primary'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {analytics ? (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 border border-sp-bg-medium">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-sp-text-medium">Total Generations</p>
                    <p className="text-2xl font-bold text-sp-text-primary mt-1">{analytics.totalGenerations}</p>
                  </div>
                  <div className="p-3 bg-sp-brand-blue/10 rounded-lg">
                    <Brain className="w-6 h-6 text-sp-brand-blue" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12%</span>
                  <span className="text-sp-text-medium ml-1">vs last {timeRange}</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-sp-bg-medium">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-sp-text-medium">Total Tokens</p>
                    <p className="text-2xl font-bold text-sp-text-primary mt-1">{analytics.totalTokens.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-sp-brand-red/10 rounded-lg">
                    <Zap className="w-6 h-6 text-sp-brand-red" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+8%</span>
                  <span className="text-sp-text-medium ml-1">vs last {timeRange}</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-sp-bg-medium">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-sp-text-medium">Total Cost</p>
                    <p className="text-2xl font-bold text-sp-text-primary mt-1">£{analytics.totalCost}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">-5%</span>
                  <span className="text-sp-text-medium ml-1">vs last {timeRange}</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-sp-bg-medium">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-sp-text-medium">Avg Response Time</p>
                    <p className="text-2xl font-bold text-sp-text-primary mt-1">{analytics.avgDuration}ms</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-600">+3%</span>
                  <span className="text-sp-text-medium ml-1">vs last {timeRange}</span>
                </div>
              </div>
            </div>

            {/* Provider Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-sp-bg-medium">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-sp-brand-blue/10 rounded-lg">
                    <PieChart className="w-5 h-5 text-sp-brand-blue" />
                  </div>
                  <h3 className="text-lg font-bold text-sp-text-primary font-archer">AI Provider Distribution</h3>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(analytics.providerStats).map(([provider, count]) => {
                    const percentage = (count / analytics.totalGenerations * 100).toFixed(1)
                    return (
                      <div key={provider} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getProviderColor(provider)}`}></div>
                          <div className="flex items-center gap-2">
                            {getProviderIcon(provider)}
                            <span className="font-medium text-sp-text-primary">{provider}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-sp-text-medium">{count} requests</span>
                          <span className="text-sm font-medium text-sp-brand-blue">{percentage}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 border border-sp-bg-medium">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-sp-brand-red/10 rounded-lg">
                    <Activity className="w-5 h-5 text-sp-brand-red" />
                  </div>
                  <h3 className="text-lg font-bold text-sp-text-primary font-archer">Recent Activity</h3>
                </div>
                
                <div className="space-y-3">
                  {analytics.recentGenerations.slice(0, 8).map((gen, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-sp-bg-light last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${getProviderColor(gen.provider)}`}></div>
                        <div>
                          <p className="text-sm font-medium text-sp-text-primary truncate max-w-32">{gen.tool_name}</p>
                          <p className="text-xs text-sp-text-medium">{gen.provider} • {gen.tokens_used || 0} tokens</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-sp-text-medium">
                          {new Date(gen.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-green-600">£{(gen.cost || 0).toFixed(4)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Usage Insights */}
            <div className="bg-white rounded-xl p-6 border border-sp-bg-medium">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-sp-brand-blue/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-sp-brand-blue" />
                </div>
                <h3 className="text-lg font-bold text-sp-text-primary font-archer">Usage Insights</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-sp-brand-blue mb-2">
                    {Object.values(analytics.providerStats).reduce((a, b) => Math.max(a, b), 0)}
                  </div>
                  <p className="text-sm text-sp-text-medium">Most Used Provider</p>
                  <p className="text-xs text-sp-text-secondary mt-1">
                    {Object.entries(analytics.providerStats).reduce((a, b) => a[1] > b[1] ? a : b)[0]}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-sp-brand-red mb-2">
                    {Math.round(analytics.totalTokens / analytics.totalGenerations)}
                  </div>
                  <p className="text-sm text-sp-text-medium">Avg Tokens per Request</p>
                  <p className="text-xs text-sp-text-secondary mt-1">
                    Across all providers
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    £{(parseFloat(analytics.totalCost) / analytics.totalGenerations).toFixed(4)}
                  </div>
                  <p className="text-sm text-sp-text-medium">Avg Cost per Request</p>
                  <p className="text-xs text-sp-text-secondary mt-1">
                    Cost efficiency metric
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <BarChart3 className="w-16 h-16 text-sp-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-sp-text-primary mb-2">No Analytics Data</h3>
            <p className="text-sp-text-medium">Start using PauleanAI tools to see your analytics here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsPage 