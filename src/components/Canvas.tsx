'use client';

import { useEffect, useRef, useState } from 'react';
import type { Tool } from './ToolSelector';

interface CanvasProps {
  color: string;
  width: number;
  height: number;
  pixelSize: number;
  gridColor: string;
  bgColor: string;
  tool: Tool;
}

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pixelSize: number,
  gridColor: string,
) => {
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 0.5;

  for (let x = 0; x <= width; x += pixelSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += pixelSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

const Canvas = ({
  color,
  width,
  height,
  pixelSize,
  gridColor,
  bgColor,
  tool,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const lastPixel = useRef<{ x: number; y: number } | null>(null);

  // Effect for initialization and re-drawing on settings change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set fill style for background
        ctx.fillStyle = bgColor;
        // Clear canvas with background color
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        drawGrid(ctx, width, height, pixelSize, gridColor);

        setContext(ctx);
      }
    }
  }, [width, height, pixelSize, gridColor, bgColor]);

  // Update fillStyle when color or tool changes
  useEffect(() => {
    if (context) {
      context.fillStyle = tool === 'eraser' ? bgColor : color;
    }
  }, [context, tool, color, bgColor]);

  const drawPixel = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;

    const gridX = Math.floor(event.nativeEvent.offsetX / pixelSize);
    const gridY = Math.floor(event.nativeEvent.offsetY / pixelSize);

    if (
      lastPixel.current &&
      lastPixel.current.x === gridX &&
      lastPixel.current.y === gridY
    ) {
      return;
    }

    // The fillStyle is already set by the useEffect hook
    context.fillRect(
      gridX * pixelSize,
      gridY * pixelSize,
      pixelSize,
      pixelSize,
    );
    lastPixel.current = { x: gridX, y: gridY };
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    drawPixel(event);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      drawPixel(event);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPixel.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      className="border border-gray-400 cursor-crosshair"
    />
  );
};

export default Canvas;
