'use client';

import { useRef, useState } from 'react';
import Canvas, { type CanvasHandle, type Tool } from '@/components/Canvas';
import ColorPalette from '@/components/ColorPalette';
import Header from '@/components/Header';
import Settings from '@/components/Settings';
import ToolSelector from '@/components/ToolSelector';
import { useSettings } from '@/context/SettingsContext';
import { useKeyPress } from '@/hooks/useKeyPress';
import Modal from '@/components/Modal';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { settings } = useSettings();
  const { t } = useLanguage();
  const canvasRef = useRef<CanvasHandle>(null);

  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState<Tool>('pen');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- Keyboard Shortcuts ---
  // Tool selection
  useKeyPress(settings.shortcuts.pen, () => setTool('pen'), !isSettingsOpen);
  useKeyPress(settings.shortcuts.eraser, () => setTool('eraser'), !isSettingsOpen);
  // Modal handling
  useKeyPress(settings.shortcuts.openSettings, () => setIsSettingsOpen(true), !isSettingsOpen);
  useKeyPress(settings.shortcuts.close, () => setIsSettingsOpen(false), isSettingsOpen);

  const handleExport = () => {
    canvasRef.current?.exportImage();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <Header onExport={handleExport} onSettingsClick={() => setIsSettingsOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-48 flex-shrink-0 bg-white p-4 shadow-lg z-10 flex flex-col gap-6">
          <ToolSelector activeTool={tool} onToolChange={setTool} />
          <ColorPalette onColorChange={setColor} />
        </aside>
        <main className="flex-1 flex items-center justify-center p-4 bg-gray-200 overflow-auto">
          <Canvas
            ref={canvasRef}
            color={color}
            tool={tool}
          />
        </main>
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title={t('settings.title')}
      >
        <Settings />
      </Modal>
    </div>
  );
}