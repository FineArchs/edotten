'use client';

import { useState } from 'react';
import Canvas from '@/components/Canvas';
import ColorPalette from '@/components/ColorPalette';
import Settings from '@/components/Settings';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import ToolSelector, { Tool } from '@/components/ToolSelector';
import { useKeyPress } from '@/hooks/useKeyPress';
import { useSettings } from '@/context/SettingsContext';

export default function Home() {
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState<Tool>('pen');
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const { settings, setSettings } = useSettings(); // Get from context

  // Setup shortcuts using the custom hook
  useKeyPress(settings.shortcuts.pen, () => setTool('pen'), !isSettingsOpen);
  useKeyPress(settings.shortcuts.eraser, () => setTool('eraser'), !isSettingsOpen);
  useKeyPress(settings.shortcuts.settings, () => setSettingsOpen(true), !isSettingsOpen);
  useKeyPress(settings.shortcuts.close, () => setSettingsOpen(false), isSettingsOpen);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header onSettingsClick={() => setSettingsOpen(true)} />

      <main className="flex flex-grow w-full items-start justify-center p-8 gap-8">
        <div className="flex flex-col gap-8">
          <ToolSelector activeTool={tool} onToolChange={setTool} />
          <ColorPalette onColorChange={setColor} />
        </div>
        <Canvas
          color={color}
          width={settings.width}
          height={settings.height}
          pixelSize={settings.pixelSize}
          gridColor={settings.gridColor}
          bgColor={settings.bgColor}
          tool={tool}
        />
      </main>

      <Modal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)}>
        <Settings /> {/* No props needed here */}
      </Modal>
    </div>
  );
}
