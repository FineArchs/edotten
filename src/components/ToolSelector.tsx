'use client';

import { useLanguage } from '@/context/LanguageContext';

export type Tool = 'pen' | 'eraser';

interface ToolSelectorProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
}

const ToolSelector = ({ activeTool, onToolChange }: ToolSelectorProps) => {
  const { t } = useLanguage();
  const baseClasses = "px-4 py-2 font-semibold rounded-md w-full";
  const activeClasses = "bg-blue-500 text-white";
  const inactiveClasses = "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <div className="p-4 bg-gray-200 rounded-md flex flex-col gap-2 w-full max-w-xs">
       <h2 className="text-lg font-bold border-b border-gray-400 pb-2">{t('tools.title')}</h2>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onToolChange('pen')}
          className={`${baseClasses} ${activeTool === 'pen' ? activeClasses : inactiveClasses}`}
        >
          {t('tools.pen')}
        </button>
        <button
          onClick={() => onToolChange('eraser')}
          className={`${baseClasses} ${activeTool === 'eraser' ? activeClasses : inactiveClasses}`}
        >
          {t('tools.eraser')}
        </button>
      </div>
    </div>
  );
};

export default ToolSelector;
