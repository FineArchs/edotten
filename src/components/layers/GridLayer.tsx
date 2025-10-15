'use client';

import { useEffect, useImperativeHandle, useRef, type Ref } from 'react';
import type { LayerCommonProps } from './common';

export type GridLayerProps = LayerCommonProps & {
  pixelSize: number;
  gridColor: string;
  ref?: Ref<GridLayerHandle>;
};

export interface GridLayerHandle {
  drawOn: (context: CanvasRenderingContext2D) => void;
}

function GridLayer(
  { width, height, visible, opacity, pixelSize, gridColor, ref }: GridLayerProps,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    drawOn() {
      // 何もしない（エクスポートに含めないため）
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
      ctx.stroke();
    }
  }, [width, height, pixelSize, gridColor]);

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
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  );
}

export default GridLayer;
