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
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setProgress({
            currentTime: audioRef.current.currentTime,
            duration: audioRef.current.duration || 0,
          });
        }
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }
  }, []);

  const play = (item?: MockAudioItem) => {
    if (!audioRef.current) return;

    if (item && item.id !== currentItem?.id) {
      setCurrentItem(item);
      audioRef.current.src = item.audioUrl;
      audioRef.current.load();
    }

    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch((error) => {
      console.error('Playback failed:', error);
    });
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const setVolume = (vol: number) => {
    if (audioRef.current) {
      audioRef.current.volume = vol;
      setVolumeState(vol);
    }
  };

  const close = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.currentTime = 0;
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
