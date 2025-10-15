'use client';

import { useSettings } from '@/context/SettingsContext';
import Layer, { type LayerHandle, type LayerProps } from './layers/Layer';
import { forwardRef, useImperativeHandle, useRef, useState, createRef, useEffect } from 'react';

export type Tool = 'pen' | 'eraser';

interface CanvasProps {
  color: string;
  tool: Tool;
}

export interface CanvasHandle {
  exportImage: () => void;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ color, tool }, ref) => {
  const { settings } = useSettings();
  const { width, height, pixelSize, gridColor, bgColor, guideImage } = settings;

  // レイヤーのデータ構造。LayerPropsにidを追加した形。
  const [layers, setLayers] = useState<(LayerProps)[]>([
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
        color,
        tool,
        pixelSize,
      },
    },
  ]);

  useEffect(() => {
    setLayers(prevLayers =>
      prevLayers.map(layer => {
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
  }, [guideImage]);

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

      // 1. 背景色で塗りつぶす
      context.fillStyle = bgColor;
      context.fillRect(0, 0, width, height);

      // 2. 各レイヤーを描画する
      layers.forEach(layer => {
        layer.componentRef?.current?.drawOn(context);
      });

      // 3. 画像をダウンロードする
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
      {layers.map(layer => (
        <Layer key={layer.id} {...layer} />
      ))}
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
