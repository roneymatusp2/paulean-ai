import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import OpenAI from 'https://esm.sh/openai@4.28.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

interface QueryRequest {
  query: string
}

interface Source {
  title: string
  url: string
}

interface AnswerResponse {
  answer: string
  sources: Source[]
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Request received:', req.method, req.url)
    
    // Parse request body
    const { query }: QueryRequest = await req.json()
    
    if (!query) {
      throw new Error('Query is required')
    }
    
    console.log('Query:', query)

    // Check for OpenAI API key
    const openAIKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIKey) {
      console.error('OPENAI_API_KEY is not set')
      throw new Error('OpenAI API key is not configured')
    }
    
    console.log('OpenAI key found')

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openAIKey,
    })

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    console.log('Supabase URL:', supabaseUrl)
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Step 1: Generate embedding for the query
    console.log('Generating embedding for query...')
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    })
    
    const queryEmbedding = embeddingResponse.data[0].embedding
    console.log('Embedding generated successfully')

    // Step 2: Search for similar documents
    console.log('Searching for similar documents...')
    const { data: documents, error: searchError } = await supabase.rpc('match_stpauls_documents', {
      query_embedding_param: queryEmbedding,
      match_threshold_param: 0.75,
      match_count_param: 4,
    })

    if (searchError) {
      console.error('Search error:', searchError)
      throw new Error(`Search error: ${searchError.message}`)
    }
    
    console.log('Documents found:', documents?.length || 0)

    // Step 3: Construct context from retrieved chunks
    const context = documents?.map((doc: any) => doc.content).join('\n\n') || ''
    
    // Step 4: Extract sources
    const sourcesMap = new Map<string, Source>()
    documents?.forEach((doc: any) => {
      const url = doc.metadata?.source_url || '#'
      const title = doc.metadata?.page_title || 'Untitled'
      sourcesMap.set(url, { title, url })
    })
    const sources = Array.from(sourcesMap.values())

    // Step 5: Create prompt for gpt-4o-mini
    const systemPrompt = `You are Paulean AI, a helpful AI assistant for St. Paul's School. Answer questions accurately based ONLY on the provided context. Use British English spelling and conventions throughout your responses. If the answer cannot be found in the context, politely say so.`
    
    const userPrompt = `Context:
${context}

Question: ${query}

Please provide a helpful and accurate answer based on the above context.`

    // Step 6: Get response from gpt-4o-mini
    console.log('Generating AI response...')
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,
    })

    const answer = completion.choices[0].message.content || 'I apologise, I couldn\'t generate an answer.'
    console.log('AI response generated successfully')

    // Return response
    const response: AnswerResponse = {
      answer,
      sources,
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error in ask-paulean function:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})