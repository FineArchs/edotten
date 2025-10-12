'use client';

import { useEffect } from 'react';

export const useKeyPress = (
  targetKey: string | null,
  callback: () => void,
  enabled: boolean = true,
) => {
  useEffect(() => {
    if (!enabled || !targetKey) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input, unless the key is Escape
      if (
        targetKey !== 'Escape' &&
        (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement)
      ) {
        return;
      }

      if (event.key === targetKey) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [targetKey, callback, enabled]);
};
