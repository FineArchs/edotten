'use client';

import { type Ref, useImperativeHandle } from 'react';
import type { LayerCommonProps } from './common';

export type GuideLayerProps = LayerCommonProps & {
  src?: string | null;
  ref?: Ref<GuideLayerHandle>;
};

export interface GuideLayerHandle {
  drawOn: (context: CanvasRenderingContext2D) => void;
}

function GuideLayer({
  width,
  height,
  visible,
  opacity,
  src,
  zIndex,
  ref,
}: GuideLayerProps) {
  useImperativeHandle(ref, () => ({
    drawOn() {
      // 何もしない（エクスポートに含めないため）
    },
  }));

  if (!src) return null;

  return (
    <img
      src={src}
      alt="Guide Layer"
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: visible ? opacity : 0,
        pointerEvents: 'none',
        zIndex: zIndex,
        imageRendering: 'pixelated',
      }}
    />
  );
}

export default GuideLayer;