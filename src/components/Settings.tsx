'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';
import type { CanvasSettings } from '@/context/SettingsContext';

const Settings = () => {
  const { t } = useLanguage();
  const { settings, setSettings } = useSettings();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleShortcutChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const key = e.key;
    const name = e.currentTarget.name;

    setSettings(prev => ({
      ...prev,
      shortcuts: {
        ...prev.shortcuts,
        [name]: key,
      }
    }));
  };

  const handleShortcutDelete = (name: keyof CanvasSettings['shortcuts']) => {
    setSettings(prev => ({
      ...prev,
      shortcuts: {
        ...prev.shortcuts,
        [name]: null,
      }
    }));
  };

  return (
    <div className="p-4 bg-gray-200 rounded-md flex flex-col gap-4 w-full max-w-xs">
      <h2 className="text-lg font-bold border-b border-gray-400 pb-2">{t('settings.title')}</h2>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="width" className="font-semibold">{t('settings.canvasSize')}</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            id="width"
            name="width"
            value={settings.width}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-md"
            step="16"
          />
          <span className="text-gray-600">x</span>
          <input
            type="number"
            id="height"
            name="height"
            value={settings.height}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-md"
            step="16"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="pixelSize" className="font-semibold">{t('settings.pixelSize')}</label>
        <input
          type="number"
          id="pixelSize"
          name="pixelSize"
          value={settings.pixelSize}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded-md"
          min="1"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="gridColor" className="font-semibold">{t('settings.gridColor')}</label>
        <input
          type="color"
          id="gridColor"
          name="gridColor"
          value={settings.gridColor}
          onChange={handleChange}
          className="w-full h-8 p-0 border-none rounded-md cursor-pointer"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="bgColor" className="font-semibold">{t('settings.bgColor')}</label>
        <input
          type="color"
          id="bgColor"
          name="bgColor"
          value={settings.bgColor}
          onChange={handleChange}
          className="w-full h-8 p-0 border-none rounded-md cursor-pointer"
        />
      </div>

      {/* Shortcut Settings */}
      <div className="flex flex-col gap-3 pt-4 border-t border-gray-300">
        <h3 className="font-semibold text-lg">{t('settings.shortcuts.title')}</h3>
        <div className="flex items-center justify-between">
          <label>{t('settings.shortcuts.pen')}</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="pen"
              value={settings.shortcuts.pen || ''}
              onKeyDown={handleShortcutChange}
              className="w-24 p-1 border border-gray-300 rounded-md text-center font-mono"
              readOnly
            />
            <button
              onClick={() => handleShortcutDelete('pen')}
              className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              aria-label="Delete shortcut for Pen Tool"
            >
              ❌
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label>{t('settings.shortcuts.eraser')}</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="eraser"
              value={settings.shortcuts.eraser || ''}
              onKeyDown={handleShortcutChange}
              className="w-24 p-1 border border-gray-300 rounded-md text-center font-mono"
              readOnly
            />
            <button
              onClick={() => handleShortcutDelete('eraser')}
              className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              aria-label="Delete shortcut for Eraser Tool"
            >
              ❌
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label>{t('settings.shortcuts.openSettings')}</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="settings"
              value={settings.shortcuts.settings || ''}
              onKeyDown={handleShortcutChange}
              className="w-24 p-1 border border-gray-300 rounded-md text-center font-mono"
              readOnly
            />
            <button
              onClick={() => handleShortcutDelete('settings')}
              className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              aria-label="Delete shortcut for Open Settings"
            >
              ❌
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label>{t('settings.shortcuts.close')}</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="close"
              value={settings.shortcuts.close || ''}
              onKeyDown={handleShortcutChange}
              className="w-24 p-1 border border-gray-300 rounded-md text-center font-mono"
              readOnly
            />
            <button
              onClick={() => handleShortcutDelete('close')}
              className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              aria-label="Delete shortcut for Close/Escape"
            >
              ❌
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
