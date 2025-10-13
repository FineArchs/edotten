import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface ShortcutInputProps {
  value: string | null;
  onChange: (key: string | null) => void;
  onValidate: (key: string) => boolean;
}

const formatShortcut = (key: string | null): string => {
  if (!key) return '';
  return key
    .split('+')
    .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
    .join(' + ');
};

export const ShortcutInput = ({
  value,
  onChange,
  onValidate,
}: ShortcutInputProps) => {
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isRecording) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const isModifier = ['Control', 'Shift', 'Alt', 'Meta'].includes(e.key);
      if (isModifier) return;

      const parts: string[] = [];
      if (e.ctrlKey) parts.push('control');
      if (e.shiftKey) parts.push('shift');
      if (e.altKey) parts.push('alt');
      parts.push(e.key.toLowerCase());

      const newKey = parts.join('+');

      if (!onValidate(newKey)) {
        setError(t('settings.shortcuts.errorInUse'));
        setTimeout(() => setError(null), 1500);
        return;
      }

      onChange(newKey);
      setIsRecording(false);
      setError(null);
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [isRecording, onChange, onValidate, t]);

  useEffect(() => {
    if (!isRecording && buttonRef.current) {
      buttonRef.current.blur();
    }
  }, [isRecording]);

  const getButtonText = () => {
    if (error) return error;
    if (isRecording) return t('settings.shortcuts.recording');
    return formatShortcut(value) || t('settings.shortcuts.notSet');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsRecording(!isRecording)}
        className={`w-36 p-1 border rounded-md text-center font-mono transition-colors ${
          isRecording
            ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-300'
            : 'bg-white border-gray-300'
        } ${error ? 'border-red-500 text-red-500' : ''}`}
      >
        {getButtonText()}
      </button>
      <button
        type="button"
        onClick={() => onChange(null)}
        className="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        aria-label="Clear shortcut"
      >
        {t('settings.shortcuts.clear')}
      </button>
    </div>
  );
};
