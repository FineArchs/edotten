'use client';

import { useEffect } from 'react';

/**
 * A custom hook to execute a callback when a specific key combination is pressed.
 * @param targetKey The key combination string (e.g., 'p', 'control+s', 'shift+alt+k').
 * @param callback The function to call when the key is pressed.
 * @param enabled Whether the hook is active.
 */
export const useKeyPress = (
  targetKey: string | null,
  callback: () => void,
  enabled: boolean = true,
) => {
  useEffect(() => {
    if (!enabled || !targetKey) {
      return;
    }

    const lowerTargetKey = targetKey.toLowerCase();
    const parts = lowerTargetKey.split('+').filter(Boolean);
    const keyToMatch = parts[parts.length - 1];
    const ctrlRequired = parts.includes('control');
    const shiftRequired = parts.includes('shift');
    const altRequired = parts.includes('alt');

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input, unless the key is Escape
      if (
        targetKey !== 'escape' &&
        (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement)
      ) {
        return;
      }

      const { key, ctrlKey, shiftKey, altKey } = event;

      if (
        key.toLowerCase() === keyToMatch &&
        ctrlKey === ctrlRequired &&
        shiftKey === shiftRequired &&
        altKey === altRequired
      ) {
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
