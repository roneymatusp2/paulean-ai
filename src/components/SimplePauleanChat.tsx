import React, { useState, useEffect } from 'react';
import { useVoiceChat } from '../hooks/useVoiceChat';

interface SimplePauleanChatProps {
  onSendMessage: (message: string) => Promise<string | { text: string; audioUrl?: string }>;
}

const SimplePauleanChat: React.FC<SimplePauleanChatProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  
  const {
    transcript,
    listening,
    startListening,
    stopListening,
    speak,
    isSpeaking,
    playAudioUrl,
    browserSupportsSpeechRecognition,
    voices,
    selectedVoice,
    setSelectedVoice
  } = useVoiceChat({ language: 'en-GB' });

  // Update message when recording stops
  useEffect(() => {
    if (!listening && transcript) {
      setMessage(transcript);
    }
  }, [listening, transcript]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      const result = await onSendMessage(message);
      
      if (typeof result === 'string') {
        // Simple text response
        setResponse(result);
        speak(result);
      } else {
        // Response with optional audio URL
        setResponse(result.text);
        
        if (result.audioUrl) {
          // Play backend-generated audio
          await playAudioUrl(result.audioUrl);
        } else {
          // Use frontend TTS
          speak(result.text);
        }
      }
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <div>Your browser doesn't support speech recognition.</div>;
  }

  return (
    <div className="paulean-chat">
      <div className="chat-response">
        {response && <p>{response}</p>}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type or speak your message..."
        />
        
        <button onClick={handleSendMessage} disabled={!message.trim()}>
          Send
        </button>
        
        <button
          onClick={listening ? stopListening : startListening}
          className={listening ? 'recording' : ''}
        >
          {listening ? '🔴 Stop' : '🎤 Record'}
        </button>
        
        {isSpeaking && <span>🔊 Speaking...</span>}
      </div>
      
      {/* Optional: Voice selector */}
      <select
        value={selectedVoice?.name || ''}
        onChange={(e) => {
          const voice = voices.find(v => v.name === e.target.value);
          if (voice) setSelectedVoice(voice);
        }}
      >
        <option value="">Default Voice</option>
        {voices
          .filter(voice => voice.lang.startsWith('en'))
          .map(voice => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
      </select>
    </div>
  );
};

export default SimplePauleanChat;