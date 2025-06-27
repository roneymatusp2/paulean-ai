export interface Source {
  title: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  sources?: Source[];
  error?: boolean;
}

export type ChatState = 'idle' | 'loading' | 'speaking' | 'listening' | 'error';