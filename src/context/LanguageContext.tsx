'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

// Type for the translation object
interface Translations {
  header: {
    settings: string;
  };
  tools: {
    title: string;
    pen: string;
    eraser: string;
  };
  settings: {
    title: string;
    canvasSize: string;
    pixelSize: string;
    gridColor: string;
    bgColor: string;
    shortcuts: {
      title: string;
      pen: string;
      eraser: string;
      openSettings: string;
      close: string;
    };
    apply: string;
  };
}

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

type DotNestedKeys<T> = (
  T extends object
    ? {
        [K in Exclude<
          keyof T,
          symbol
        >]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
      }[Exclude<keyof T, symbol>]
    : ''
) extends infer D
  ? Extract<D, string>
  : never;

export type TranslationKey = DotNestedKeys<Translations>;

// Type for the translation function
type TFunction = (key: TranslationKey) => string;

// Type for the context value
interface LanguageContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: TFunction;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Helper function to get nested values from an object using dot notation
const getNestedValue = (obj: Translations, key: TranslationKey): string => {
  return key.split('.').reduce((acc, part) => acc?.[part], obj as any) || key;
};

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState('en');
  const [translations, setTranslations] = useState<Translations | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`/locales/${locale}.json`);
        if (!response.ok) {
          console.error(`Could not load locale: ${locale}`);
          return;
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to fetch translations:', error);
      }
    };

    fetchTranslations();
  }, [locale]);

  const t = useCallback(
    (key: TranslationKey) => {
      if (!translations) return key;
      return getNestedValue(translations, key);
    },
    [translations],
  );

  const value = { locale, setLocale, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
