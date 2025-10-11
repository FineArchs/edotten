'use client';

import { useLanguage } from '@/context/LanguageContext';

const LanguageSwitcher = () => {
  const { locale, setLocale } = useLanguage();

  const baseClasses = "px-3 py-1 text-sm font-semibold rounded-md";
  const activeClasses = "bg-blue-500 text-white";
  const inactiveClasses = "bg-gray-300 text-gray-800 hover:bg-gray-400";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLocale('en')}
        className={`${baseClasses} ${locale === 'en' ? activeClasses : inactiveClasses}`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('ja')}
        className={`${baseClasses} ${locale === 'ja' ? activeClasses : inactiveClasses}`}
      >
        JA
      </button>
    </div>
  );
};

export default LanguageSwitcher;
