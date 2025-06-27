// API service functions for communication with Supabase Edge Functions

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://gjvtncdjcslnkfctqnfy.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdnRuY2RqY3NsbmtmY3RxbmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NzM0MDEsImV4cCI6MjA1OTU0OTQwMX0.AzALxUUvYLJJtDkvxt7efJ7bGxeKmzOs-fT5bQOndiU';
const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

// Debug log to verify environment variables are loaded
console.log('Supabase URL:', SUPABASE_URL);
console.log('Anon Key:', SUPABASE_ANON_KEY ? 'Loaded (hidden)' : 'Not loaded');

interface AskPauleanResponse {
  answer: string;
  sources: Array<{ title: string; url: string }>;
}

interface TranscribeResponse {
  transcribed_text: string;
}

export class APIError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

// Helper function to create authenticated headers
function getAuthHeaders(contentType?: string): HeadersInit {
  const headers: HeadersInit = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'x-client-info': 'paulean-ai/1.0.0',
  };
  
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  
  return headers;
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response, url: string): Promise<T> {
  const responseText = await response.text();
  
  if (!response.ok) {
    console.error('API Error Details:', {
      url,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText,
    });
    
    let errorData: any;
    try {
      errorData = JSON.parse(responseText);
    } catch {
      errorData = { error: responseText || 'Unknown error' };
    }
    
    // Provide user-friendly error messages
    let message = errorData.error || errorData.message || `HTTP error ${response.status}`;
    if (response.status === 401) {
      message = 'Authentication failed. Please check your API configuration.';
    } else if (response.status === 500) {
      message = 'Server error. The AI service may be temporarily unavailable.';
    }
    
    throw new APIError(response.status, message);
  }
  
  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error('Invalid response format from server');
  }
}

// Helper function to handle blob responses
async function handleBlobResponse(response: Response): Promise<Blob> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error (Blob):', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });
    
    throw new APIError(response.status, errorText || `HTTP error ${response.status}`);
  }
  return await response.blob();
}

// Ask Paulean AI a question
export async function askPauleanAI(query: string): Promise<AskPauleanResponse> {
  const url = `${FUNCTIONS_URL}/ask-paulean`;
  
  try {
    console.log('Calling ask-paulean with query:', query);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders('application/json'),
      body: JSON.stringify({ query }),
    });

    const result = await handleResponse<AskPauleanResponse>(response, url);
    console.log('AI response received:', result);
    return result;
  } catch (error) {
    if (error instanceof APIError) throw error;
    console.error('Error asking Paulean AI:', error);
    throw new Error('Failed to connect to Paulean AI. Please check your internet connection.');
  }
}

// Transcribe audio to text
export async function transcribeAudio(audioBlob: Blob): Promise<TranscribeResponse> {
  const url = `${FUNCTIONS_URL}/transcribe-audio`;
  
  try {
    console.log('Transcribing audio, blob size:', audioBlob.size);
    
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'audio.wav');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'x-client-info': 'paulean-ai/1.0.0',
      },
      body: formData,
    });

    const result = await handleResponse<TranscribeResponse>(response, url);
    console.log('Transcription received:', result);
    return result;
  } catch (error) {
    if (error instanceof APIError) throw error;
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio. Please try again.');
  }
}

// Convert text to speech
export async function speakPauleanAnswer(text: string, voice: string = 'nova'): Promise<Blob> {
  const url = `${FUNCTIONS_URL}/speak-answer`;
  
  try {
    console.log('Generating speech for text:', text.substring(0, 50) + '...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders('application/json'),
      body: JSON.stringify({ text, voice }),
    });

    return await handleBlobResponse(response);
  } catch (error) {
    if (error instanceof APIError) throw error;
    console.error('Error generating speech:', error);
    throw new Error('Failed to generate speech. Please try again.');
  }
}

// Test API connectivity
export async function testAPIConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/ask-paulean`, {
      method: 'OPTIONS',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
      },
    });
    
    console.log('API connection test:', response.ok ? 'Success' : 'Failed', response.status);
    return response.ok || response.status === 200;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}

// Initialize the API (can be used to verify connectivity on app start)
export async function initializeAPI(): Promise<void> {
  console.log('Initializing Paulean AI API...');
  console.log('Functions URL:', FUNCTIONS_URL);
  
  const isConnected = await testAPIConnection();
  if (!isConnected) {
    console.warn('Unable to verify connection to Paulean AI API. Some features may be unavailable.');
  } else {
    console.log('Successfully connected to Paulean AI API');
  }
}