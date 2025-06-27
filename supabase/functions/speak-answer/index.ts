import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import OpenAI from 'https://esm.sh/openai@4.28.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

interface SpeakRequest {
  text: string
  voice?: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { text, voice = 'nova' }: SpeakRequest = await req.json()
    
    if (!text) {
      throw new Error('Text is required')
    }

    // Initialize OpenAI client
    const openAIKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIKey) {
      throw new Error('OpenAI API key is not configured')
    }
    
    const openai = new OpenAI({
      apiKey: openAIKey,
    })

    console.log(`Generating speech with voice: ${voice}...`)
    
    // Generate speech using OpenAI TTS
    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
      input: text,
      response_format: 'mp3',
    })

    // Convert the response to a buffer
    const audioBuffer = await mp3Response.arrayBuffer()

    // Return the audio file
    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="speech.mp3"',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error in speak-answer function:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
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