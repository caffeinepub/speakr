import { useState, useEffect } from 'react';

const ONBOARDING_COMPLETE_KEY = 'speakr_onboarding_complete';

export function useOnboarding() {
  const [isComplete, setIsComplete] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true';
  });

  const markComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    }
    setIsComplete(true);
  };

  const reset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ONBOARDING_COMPLETE_KEY);
    }
    setIsComplete(false);
  };

  return {
    isComplete,
    markComplete,
    reset,
  };
}
