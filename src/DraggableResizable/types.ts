export type Handle = 'tl' | 'mt' | 'tr' | 'mr' | 'br' | 'mb' | 'bl' | 'ml';

interface Limits {
  maxWidth: {
    left: number;
    right: number;
  };
  maxHeight: {
    top: number;
    bottom: number;
  };
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface Meta {
  deltaX: number;
  deltaY: number;
  width: number;
  height: number;
  limits: Limits;
  x: number;
  y: number;
}


export interface RisizeHandles {
  type: Handle;
  fn: (meta: Meta) => any;
}