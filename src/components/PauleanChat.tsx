import React, { useState, useRef, useEffect } from 'react';
import { askPauleanAI, transcribeAudio, speakPauleanAnswer } from '../services/api';
import { useVoiceRecording } from '../hooks/useVoiceRecording';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { getLinkForMirroredSite } from '../utils/getLinkForMirroredSite';
import type { ChatMessage, ChatState } from '../types/chat';
import './PauleanChat.css';
import './PauleanChatMobile.css';

const PauleanChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatState, setChatState] = useState<ChatState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState('nova');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isRecording, startRecording, stopRecording, error: recordingError } = useVoiceRecording();
  const { isPlaying, playAudio, error: audioError } = useAudioPlayer();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle errors
  useEffect(() => {
    const errorMessage = recordingError || audioError || error;
    if (errorMessage) {
      console.error('Chat error:', errorMessage);
      setChatState('error');
    }
  }, [recordingError, audioError, error]);

  // Send message to AI
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || chatState === 'loading') return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setChatState('loading');
    setError(null);

    try {
      // Get AI response
      const response = await askPauleanAI(text);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        sender: 'ai',
        timestamp: new Date(),
        sources: response.sources,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Generate and play speech
      if (response.answer) {
        setChatState('speaking');
        const audioBlob = await speakPauleanAnswer(response.answer, selectedVoice);
        await playAudio(audioBlob);
        setChatState('idle');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
      setError(errorMessage);
      
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'I apologise, I encountered an error whilst processing your question. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        error: true,
      };
      
      setMessages(prev => [...prev, errorResponse]);
      setChatState('error');
    }
  };

  // Handle voice recording
  const handleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording
      setChatState('idle');
      const audioBlob = await stopRecording();
      
      if (audioBlob) {
        setChatState('loading');
        try {
          const { transcribed_text } = await transcribeAudio(audioBlob);
          setInputText(transcribed_text);
          setChatState('idle');
          
          // Auto-send the transcribed text
          await handleSendMessage(transcribed_text);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to transcribe audio';
          setError(errorMessage);
          setChatState('error');
        }
      }
    } else {
      // Start recording
      setChatState('listening');
      await startRecording();
    }
  };

  // Play message audio
  const handlePlayMessage = async (text: string) => {
    try {
      setChatState('speaking');
      const audioBlob = await speakPauleanAnswer(text, selectedVoice);
      await playAudio(audioBlob);
      setChatState('idle');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to play audio';
      setError(errorMessage);
      setChatState('error');
    }
  };

  return (
    <div className="paulean-chat flex flex-col h-full">
      <div className="messages-container flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="text-center mt-8">
              <img src="/paulean_ai.png" alt="Paulean AI" className="w-24 h-24 mx-auto mb-4 rounded-full" />
              <p className="text-gray-600">
                Hello! I'm Paulean AI, your assistant for St. Paul's School. 
              </p>
              <p className="text-gray-600">
                How may I help you today?
              </p>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender} ${message.error ? 'error' : ''}`}
          >
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              
              {message.sender === 'ai' && !message.error && (
                <button
                  className="play-button text-sm mt-2"
                  onClick={() => handlePlayMessage(message.text)}
                  disabled={isPlaying || chatState === 'speaking'}
                >
                  {isPlaying ? '🔊 Playing...' : '🔊 Play'}
                </button>
              )}
            </div>
            
            {message.sources && message.sources.length > 0 && (
              <div className="sources mt-3">
                <h4 className="text-sm font-semibold mb-1">Sources:</h4>
                <ul className="space-y-1">
                  {message.sources.map((source, index) => {
                    // Transform the URL to point to our mirror
                    const mirroredUrl = getLinkForMirroredSite(source.url);
                    
                    return (
                      <li key={index}>
                        <a
                          href={mirroredUrl}
                          className="source-link text-blue-600 hover:text-blue-800 text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {source.title}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage(inputText);
              }
            }}
            placeholder="Type your question here..."
            disabled={chatState === 'loading' || chatState === 'listening'}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            className="send-button px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || chatState === 'loading'}
          >
            Send
          </button>
          
          <button
            className={`voice-button px-4 py-2 rounded-lg transition-colors ${
              isRecording 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={handleVoiceInput}
            disabled={chatState === 'loading'}
          >
            {isRecording ? '🔴 Stop' : '🎤 Record'}
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="voice-selector text-sm">
            <label htmlFor="voice-select" className="mr-2">Voice:</label>
            <select
              id="voice-select"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="px-2 py-1 border rounded"
            >
              <option value="nova">Nova (British)</option>
              <option value="alloy">Alloy</option>
              <option value="echo">Echo</option>
              <option value="fable">Fable</option>
              <option value="onyx">Onyx</option>
              <option value="shimmer">Shimmer</option>
            </select>
          </div>
          
          {chatState !== 'idle' && (
            <div className={`chat-status text-sm ${chatState}`}>
              {chatState === 'loading' && 'Processing...'}
              {chatState === 'speaking' && '🔊 Speaking...'}
              {chatState === 'listening' && '🎤 Listening...'}
              {chatState === 'error' && `❌ ${error || 'An error occurred'}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PauleanChat;