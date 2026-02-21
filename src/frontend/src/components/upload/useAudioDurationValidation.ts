import { useState } from 'react';

export function useAudioDurationValidation(maxDurationHours: number = 3) {
  const [durationError, setDurationError] = useState<string | null>(null);
  const MAX_DURATION_SECONDS = maxDurationHours * 60 * 60;

  const validateAudioFile = (file: File) => {
    setDurationError(null);

    const audio = new Audio();
    const objectUrl = URL.createObjectURL(file);

    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(objectUrl);
      
      if (audio.duration > MAX_DURATION_SECONDS) {
        setDurationError(
          `Audio file exceeds the maximum duration of ${maxDurationHours} hour${maxDurationHours > 1 ? 's' : ''}. Your file is ${formatDuration(audio.duration)}.`
        );
      }
    });

    audio.addEventListener('error', () => {
      URL.revokeObjectURL(objectUrl);
      setDurationError('Unable to read audio file. Please ensure it is a valid audio file.');
    });

    audio.src = objectUrl;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
    }
    return `${mins} minute${mins !== 1 ? 's' : ''}`;
  };

  return { durationError, validateAudioFile, maxDurationSeconds: MAX_DURATION_SECONDS };
}
