'use client';

import { useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';

interface HeaderProps {
  onExport: () => void;
  onSettingsClick: () => void;
}

const Header = ({ onExport, onSettingsClick }: HeaderProps) => {
  const { setSettings } = useSettings();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSettings((prev) => ({ ...prev, guideImage: dataUrl }));
    };
    reader.readAsDataURL(file);

    // Reset file input
    e.target.value = '';
  };

  return (
    <header className="flex items-center justify-between p-2 bg-white shadow-md z-20">
      <h1 className="text-xl font-bold text-gray-800">Edotten</h1>
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/gif"
        />
        <button
          onClick={handleImportClick}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          {t('header.import')}
        </button>
        <button
          onClick={onExport}
          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {t('header.export')}
        </button>
        <button
          onClick={onSettingsClick}
          className="p-2 rounded-md hover:bg-gray-200"
          aria-label="Open Settings"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
};

export default Header;
