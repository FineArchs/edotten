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

  // ▼ ２つのキャンバス参照
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const guideCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // ===== エクスポート処理 =====
  useImperativeHandle(ref, () => ({
    exportImage() {
      const drawing = drawingCanvasRef.current;
      const guide = guideCanvasRef.current;
      if (!drawing || !guide) return;

      const link = document.createElement('a');
      link.download = 'edotten-artwork.png';
      link.href = drawing.toDataURL('image/png');
      link.click();
    },
  }));

  // ===== ガイドレイヤー描画 =====
  useEffect(() => {
    const guideCanvas = guideCanvasRef.current;
    if (!guideCanvas) return;
    const ctx = guideCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // 背景色
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // ガイド画像
    if (guideImage) {
      const image = new Image();
      image.onload = () => {
        ctx.globalAlpha = 0.5;
        ctx.drawImage(image, 0, 0, width, height);
        ctx.globalAlpha = 1.0;
        drawGrid(ctx);
      };
      image.src = guideImage;
    } else {
      drawGrid(ctx);
    }

    function drawGrid(context: CanvasRenderingContext2D) {
      context.strokeStyle = gridColor;
      context.lineWidth = 1;
      for (let x = 0; x < width; x += pixelSize) {
        context.beginPath();
        context.moveTo(x + 0.5, 0);
        context.lineTo(x + 0.5, height);
        context.stroke();
      }
      for (let y = 0; y < height; y += pixelSize) {
        context.beginPath();
        context.moveTo(0, y + 0.5);
        context.lineTo(width, y + 0.5);
        context.stroke();
      }
    }
  }, [width, height, pixelSize, gridColor, bgColor, guideImage]);

  // ===== ペイントレイヤー処理 =====
  const getMousePos = (e: React.MouseEvent) => {
    const rect = drawingCanvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize,
      y: Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize,
    };
  };

  const draw = (x: number, y: number) => {
    const ctx = drawingCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    if (tool === 'pen') {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    } else if (tool === 'eraser') {
      ctx.clearRect(x, y, pixelSize, pixelSize);
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
  const stopDrawing = () => setIsDrawing(false);

  // ===== JSX =====
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
      }}
    >
      {/* ガイドレイヤー（下） */}
      <canvas
        ref={guideCanvasRef}
        width={width}
        height={height}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 0,
        }}
      />

      {/* 描画レイヤー（上） */}
      <canvas
        ref={drawingCanvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="bg-transparent cursor-crosshair"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 1,
        }}
      />
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
