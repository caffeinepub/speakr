import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';
import type { MockAudioItem } from '@/mock/mockAudio';

interface PlayerContextValue {
  currentItem: MockAudioItem | null;
  isPlaying: boolean;
  progress: {
    currentTime: number;
    duration: number;
  };
  volume: number;
  play: (item?: MockAudioItem) => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  close: () => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentItem, setCurrentItem] = useState<MockAudioItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState({ currentTime: 0, duration: 0 });
  const [volume, setVolumeState] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      if (!audioRef.current) {
        console.log('[PlayerProvider] Initializing audio element');
        audioRef.current = new Audio();
        
        const handleTimeUpdate = () => {
          if (audioRef.current) {
            setProgress({
              currentTime: audioRef.current.currentTime,
              duration: audioRef.current.duration || 0,
            });
          }
        };
        
        const handleEnded = () => {
          setIsPlaying(false);
        };

        const handleError = (e: Event) => {
          console.error('[PlayerProvider] Audio error:', e);
          setIsPlaying(false);
        };

        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.addEventListener('ended', handleEnded);
        audioRef.current.addEventListener('error', handleError);

        console.log('[PlayerProvider] Audio element initialized successfully');

        // Cleanup function
        return () => {
          if (audioRef.current) {
            audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.removeEventListener('ended', handleEnded);
            audioRef.current.removeEventListener('error', handleError);
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current = null;
          }
        };
      }
    } catch (error) {
      console.error('[PlayerProvider] Failed to initialize audio element:', error);
    }
  }, []);

  const play = (item?: MockAudioItem) => {
    if (!audioRef.current) {
      console.error('[PlayerProvider] Audio element not initialized');
      return;
    }

    try {
      if (item && item.id !== currentItem?.id) {
        setCurrentItem(item);
        audioRef.current.src = item.audioUrl;
        audioRef.current.load();
      }

      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('[PlayerProvider] Playback failed:', error);
      });
    } catch (error) {
      console.error('[PlayerProvider] Play error:', error);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        setIsPlaying(false);
      } catch (error) {
        console.error('[PlayerProvider] Pause error:', error);
      }
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = time;
      } catch (error) {
        console.error('[PlayerProvider] Seek error:', error);
      }
    }
  };

  const setVolume = (vol: number) => {
    if (audioRef.current) {
      try {
        audioRef.current.volume = vol;
        setVolumeState(vol);
      } catch (error) {
        console.error('[PlayerProvider] Volume error:', error);
      }
    }
  };

  const close = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.currentTime = 0;
      } catch (error) {
        console.error('[PlayerProvider] Close error:', error);
      }
    }
    setIsPlaying(false);
    setCurrentItem(null);
    setProgress({ currentTime: 0, duration: 0 });
  };

  return (
    <PlayerContext.Provider
      value={{
        currentItem,
        isPlaying,
        progress,
        volume,
        play,
        pause,
        seek,
        setVolume,
        close,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}
