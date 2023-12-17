export interface drawingInfoType {
  type: string;
  tool: string;
  color: string;
  strokeSize: number;
  position: { x: number; y: number };
}

export interface ImgDataType {
  data?: Uint8ClampedArray;
  colorSpace: PredefinedColorSpace;
  height?: number;
  width?: number;
}

export interface PixelStateType {
  undo: ImgDataType[];
  redo: ImgDataType[];
}
