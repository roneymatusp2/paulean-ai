import React, { useRef, useState } from 'react';

// Example 1: Basic Text-to-Speech with voice selection
export const BasicTTS: React.FC<{ text: string }> = ({ text }) => {
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find British English voice
    const voices = window.speechSynthesis.getVoices();
    const britishVoice = voices.find(voice => voice.lang === 'en-GB');
    
    if (britishVoice) {
      utterance.voice = britishVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  return <button onClick={speak}>Speak Text</button>;
};

// Example 2: Playing MP3 from backend URL
export const BackendAudioPlayer: React.FC<{ audioUrl: string }> = ({ audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div>
      <audio 
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
      />
      <button onClick={isPlaying ? handlePause : handlePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

// Example 3: Web Speech API with React hooks
export const useSpeechSynthesis = () => {
  const [speaking, setSpeaking] = useState(false);
  
  const speak = (text: string, lang: string = 'en-GB') => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Find a voice for the specified language
    const voice = voices.find(v => v.lang === lang);
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };
  
  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };
  
  return { speak, stop, speaking };
};

// Example 4: Complete voice chat interface
export const VoiceChatInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { speak, speaking } = useSpeechSynthesis();
  
  // Simple mock Speech Recognition (you'd use react-speech-recognition in production)
  const startRecording = () => {
    setIsRecording(true);
    // In production, use react-speech-recognition
    console.log('Start recording');
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    // In production, use react-speech-recognition
    console.log('Stop recording');
  };
  
  const handleSendMessage = async () => {
    // Send to your backend
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    const data = await response.json();
    
    // Option 1: Use frontend TTS
    speak(data.text);
    
    // Option 2: Play audio URL from backend
    // if (data.audioUrl) {
    //   const audio = new Audio(data.audioUrl);
    //   audio.play();
    // }
  };
  
  return (
    <div className="voice-chat">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type or speak your message"
      />
      
      <button onClick={handleSendMessage}>Send</button>
      
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={isRecording ? 'recording' : ''}
      >
        {isRecording ? '🔴 Recording' : '🎤 Record'}
      </button>
      
      {speaking && <span>Speaking...</span>}
    </div>
  );
};