import type { RefObject } from 'react';
import DrawingLayer, {
  type DrawingLayerHandle,
  type DrawingLayerProps,
} from './DrawingLayer';
import GridLayer, {
  type GridLayerHandle,
  type GridLayerProps,
} from './GridLayer';
import GuideLayer, {
  type GuideLayerHandle,
  type GuideLayerProps,
} from './GuideLayer';

// すべてのレイヤーハンドルのUnion型
export type LayerHandle =
  | DrawingLayerHandle
  | GuideLayerHandle
  | GridLayerHandle;

// Layerコンポーネントが受け取るPropsの型
export type LayerProps = {
  id: string;
} & (
  | { kind: 'drawing'; props: DrawingLayerProps; componentRef?: RefObject<DrawingLayerHandle | null>; }
  | { kind: 'guide'; props: GuideLayerProps; componentRef?: RefObject<GuideLayerHandle | null>; }
  | { kind: 'grid'; props: GridLayerProps; componentRef?: RefObject<GridLayerHandle | null>; }
);

export default function Layer({ id, kind, props, componentRef }: LayerProps) {
  switch (kind) {
    case 'drawing': {
      return <DrawingLayer {...props}  ref={componentRef} />;
    }
    case 'guide': {
      return <GuideLayer {...props} ref={componentRef} />;
    }
    case 'grid': {
      const { zIndex, ...restProps } = props;
      return <GridLayer {...props} ref={componentRef} />;
    }
  }
}
