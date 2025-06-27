import React, { useState, useRef, useEffect } from 'react';
import { ApiService, playAudioFromText } from '../services/apiService';
import type { SourceDocument } from '../services/apiService';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  sources?: SourceDocument[];
  timestamp: Date;
}

const PauleanChatAPI: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);
  const [selectedVoice, setSelectedVoice] = useState('nova');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Verificar saúde da API ao carregar
  useEffect(() => {
    ApiService.checkHealth()
      .then(() => setApiHealthy(true))
      .catch(() => setApiHealthy(false));
  }, []);

  // Auto-scroll para novas mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enviar mensagem
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await ApiService.askQuestion(text);
      
      if (response.error) {
        throw new Error(response.error);
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        sender: 'ai',
        sources: response.sources,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Tocar resposta em voz
      if (response.answer) {
        setIsSpeaking(true);
        await playAudioFromText(response.answer, selectedVoice);
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, ocorreu um erro ao processar sua pergunta.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Iniciar gravação
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioRecording(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Não foi possível acessar o microfone.');
    }
  };

  // Parar gravação
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Processar áudio gravado
  const processAudioRecording = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const response = await ApiService.transcribeAudio(audioBlob);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.transcribed_text) {
        setInputText(response.transcribed_text);
        // Opcionalmente, enviar automaticamente
        // await sendMessage(response.transcribed_text);
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert('Erro ao transcrever o áudio.');
    } finally {
      setIsLoading(false);
    }
  };

  // Tocar mensagem específica
  const playMessage = async (text: string) => {
    try {
      setIsSpeaking(true);
      await playAudioFromText(text, selectedVoice);
    } catch (error) {
      console.error('Error playing message:', error);
      alert('Erro ao reproduzir o áudio.');
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="paulean-chat-container">
      {/* Status da API */}
      <div className="api-status">
        Status da API: {
          apiHealthy === null ? '🟡 Verificando...' :
          apiHealthy ? '🟢 Online' : '🔴 Offline'
        }
      </div>

      {/* Área de mensagens */}
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender}`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              {message.sender === 'ai' && (
                <button
                  onClick={() => playMessage(message.text)}
                  disabled={isSpeaking}
                  className="play-button"
                >
                  {isSpeaking ? '🔊 Falando...' : '🔊 Ouvir'}
                </button>
              )}
            </div>
            
            {/* Mostrar fontes */}
            {message.sources && message.sources.length > 0 && (
              <div className="sources">
                <h4>Fontes:</h4>
                <ul>
                  {message.sources.map((source, index) => (
                    <li key={index}>
                      <a
                        href={source.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.title || 'Fonte'}
                      </a>
                      {source.content_preview && (
                        <p className="preview">{source.content_preview}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Área de entrada */}
      <div className="input-container">
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="voice-selector"
        >
          <option value="alloy">Alloy</option>
          <option value="echo">Echo</option>
          <option value="fable">Fable</option>
          <option value="onyx">Onyx</option>
          <option value="nova">Nova</option>
          <option value="shimmer">Shimmer</option>
        </select>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
          placeholder="Digite sua pergunta..."
          disabled={isLoading}
          className="text-input"
        />

        <button
          onClick={() => sendMessage(inputText)}
          disabled={isLoading || !inputText.trim()}
          className="send-button"
        >
          {isLoading ? '⏳' : '📤'} Enviar
        </button>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
          className={`record-button ${isRecording ? 'recording' : ''}`}
        >
          {isRecording ? '🔴 Parar' : '🎤 Gravar'}
        </button>
      </div>

      {/* Indicadores de estado */}
      {isLoading && <div className="loading">Processando...</div>}
      {isSpeaking && <div className="speaking">🔊 Falando...</div>}
    </div>
  );
};

export default PauleanChatAPI;