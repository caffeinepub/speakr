import { useState, useCallback } from 'react';

interface TouchFeedbackOptions {
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  preventDefault?: boolean;
}

export function useTouchFeedback(options: TouchFeedbackOptions = {}) {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (options.preventDefault) {
      e.preventDefault();
    }
    setIsPressed(true);
    options.onTouchStart?.();
  }, [options]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (options.preventDefault) {
      e.preventDefault();
    }
    setIsPressed(false);
    options.onTouchEnd?.();
  }, [options]);

  const handleTouchCancel = useCallback(() => {
    setIsPressed(false);
  }, []);

  return {
    isPressed,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel,
    },
  };
}
