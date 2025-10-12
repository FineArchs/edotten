'use client';

import { LanguageProvider } from '@/context/LanguageContext';
import { SettingsProvider } from '@/context/SettingsContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </SettingsProvider>
  );
}
