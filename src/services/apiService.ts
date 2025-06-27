// Serviço para interagir com a API backend do Paulean AI

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface QueryRequest {
  query: string;
  generate_speech?: boolean;
}

export interface SourceDocument {
  title: string | null;
  url: string | null;
  content_preview?: string | null;
}

export interface AnswerResponse {
  answer: string;
  sources: SourceDocument[];
  audio_url?: string | null;
  error?: string | null;
}

export interface TranscribeResponse {
  transcribed_text: string;
  error?: string | null;
}

export class ApiService {
  // Enviar pergunta para o chatbot
  static async askQuestion(query: string, generateSpeech: boolean = false): Promise<AnswerResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          generate_speech: generateSpeech,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error asking question:', error);
      throw error;
    }
  }

  // Gerar áudio a partir de texto
  static async generateSpeech(text: string, voice: string = 'nova'): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate_speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  // Transcrever áudio para texto
  static async transcribeAudio(audioBlob: Blob, filename: string = 'audio.webm'): Promise<TranscribeResponse> {
    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, filename);

      const response = await fetch(`${API_BASE_URL}/api/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  // Verificar saúde da API
  static async checkHealth(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }
}

// Helper para tocar áudio
export async function playAudioFromText(text: string, voice: string = 'nova'): Promise<void> {
  try {
    const audioBlob = await ApiService.generateSpeech(text, voice);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        reject(error);
      };
      
      audio.play().catch(reject);
    });
  } catch (error) {
    console.error('Error playing audio:', error);
    throw error;
  }
}