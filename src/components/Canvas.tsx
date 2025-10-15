'use client';

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type MouseEvent,
} from 'react';
import { useSettings } from '@/context/SettingsContext';
import Layer, { type LayerProps } from './layers/Layer';
import type { DrawingLayerHandle } from './layers/DrawingLayer';

export type Tool = 'pen' | 'eraser';

interface CanvasProps {
  layers: LayerProps[];
  activeLayerId: string;
}

export interface CanvasHandle {
  exportImage: () => void;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(
  ({ layers, activeLayerId }, ref) => {
    const { settings } = useSettings();
    const { width, height, pixelSize, bgColor } = settings;
    const [isDrawing, setIsDrawing] = useState(false);
    const interactionCanvasRef = useRef<HTMLCanvasElement>(null);

    const getMousePos = (e: MouseEvent) => {
      const rect = interactionCanvasRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: Math.floor((e.clientX - rect.left) / pixelSize),
        y: Math.floor((e.clientY - rect.top) / pixelSize),
      };
    };

    const drawOnActiveLayer = (x: number, y: number) => {
      const activeLayer = layers.find(
        (l) => l.id === activeLayerId && l.kind === 'drawing',
      );
      if (activeLayer) {
        const handle = activeLayer.componentRef?.current as DrawingLayerHandle;
        handle?.draw(x * pixelSize, y * pixelSize);
      }
    };

    const startDrawing = (e: MouseEvent) => {
      setIsDrawing(true);
      const { x, y } = getMousePos(e);
      drawOnActiveLayer(x, y);
    };

    const moveDrawing = (e: MouseEvent) => {
      if (!isDrawing) return;
      const { x, y } = getMousePos(e);
      drawOnActiveLayer(x, y);
    };

    const stopDrawing = () => {
      setIsDrawing(false);
    };

    useImperativeHandle(ref, () => ({
      exportImage() {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');

        if (!context) {
          alert('キャンバスのコンテキストが取得できませんでした。');
          return;
        }

        context.fillStyle = bgColor;
        context.fillRect(0, 0, width, height);

        layers.forEach((layer) => {
          layer.componentRef?.current?.drawOn(context);
        });

        const link = document.createElement('a');
        link.download = 'edotten-artwork.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      },
    }));

    return (
      <div
        style={{
          position: 'relative',
          width,
          height,
          backgroundColor: bgColor,
        }}
      >
        {layers.map((layer, index) => {
          let layerWithZIndex: LayerProps;
          switch (layer.kind) {
            case 'drawing':
              layerWithZIndex = {
                ...layer,
                props: { ...layer.props, zIndex: index },
              };
              break;
            case 'guide':
              layerWithZIndex = {
                ...layer,
                props: { ...layer.props, zIndex: index },
              };
              break;
            case 'grid':
              layerWithZIndex = {
                ...layer,
                props: { ...layer.props, zIndex: index },
              };
              break;
            default:
              layerWithZIndex = layer; // Should not happen
          }
          return <Layer key={layer.id} {...layerWithZIndex} />;
        })}

        {/*
          This canvas is for capturing mouse events.
          Using a canvas instead of a div allows for potential future extensions,
          such as drawing custom cursor previews (e.g., pen size).
        */}
        <canvas
          ref={interactionCanvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={moveDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            cursor: 'crosshair',
            zIndex: layers.length, // Always on top
          }}
        />
      </div>
    );
  },
);

Canvas.displayName = 'Canvas';

export default Canvas;