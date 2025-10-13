'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useSettings } from '@/context/SettingsContext';

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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Expose export function to parent component
  useImperativeHandle(ref, () => ({
    exportImage() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const link = document.createElement('a');
      link.download = 'edotten-artwork.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    },
  }));

  // Redraw canvas when settings change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw guide image if it exists
    if (guideImage) {
      const image = new Image();
      image.onload = () => {
        ctx.globalAlpha = 0.5; // Make guide semi-transparent
        ctx.drawImage(image, 0, 0, width, height);
        ctx.globalAlpha = 1.0; // Reset alpha
        drawGrid(ctx);
      };
      image.src = guideImage;
    } else {
      // Draw background color
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      drawGrid(ctx);
    }

    function drawGrid(context: CanvasRenderingContext2D) {
      context.strokeStyle = gridColor;
      context.lineWidth = 1;
      for (let x = 0; x < width; x += pixelSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 0; y < height; y += pixelSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }
    }
  }, [width, height, pixelSize, gridColor, bgColor, guideImage]);

  const getMousePos = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 }; // Fallback if canvasRef.current is null
    return {
      x: Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize,
      y: Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize,
    };
  };

  const draw = (x: number, y: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return; // Return if context is not available
    if (tool === 'pen') {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    } else if (tool === 'eraser') {
      // Redraw the background/grid over the cell
      ctx.fillStyle = bgColor;
      ctx.fillRect(x, y, pixelSize, pixelSize);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, pixelSize, pixelSize);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const { x, y } = getMousePos(e);
    draw(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const { x, y } = getMousePos(e);
    draw(x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className="bg-white shadow-lg cursor-crosshair"
    />
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
