import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables - using placeholders. Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Create mock client for placeholder mode
const createMockClient = () => ({
  from: (table: string) => ({
    insert: async (data: any) => {
      console.log(`Mock Supabase: Would insert into ${table}:`, data);
      return { data: null, error: null };
    },
    select: (columns: string = '*') => {
      const mockQuery = {
        eq: (column: string, value: any) => mockQuery,
        limit: (count: number) => mockQuery,
        order: (column: string, options: any) => mockQuery,
        // Make it awaitable
        then: (resolve: any) => resolve({ data: [], error: null })
      };
      return mockQuery;
    }
  }),
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        console.log(`Mock Supabase Storage: Would upload ${file.name} to ${bucket}/${path}`);
        return { 
          data: { path, id: 'mock-id', fullPath: `${bucket}/${path}` }, 
          error: null 
        };
      },
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `https://mock-storage.supabase.co/storage/v1/object/public/${bucket}/${path}` }
      })
    })
  }
});

// Create and export Supabase client (or mock if using placeholders)
export const supabase = supabaseUrl === 'https://placeholder.supabase.co' 
  ? createMockClient() 
  : createClient(supabaseUrl, supabaseAnonKey);

// Edge Function URLs
const EDGE_FUNCTIONS = {
  askPaulean: `${supabaseUrl}/functions/v1/ask-paulean`,
  transcribeAudio: `${supabaseUrl}/functions/v1/transcribe-paulean-audio`,
  speakAnswer: `${supabaseUrl}/functions/v1/speak-paulean-answer`,
};

// Types
export interface Source {
  title: string;
  url: string;
}

export interface AskResponse {
  answer: string;
  sources: Source[];
}

export interface TranscribeResponse {
  transcribed_text: string;
}

export interface ApiError {
  error: string;
}

// API functions
export async function askPaulean(query: string): Promise<AskResponse> {
  try {
    // Mock response for testing when Supabase is not configured
    if (supabaseUrl === 'https://placeholder.supabase.co') {
      console.log('Using mock response for testing - configure Supabase to get real responses');
      return {
        answer: "This is a test response. To see real responses from the St. Paul's School AI assistant, please configure your Supabase credentials in the .env file.",
        sources: [
          {
            title: "About St. Paul's School",
            url: "https://www.stpauls.br/about-us"
          },
          {
            title: "Academic Excellence",
            url: "https://www.stpauls.br/academic"
          },
          {
            title: "Admissions", 
            url: "https://www.stpauls.br/admissions"
          }
        ]
      };
    }

    const response = await fetch(EDGE_FUNCTIONS.askPaulean, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error((error as ApiError).error || 'Failed to get answer');
    }

    const result = await response.json();
    console.log('askPaulean response:', result);
    return result;
  } catch (error) {
    console.error('Error calling ask-paulean:', error);
    throw error;
  }
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'recording.webm');

    const response = await fetch(EDGE_FUNCTIONS.transcribeAudio, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error((error as ApiError).error || 'Failed to transcribe audio');
    }

    const data: TranscribeResponse = await response.json();
    return data.transcribed_text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

export async function speakAnswer(text: string, voice: string = 'nova'): Promise<Blob> {
  try {
    const response = await fetch(EDGE_FUNCTIONS.speakAnswer, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ text, voice }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error((error as ApiError).error || 'Failed to generate speech');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}