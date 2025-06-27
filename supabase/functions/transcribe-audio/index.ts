import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import OpenAI from 'https://esm.sh/openai@4.28.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

interface TranscribeResponse {
  transcribed_text: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Handle different ways audio might be sent
    let audioFile: File | null = null
    
    // Check if it's FormData
    const contentType = req.headers.get('content-type') || ''
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('audio_file')
      
      if (file instanceof File) {
        audioFile = file
      } else if (file) {
        // If it's a blob or other format, convert to File
        const blob = new Blob([file], { type: 'audio/wav' })
        audioFile = new File([blob], 'audio.wav', { type: 'audio/wav' })
      }
    } else {
      // Handle direct binary stream or blob
      const arrayBuffer = await req.arrayBuffer()
      const blob = new Blob([arrayBuffer], { type: contentType || 'audio/wav' })
      audioFile = new File([blob], 'audio.wav', { type: contentType || 'audio/wav' })
    }
    
    if (!audioFile) {
      throw new Error('No audio file provided')
    }

    // Initialize OpenAI client
    const openAIKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIKey) {
      throw new Error('OpenAI API key is not configured')
    }
    
    const openai = new OpenAI({
      apiKey: openAIKey,
    })

    console.log('Starting transcription...')
    
    // Transcribe audio using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
    })

    const response: TranscribeResponse = {
      transcribed_text: transcription.text,
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
    console.error('Error in transcribe-audio function:', error)
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