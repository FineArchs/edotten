'use client';

import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header = ({ onSettingsClick }: HeaderProps) => {
  const { t } = useLanguage();

  return (
    <header className="w-full bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">Edotten</div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <button
          type="button"
          onClick={onSettingsClick}
          className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300"
        >
          {t('header.settings')}
        </button>
      </div>
    </header>
  );
};

export default Header;
