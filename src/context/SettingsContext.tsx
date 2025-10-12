'use client';

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from 'react';

// Centralized type definition for canvas settings
export interface CanvasSettings {
  width: number;
  height: number;
  pixelSize: number;
  gridColor: string;
  bgColor: string;
  shortcuts: {
    pen: string | null;
    eraser: string | null;
    settings: string | null;
    close: string | null;
  };
}

// Type for the context value, allowing functional updates for setSettings
interface SettingsContextType {
  settings: CanvasSettings;
  setSettings: Dispatch<SetStateAction<CanvasSettings>>;
}

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

// Initial default settings
const initialSettings: CanvasSettings = {
  width: 512,
  height: 512,
  pixelSize: 16,
  gridColor: '#F0F0F0',
  bgColor: '#FFFFFF',
  shortcuts: {
    pen: 'p',
    eraser: 'e',
    settings: ',',
    close: 'Escape',
  },
};

// Provider component
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<CanvasSettings>(initialSettings);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the settings context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
