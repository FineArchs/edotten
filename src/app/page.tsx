'use client';

import { createRef, useEffect, useRef, useState } from 'react';
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
  const { guideImage } = settings;
  const { t } = useLanguage();
  const canvasRef = useRef<CanvasHandle>(null);

  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState<Tool>('pen');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeLayerId, setActiveLayerId] = useState<string>('drawing-1');

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
          zIndex: 0,
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
          zIndex: 1,
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
          isActive: true,
          zIndex: 2,
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
      props: { width, height, visible: true, opacity: 1, color, tool, pixelSize, isActive: false, zIndex: layers.length },
    };
    setLayers(prev => {
      const gridIndex = prev.findIndex(l => l.kind === 'grid');
      const newLayers = [...prev];
      newLayers.splice(gridIndex + 1, 0, newLayer);
      return newLayers;
    });
    setActiveLayerId(newLayer.id);
  };

  const removeLayer = (id: string) => {
    const drawingLayers = layers.filter(l => l.kind === 'drawing');
    if (drawingLayers.length <= 1) {
      alert("You can't delete the last drawing layer."); // TODO: i18n
      return;
    }

    setLayers(prev => prev.filter(l => l.id !== id));

    if (activeLayerId === id) {
      const layerIndex = drawingLayers.findIndex(l => l.id === id);
      const newActiveLayer = drawingLayers[layerIndex - 1] ?? drawingLayers.find(l => l.id !== id);
      if (newActiveLayer) {
        setActiveLayerId(newActiveLayer.id);
      }
    }
  };

  const toggleLayerVisibility = (id: string) => {
    setLayers(prev =>
      prev.map((l): LayerProps => {
        if (l.id !== id) return l;
        switch (l.kind) {
          case 'drawing': return { ...l, props: { ...l.props, visible: !l.props.visible } };
          case 'grid': return { ...l, props: { ...l.props, visible: !l.props.visible } };
          case 'guide': return { ...l, props: { ...l.props, visible: !l.props.visible } };
          default: return l;
        }
      }),
    );
  };

  // --- Effects to sync props into layers state ---
  useEffect(() => {
    setLayers(prev =>
      prev.map((l): LayerProps => {
        if (l.kind !== 'drawing') return l;
        return { ...l, props: { ...l.props, isActive: l.id === activeLayerId } };
      })
    );
  }, [activeLayerId, setLayers]);

  useEffect(() => {
    setLayers(prev =>
      prev.map((l): LayerProps => {
        if (l.kind !== 'guide') return l;
        return { ...l, props: { ...l.props, src: guideImage, visible: guideImage != null } };
      })
    );
  }, [guideImage, setLayers]);

  useEffect(() => {
    setLayers(prev =>
      prev.map((l): LayerProps => {
        if (l.kind !== 'drawing') return l;
        return { ...l, props: { ...l.props, color, tool } };
      })
    );
  }, [color, tool, setLayers]);

  // --- Keyboard Shortcuts ---
  useKeyPress(settings.shortcuts.pen, () => setTool('pen'), !isSettingsOpen);
  useKeyPress(settings.shortcuts.eraser, () => setTool('eraser'), !isSettingsOpen);
  useKeyPress(settings.shortcuts.openSettings, () => setIsSettingsOpen(true), !isSettingsOpen);
  useKeyPress(settings.shortcuts.close, () => setIsSettingsOpen(false), isSettingsOpen);

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
            activeLayerId={activeLayerId}
            onAddLayer={addLayer}
            onRemoveLayer={removeLayer}
            onToggleLayerVisibility={toggleLayerVisibility}
            onSelectLayer={setActiveLayerId}
          />
        </aside>
        <main className="flex-1 flex items-center justify-center p-4 bg-gray-200 overflow-auto">
          <Canvas
            ref={canvasRef}
            layers={layers}
            activeLayerId={activeLayerId}
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