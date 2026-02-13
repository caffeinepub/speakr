import { useState } from 'react';

const MAX_DURATION_SECONDS = 3 * 60 * 60; // 3 hours

export function useAudioDurationValidation() {
  const [durationError, setDurationError] = useState<string | null>(null);

  const validateAudioFile = (file: File) => {
    setDurationError(null);

    const audio = new Audio();
    const objectUrl = URL.createObjectURL(file);

    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(objectUrl);
      
      if (audio.duration > MAX_DURATION_SECONDS) {
        const hours = Math.floor(audio.duration / 3600);
        const minutes = Math.floor((audio.duration % 3600) / 60);
        setDurationError(
          `Audio duration (${hours}h ${minutes}m) exceeds the 3-hour maximum limit.`
        );
      }
    });

    audio.addEventListener('error', () => {
      URL.revokeObjectURL(objectUrl);
      setDurationError('Unable to read audio file metadata.');
    });

    audio.src = objectUrl;
  };

  return { durationError, validateAudioFile };
}
