import { useState, useRef, useCallback } from 'react';

export interface UseAudioPlayerResult {
  isPlaying: boolean;
  playAudio: (audioBlob: Blob) => Promise<void>;
  stopAudio: () => void;
  error: string | null;
}

export function useAudioPlayer(): UseAudioPlayerResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback(async (audioBlob: Blob) => {
    try {
      setError(null);
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      // Create new audio element
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audioRef.current = audio;
      
      // Set up event handlers
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };
      audio.onerror = () => {
        setError('Failed to play audio');
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      // Play the audio
      await audio.play();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to play audio';
      setError(message);
      setIsPlaying(false);
      console.error('Error playing audio:', err);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  return {
    isPlaying,
    playAudio,
    stopAudio,
    error,
  };
}