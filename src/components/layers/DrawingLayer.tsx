'use client';

import { type Ref, useImperativeHandle, useRef, useState } from 'react';
import type { Tool } from '../Canvas';
import type { LayerCommonProps } from './common';

export type DrawingLayerProps = LayerCommonProps & {
  color: string;
  tool: Tool;
  pixelSize: number;
  ref?: Ref<DrawingLayerHandle>;
};

export interface DrawingLayerHandle {
  drawOn: (context: CanvasRenderingContext2D) => void;
}

function DrawingLayer({
  visible,
  opacity,
  width,
  height,
  color,
  tool,
  pixelSize,
  ref,
}: DrawingLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useImperativeHandle(ref, () => ({
    drawOn(context) {
      if (canvasRef.current) {
        context.drawImage(canvasRef.current, 0, 0);
      }
    },
  }));

  const getMousePos = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize,
      y: Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize,
    };
  };

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

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const { x, y } = getMousePos(e);
    draw(x, y);
  };
  const moveDrawing = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const { x, y } = getMousePos(e);
    draw(x, y);
  };
  const stopDrawing = () => setIsDrawing(false);

  return (
    <canvas
      ref={canvasRef}
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
        opacity: visible ? opacity : 0,
        cursor: 'crosshair',
        zIndex: 3,
      }}
    />
  );
}

export default DrawingLayer;
