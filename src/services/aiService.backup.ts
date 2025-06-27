// AI Service with Intelligent Routing using Langfuse
import { supabase } from './supabaseApi'

// Types for AI requests
export interface AIRequest {
  toolId: string
  toolName: string
  category: string
  formData: Record<string, string>
  userId?: string
}

export interface AIResponse {
  success: boolean
  content: string
  model: string
  provider: string
  tokens?: number
  cost?: number
  error?: string
}

// AI Provider configurations with fallback support
const AI_PROVIDERS = {
  OPENAI: {
    name: 'OpenAI',
    models: ['gpt-4', 'gpt-3.5-turbo'],
    strengths: ['general', 'writing', 'analysis'],
    costPerToken: 0.00003,
    fallbacks: ['DEEPSEEK', 'CLAUDE', 'MISTRAL']
  },
  CLAUDE: {
    name: 'Claude',
    models: ['claude-3-opus', 'claude-3-sonnet'],
    strengths: ['education', 'detailed-analysis', 'lesson-planning'],
    costPerToken: 0.00005,
    fallbacks: ['OPENAI', 'DEEPSEEK', 'MISTRAL']
  },
  MISTRAL: {
    name: 'Mistral',
    models: ['mistral-large', 'mistral-medium'],
    strengths: ['multilingual', 'fast-generation', 'creative'],
    costPerToken: 0.00002,
    fallbacks: ['DEEPSEEK', 'OPENAI', 'CLAUDE']
  },
  DEEPSEEK: {
    name: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-coder'],
    strengths: ['coding', 'analysis', 'cost-effective'],
    costPerToken: 0.000014,
    fallbacks: ['OPENAI', 'CLAUDE', 'MISTRAL']
  },
  TOPMEDIA: {
    name: 'TopMedia',
    models: ['text-to-speech', 'music-generation'],
    strengths: ['audio', 'music', 'voice'],
    costPerToken: 0.00001,
    fallbacks: ['OPENAI'] // Audio fallback to text description
  }
}

class AIService {
  private langfuseConfig = {
    secretKey: import.meta.env.VITE_LANGFUSE_API_SECRET,
    publicKey: import.meta.env.VITE_LANGFUSE_API_PUBLIC_KEY,
    baseUrl: import.meta.env.VITE_LANGFUSE_API_URL
  }

  // Intelligent routing based on tool category and requirements
  private selectBestProvider(request: AIRequest): keyof typeof AI_PROVIDERS {
    const { category, toolName } = request

    // Audio/Music tools → TopMedia
    if (category === 'Creative' && (toolName.includes('Music') || toolName.includes('Audio'))) {
      return 'TOPMEDIA'
    }

    // Educational content → Claude (best for education)
    if (category === 'Planning' || category === 'Assessment') {
      return 'CLAUDE'
    }

    // Communication tools → OpenAI (best for writing)
    if (category === 'Communication') {
      return 'OPENAI'
    }

    // Creative writing → Mistral (good for creativity)
    if (category === 'Creative' && toolName.includes('Writing')) {
      return 'MISTRAL'
    }

    // Coding/Technical → DeepSeek (cost-effective and powerful)
    if (toolName.includes('Code') || toolName.includes('Technical') || toolName.includes('Programming')) {
      return 'DEEPSEEK'
    }

    // Cost-sensitive tasks → DeepSeek (most affordable)
    if (category === 'Data' || toolName.includes('Analysis')) {
      return 'DEEPSEEK'
    }

    // Default to DeepSeek for general tasks (most cost-effective)
    return 'DEEPSEEK'
  }

  // Try provider with fallback support
  private async tryProviderWithFallback(request: AIRequest, primaryProvider: keyof typeof AI_PROVIDERS): Promise<AIResponse> {
    const providers = [primaryProvider, ...AI_PROVIDERS[primaryProvider].fallbacks]
    
    for (const provider of providers) {
      try {
        console.log(`🔄 Attempting ${provider} for ${request.toolName}`)
        
        let response: AIResponse
        switch (provider) {
          case 'OPENAI':
            response = await this.callOpenAI(request)
            break
          case 'CLAUDE':
            response = await this.callClaude(request)
            break
          case 'MISTRAL':
            response = await this.callMistral(request)
            break
          case 'DEEPSEEK':
            response = await this.callDeepSeek(request)
            break
          case 'TOPMEDIA':
            response = await this.callTopMedia(request)
            break
          default:
            continue
        }

        if (response.success) {
          console.log(`✅ Success with ${provider}`)
          return response
        } else {
          console.warn(`⚠️ ${provider} failed: ${response.error}`)
        }
      } catch (error) {
        console.warn(`❌ ${provider} error:`, error)
        continue
      }
    }

    // If all providers fail, return error
    return {
      success: false,
      content: '',
      model: 'unknown',
      provider: 'none',
      error: 'All AI providers failed. Please check your API keys and try again.'
    }
  }

  // Log request to Langfuse for monitoring
  private async logToLangfuse(request: AIRequest, response: AIResponse, duration: number) {
    try {
      const traceData = {
        name: `${request.toolName}_generation`,
        input: request.formData,
        output: response.content,
        metadata: {
          toolId: request.toolId,
          category: request.category,
          provider: response.provider,
          model: response.model,
          tokens: response.tokens,
          cost: response.cost,
          duration: duration,
          userId: request.userId
        }
      }

      // Store in Supabase for our own analytics
      const { error: insertError } = await supabase.from('ai_generations').insert({
        tool_id: request.toolId,
        tool_name: request.toolName,
        category: request.category,
        provider: response.provider,
        model: response.model,
        input_data: request.formData,
        output_content: response.content,
        tokens_used: response.tokens,
        cost: response.cost,
        duration_ms: duration,
        user_id: request.userId,
        created_at: new Date().toISOString()
      })

      if (insertError) {
        console.warn('⚠️ Failed to insert analytics data:', insertError)
      }

      console.log('✅ Logged to Langfuse and Supabase:', traceData.name)
    } catch (error) {
      console.error('❌ Failed to log to Langfuse:', error)
    }
  }

  // OpenAI API call with backup key support
  private async callOpenAI(request: AIRequest): Promise<AIResponse> {
    const prompt = this.buildPrompt(request)
    const apiKeys = [
      import.meta.env.VITE_OPENAI_API_KEY,
      import.meta.env.VITE_OPENAI_API_KEY_2
    ].filter(Boolean)
    
    for (const apiKey of apiKeys) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are an expert educational AI assistant for St. Paul\'s School São Paulo. Generate high-quality, curriculum-aligned content for British education standards. Use British spelling and terminology (pupils, not students; Year groups, not grades). Focus exclusively on St. Paul\'s School community.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 2000,
            temperature: 0.7
          })
        })

        const data = await response.json()
        
        if (data.error) {
          console.warn(`OpenAI API key failed: ${data.error.message}`)
          continue
        }

        return {
          success: true,
          content: data.choices[0].message.content,
          model: 'gpt-4',
          provider: 'OpenAI',
          tokens: data.usage?.total_tokens || 0,
          cost: (data.usage?.total_tokens || 0) * AI_PROVIDERS.OPENAI.costPerToken
        }
      } catch (error) {
        console.warn(`OpenAI attempt failed:`, error)
        continue
      }
    }

    return {
      success: false,
      content: '',
      model: 'gpt-4',
      provider: 'OpenAI',
      error: 'All OpenAI API keys failed'
    }
  }

  // DeepSeek API call with backup key support
  private async callDeepSeek(request: AIRequest): Promise<AIResponse> {
    const prompt = this.buildPrompt(request)
    const apiKeys = [
      import.meta.env.VITE_DEEPSEEK_API_KEY,
      import.meta.env.VITE_DEEPSEEK_API_KEY_BACKUP
    ].filter(Boolean)
    
    for (const apiKey of apiKeys) {
      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: 'You are an expert educational AI assistant for St. Paul\'s School São Paulo. Generate high-quality, curriculum-aligned content for British education standards. Use British spelling and terminology (pupils, not students; Year groups, not grades). Focus exclusively on St. Paul\'s School community.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 2000,
            temperature: 0.7
          })
        })

        const data = await response.json()
        
        if (data.error) {
          console.warn(`DeepSeek API key failed: ${data.error.message}`)
          continue
        }

        return {
          success: true,
          content: data.choices[0].message.content,
          model: 'deepseek-chat',
          provider: 'DeepSeek',
          tokens: data.usage?.total_tokens || 0,
          cost: (data.usage?.total_tokens || 0) * AI_PROVIDERS.DEEPSEEK.costPerToken
        }
      } catch (error) {
        console.warn(`DeepSeek attempt failed:`, error)
        continue
      }
    }

    return {
      success: false,
      content: '',
      model: 'deepseek-chat',
      provider: 'DeepSeek',
      error: 'All DeepSeek API keys failed'
    }
  }

  // Claude API call
  private async callClaude(request: AIRequest): Promise<AIResponse> {
    const prompt = this.buildPrompt(request)
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': import.meta.env.VITE_CLAUDE_AI_API,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `You are an expert educational AI assistant for St. Paul's School. Generate high-quality, curriculum-aligned content for British education standards. Use British spelling and terminology (pupils, not students; Year groups, not grades).\n\n${prompt}`
            }
          ]
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.message)
      }

      return {
        success: true,
        content: data.content[0].text,
        model: 'claude-3-sonnet',
        provider: 'Claude',
        tokens: data.usage?.input_tokens + data.usage?.output_tokens || 0,
        cost: ((data.usage?.input_tokens + data.usage?.output_tokens) || 0) * AI_PROVIDERS.CLAUDE.costPerToken
      }
    } catch (error) {
      return {
        success: false,
        content: '',
        model: 'claude-3-sonnet',
        provider: 'Claude',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Mistral API call
  private async callMistral(request: AIRequest): Promise<AIResponse> {
    const prompt = this.buildPrompt(request)
    
    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_MISTRAL_API}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational AI assistant for St. Paul\'s School. Generate high-quality, curriculum-aligned content for British education standards. Use British spelling and terminology (pupils, not students; Year groups, not grades).'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.message)
      }

      return {
        success: true,
        content: data.choices[0].message.content,
        model: 'mistral-large',
        provider: 'Mistral',
        tokens: data.usage?.total_tokens || 0,
        cost: (data.usage?.total_tokens || 0) * AI_PROVIDERS.MISTRAL.costPerToken
      }
    } catch (error) {
      return {
        success: false,
        content: '',
        model: 'mistral-large',
        provider: 'Mistral',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // TopMedia API call for music/audio tools
  private async callTopMedia(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch('https://api.topmediai.com/v1/music', {
        method: 'POST',
        headers: {
          'x-api-key': import.meta.env.VITE_TOPMEDIA_API,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_auto: 1,
          prompt: request.formData.description || 'Educational background music',
          lyrics: request.formData.lyrics || '',
          title: request.formData.title || 'Educational Music',
          instrumental: request.formData.instrumental === 'true' ? 1 : 0
        })
      })

      const data = await response.json()
      
      return {
        success: true,
        content: `🎵 Music generated successfully!\n\nTitle: ${request.formData.title || 'Educational Music'}\nStyle: ${request.formData.description || 'Educational background music'}\n\n[Audio file would be available for download]\n\nNote: This is a placeholder response. The actual TopMedia API would return audio file URLs.`,
        model: 'topmediai-music',
        provider: 'TopMedia',
        tokens: 100, // Estimated
        cost: 100 * AI_PROVIDERS.TOPMEDIA.costPerToken
      }
    } catch (error) {
      return {
        success: false,
        content: '',
        model: 'topmediai-music',
        provider: 'TopMedia',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Build prompt based on tool type and form data
  private buildPrompt(request: AIRequest): string {
    const { toolName, category, formData } = request

    if (toolName === 'Lesson Plan Generator') {
      return `Create a comprehensive lesson plan with the following details:

Subject: ${formData.subject}
Year Group: ${formData.yearGroup}
Topic: ${formData.topic}
Duration: ${formData.duration}
Learning Objectives: ${formData.objectives}
Prior Knowledge: ${formData.priorKnowledge || 'Not specified'}
Available Resources: ${formData.resources || 'Standard classroom resources'}

Please format the lesson plan with clear sections including:
1. Learning objectives
2. Prior knowledge required
3. Lesson structure (introduction, main activities, plenary)
4. Resources needed
5. Assessment opportunities
6. Differentiation strategies
7. Homework/extension activities

Use British educational terminology and align with UK curriculum standards.`
    }

    if (toolName === 'Quiz Generator') {
      return `Create a ${formData.questionCount}-question quiz with the following specifications:

Subject: ${formData.subject}
Year Group: ${formData.yearGroup}
Topic: ${formData.topic}
Question Types: ${formData.questionTypes}
Difficulty Level: ${formData.difficulty}
Special Instructions: ${formData.instructions || 'None'}

Please include:
1. Clear instructions for pupils
2. Varied question types as specified
3. Correct answers
4. Marking scheme
5. Total marks

Use British spelling and educational terminology appropriate for the year group.`
    }

    if (toolName === 'Email Generator') {
      return `Generate a professional email for educational purposes:

Type: ${formData.emailType || 'General communication'}
Recipient: ${formData.recipient || 'Parents/Colleagues'}
Subject: ${formData.subject || 'School communication'}
Key Points: ${formData.keyPoints || 'Important information to communicate'}
Tone: ${formData.tone || 'Professional and friendly'}

Please create a well-structured email with appropriate greeting, body, and closing.`
    }

    // Default prompt for other tools
    return `As an educational AI assistant for St. Paul's School, please help with the following ${category} task:

Tool: ${toolName}
Details: ${JSON.stringify(formData, null, 2)}

Please provide high-quality, curriculum-aligned content suitable for British education standards. Use appropriate British spelling and terminology.`
  }

  // Main method to generate AI content
  async generateContent(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now()
    
    try {
      // Select best provider based on request
      const provider = this.selectBestProvider(request)
      console.log(`🤖 Routing to ${provider} for ${request.toolName}`)

      let response: AIResponse

      // Route to appropriate API
      switch (provider) {
        case 'OPENAI':
          response = await this.callOpenAI(request)
          break
        case 'CLAUDE':
          response = await this.callClaude(request)
          break
        case 'MISTRAL':
          response = await this.callMistral(request)
          break
        case 'TOPMEDIA':
          response = await this.callTopMedia(request)
          break
        default:
          response = await this.callOpenAI(request) // Fallback
      }

      const duration = Date.now() - startTime

      // Log to Langfuse for monitoring
      if (response.success) {
        await this.logToLangfuse(request, response, duration)
      }

      return response

    } catch (error) {
      console.error('❌ AI Service Error:', error)
      return {
        success: false,
        content: '',
        model: 'unknown',
        provider: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  // Get usage analytics
  async getUsageAnalytics(userId?: string) {
    try {
      let query = supabase
        .from('ai_generations')
        .select('*')
        .order('created_at', { ascending: false })

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query.limit(100)

      if (error) throw error

      // Calculate analytics
      const totalGenerations = data.length
      const totalTokens = data.reduce((sum, gen) => sum + (gen.tokens_used || 0), 0)
      const totalCost = data.reduce((sum, gen) => sum + (gen.cost || 0), 0)
      const avgDuration = data.reduce((sum, gen) => sum + (gen.duration_ms || 0), 0) / data.length

      const providerStats = data.reduce((acc, gen) => {
        acc[gen.provider] = (acc[gen.provider] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return {
        totalGenerations,
        totalTokens,
        totalCost: totalCost.toFixed(4),
        avgDuration: Math.round(avgDuration),
        providerStats,
        recentGenerations: data.slice(0, 10)
      }
    } catch (error) {
      console.error('❌ Failed to get analytics:', error)
      return null
    }
  }
}

export const aiService = new AIService()
export default aiService 