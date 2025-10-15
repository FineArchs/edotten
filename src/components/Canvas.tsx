'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useSettings } from '@/context/SettingsContext';
import Layer, { type LayerProps } from './layers/Layer';

export type Tool = 'pen' | 'eraser';

interface CanvasProps {
  color: string;
  tool: Tool;
  layers: LayerProps[];
  setLayers: Dispatch<SetStateAction<LayerProps[]>>;
}

export interface CanvasHandle {
  exportImage: () => void;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(
  ({ color, tool, layers, setLayers }, ref) => {
    const { settings } = useSettings();
    const { width, height, pixelSize, gridColor, bgColor, guideImage } = settings;

    // Effect to update guide image layer
    useEffect(() => {
      setLayers((prevLayers) =>
        prevLayers.map((layer) => {
          if (layer.kind === 'guide') {
            return {
              ...layer,
              props: {
                ...layer.props,
                src: guideImage,
                visible: guideImage != null,
              },
            };
          }
          return layer;
        }),
      );
    }, [guideImage, setLayers]);

    // Effect to update drawing layers with current tool and color
    useEffect(() => {
      setLayers((prevLayers) =>
        prevLayers.map((layer) => {
          if (layer.kind === 'drawing') {
            return {
              ...layer,
              props: {
                ...layer.props,
                color,
                tool,
              },
            };
          }
          return layer;
        }),
      );
    }, [color, tool, setLayers]);

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

        // 1. Fill background
        context.fillStyle = bgColor;
        context.fillRect(0, 0, width, height);

        // 2. Draw each layer
        layers.forEach((layer) => {
          layer.componentRef?.current?.drawOn(context);
        });

        // 3. Download image
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
        {layers.map((layer) => (
          <Layer key={layer.id} {...layer} />
        ))}
      </div>
    );
  },
);

Canvas.displayName = 'Canvas';

export default Canvas;