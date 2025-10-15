'use client';

import { createRef, useRef, useState } from 'react';
import Canvas, { type CanvasHandle, type Tool } from '@/components/Canvas';
import ColorPalette from '@/components/ColorPalette';
import Header from '@/components/Header';
import LayerManager from '@/components/LayerManager';
import type { LayerProps } from '@/components/layers/Layer';
import Modal from '@/components/Modal';
import Settings from '@/components/Settings';
import ToolSelector from '@/components/ToolSelector';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';
import { useKeyPress } from '@/hooks/useKeyPress';

export default function Home() {
  const { settings } = useSettings();
  const { t } = useLanguage();
  const canvasRef = useRef<CanvasHandle>(null);

  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState<Tool>('pen');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- Layers State ---
  const [layers, setLayers] = useState<LayerProps[]>(() => {
    const { width, height, pixelSize, gridColor, guideImage } = settings;
    return [
      {
        id: 'guide-1',
        kind: 'guide',
        componentRef: createRef(),
        props: {
          width,
          height,
          visible: guideImage != null,
          opacity: 0.5,
          src: guideImage,
        },
      },
      {
        id: 'grid-1',
        kind: 'grid',
        componentRef: createRef(),
        props: {
          width,
          height,
          visible: true,
          opacity: 1,
          pixelSize,
          gridColor,
        },
      },
      {
        id: 'drawing-1',
        kind: 'drawing',
        componentRef: createRef(),
        props: {
          width,
          height,
          visible: true,
          opacity: 1,
          color: '#000000',
          tool: 'pen',
          pixelSize,
        },
      },
    ];
  });

  // --- Layer Handlers ---
  const addLayer = () => {
    const { width, height, pixelSize } = settings;
    const newLayer: LayerProps = {
      id: crypto.randomUUID(),
      kind: 'drawing',
      componentRef: createRef(),
      props: { width, height, visible: true, opacity: 1, color, tool, pixelSize },
    };
    // Insert the new layer above the grid layer
    setLayers(prev => {
      const gridIndex = prev.findIndex(l => l.kind === 'grid');
      const newLayers = [...prev];
      newLayers.splice(gridIndex + 1, 0, newLayer);
      return newLayers;
    });
  };

  const removeLayer = (id: string) => {
    // Do not delete the last drawing layer
    if (layers.filter(l => l.kind === 'drawing').length <= 1) {
      alert("You can't delete the last drawing layer."); // TODO: i18n
      return;
    }
    setLayers(prev => prev.filter(l => l.id !== id));
  };

  const toggleLayerVisibility = (id: string) => {
    setLayers(prev =>
      prev.map((l): LayerProps => {
        if (l.id !== id) {
          return l;
        }

        // Reconstruct the layer object safely to preserve the discriminated union type
        switch (l.kind) {
          case 'drawing':
            return {
              ...l,
              props: { ...l.props, visible: !l.props.visible },
            };
          case 'grid':
            return {
              ...l,
              props: { ...l.props, visible: !l.props.visible },
            };
          case 'guide':
            return {
              ...l,
              props: { ...l.props, visible: !l.props.visible },
            };
          default:
            return l;
        }
      }),
    );
  };

  // --- Keyboard Shortcuts ---
  // Tool selection
  useKeyPress(settings.shortcuts.pen, () => setTool('pen'), !isSettingsOpen);
  useKeyPress(
    settings.shortcuts.eraser,
    () => setTool('eraser'),
    !isSettingsOpen,
  );
  // Modal handling
  useKeyPress(
    settings.shortcuts.openSettings,
    () => setIsSettingsOpen(true),
    !isSettingsOpen,
  );
  useKeyPress(
    settings.shortcuts.close,
    () => setIsSettingsOpen(false),
    isSettingsOpen,
  );

  const handleExport = () => {
    canvasRef.current?.exportImage();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <Header
        onExport={handleExport}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-48 flex-shrink-0 bg-white p-4 shadow-lg z-10 flex flex-col gap-6">
          <ToolSelector activeTool={tool} onToolChange={setTool} />
          <ColorPalette onColorChange={setColor} />
          <LayerManager
            layers={layers}
            onAddLayer={addLayer}
            onRemoveLayer={removeLayer}
            onToggleLayerVisibility={toggleLayerVisibility}
          />
        </aside>
        <main className="flex-1 flex items-center justify-center p-4 bg-gray-200 overflow-auto">
          <Canvas
            ref={canvasRef}
            color={color}
            tool={tool}
            layers={layers}
            setLayers={setLayers}
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
