export type LayerCommonProps = {
  width: number;
  height: number;
  visible: boolean;
  opacity: number;
  zIndex: number;
};

export type LayerCommonHandles = {
  drawOn: (context: CanvasRenderingContext2D) => void;
};
