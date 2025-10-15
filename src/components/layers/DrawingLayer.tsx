'use client';

import { type Ref, useImperativeHandle, useRef } from 'react';
import type { Tool } from '../Canvas';
import type { LayerCommonProps, LayerCommonHandles } from './common';

export type DrawingLayerProps = LayerCommonProps & {
  color: string;
  tool: Tool;
  pixelSize: number;
  isActive: boolean; // Kept for type consistency, but not used for event handling here
  ref?: Ref<DrawingLayerHandle>;
};

export type DrawingLayerHandle = LayerCommonHandles & {
  draw: (x: number, y: number) => void;
}

function DrawingLayer({
  visible,
  opacity,
  width,
  height,
  color,
  tool,
  pixelSize,
  zIndex,
  ref,
}: DrawingLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (x: number, y: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    if (tool === 'pen') {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    } else if (tool === 'eraser') {
      ctx.clearRect(x, y, pixelSize, pixelSize);
    }
  };

  useImperativeHandle(ref, () => ({
    drawOn(context) {
      if (canvasRef.current) {
        context.drawImage(canvasRef.current, 0, 0);
      }
    },
    draw(x, y) {
      draw(x, y);
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: visible ? opacity : 0,
        pointerEvents: 'none', // This layer should not capture mouse events
        zIndex: zIndex,
      }}
    />
  );
}

export default DrawingLayer;
