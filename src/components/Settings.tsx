'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { CanvasSettings } from '@/context/SettingsContext';
import { useSettings } from '@/context/SettingsContext';
import { ShortcutInput } from './ShortcutInput';
import LanguageSwitcher from './LanguageSwitcher';

const Settings = () => {
  const { t } = useLanguage();
  const { settings, setSettings } = useSettings();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleShortcutChange = (
    name: keyof CanvasSettings['shortcuts'],
    value: string | null,
  ) => {
    setSettings((prev) => ({
      ...prev,
      shortcuts: {
        ...prev.shortcuts,
        [name]: value,
      },
    }));
  };

  const isShortcutUnique = (newKey: string): boolean => {
    for (const key in settings.shortcuts) {
      if (
        settings.shortcuts[key as keyof typeof settings.shortcuts] === newKey
      ) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-sm flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-3">
        <label className="font-semibold">
          {t('settings.language')}
        </label>
        <div className="flex items-center gap-2">
	<LanguageSwitcher />
        </div>
      </div>

      {/* Canvas Settings */}
      <div className="flex flex-col gap-3">
        <label htmlFor="width" className="font-semibold">
          {t('settings.canvasSize')}
        </label>
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
        <label htmlFor="pixelSize" className="font-semibold">
          {t('settings.pixelSize')}
        </label>
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
        <label htmlFor="gridColor" className="font-semibold">
          {t('settings.gridColor')}
        </label>
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
        <label htmlFor="bgColor" className="font-semibold">
          {t('settings.bgColor')}
        </label>
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
        <h3 className="font-semibold text-lg">
          {t('settings.shortcuts.title')}
        </h3>
        {(
          Object.keys(settings.shortcuts) as (keyof typeof settings.shortcuts)[]
        ).map((key) => (
          <div key={key} className="flex items-center justify-between">
            <label htmlFor={`shortcut-${key}`}>
              {t(`settings.shortcuts.${key}`)}
            </label>
            <ShortcutInput
              value={settings.shortcuts[key]}
              onChange={(value) =>
                handleShortcutChange(
                  key as keyof typeof settings.shortcuts,
                  value,
                )
              }
              onValidate={(newKey) => {
                // When validating, we must allow the key to be set to itself.
                const currentKey =
                  settings.shortcuts[key as keyof typeof settings.shortcuts];
                if (newKey === currentKey) return true;
                return isShortcutUnique(newKey);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
