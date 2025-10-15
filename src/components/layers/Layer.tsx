import DrawingLayer, {
  type DrawingLayerHandle,
  type DrawingLayerProps,
} from "./DrawingLayer";
import GuideLayer, {
  type GuideLayerHandle,
  type GuideLayerProps,
} from "./GuideLayer";
import GridLayer, {
  type GridLayerHandle,
  type GridLayerProps,
} from "./GridLayer";
import { type Ref, type RefObject } from "react";

// すべてのレイヤーハンドルのUnion型
export type LayerHandle = DrawingLayerHandle | GuideLayerHandle | GridLayerHandle;

// Layerコンポーネントが受け取るPropsの型
export type LayerProps = {
  id: string;
  componentRef?: RefObject<LayerHandle | null>;
} & (
  | { kind: 'drawing', props: DrawingLayerProps }
  | { kind: 'guide', props: GuideLayerProps }
  | { kind: 'grid', props: GridLayerProps }
);

export default function Layer(props: LayerProps) {
	switch (props.kind) {
		case 'drawing':
			return <DrawingLayer {...props.props} ref={props.componentRef} />;
		case 'guide':
			return <GuideLayer {...props.props} ref={props.componentRef} />;
		case 'grid':
			return <GridLayer {...props.props} ref={props.componentRef} />;
	}
}
