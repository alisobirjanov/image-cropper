import { RisizeHandles, Meta } from './types';

const checkSize = (limit: number, newSize: number): number => {
  if (limit < newSize) {
    return limit;
  }
  if (newSize < 0) {
    return 0;
  }
  return newSize;
};

const checkSizeAndPositionLimits = (
  limit: number,
  offsetPos: number,
  startPos: number,
  size: number
): number[] => {
  const newSize = offsetPos * -1 + size;
  if (limit < newSize) {
    return [limit, 0];
  } else if (newSize < 0) {
    return [0, startPos + size];
  }
  return [newSize, startPos + offsetPos];
};

export const risizeHandles: RisizeHandles[] = [
  {
    type: 'tl',
    fn: (meta) => {
      const { deltaX, deltaY, width, height, limits, x, y } = meta;
      const { maxWidth, maxHeight } = limits;

      const [newWidth, newX] = checkSizeAndPositionLimits(
        maxWidth.left,
        deltaX,
        x,
        width
      );
      const [newHeight, newY] = checkSizeAndPositionLimits(
        maxHeight.top,
        deltaY,
        y,
        height
      );
      return {
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
      };
    },
  },
  {
    type: 'mt',
    fn: (meta) => {
      const { deltaY, height, limits, y } = meta;
      const { maxHeight } = limits;

      const [newHeight, newY] = checkSizeAndPositionLimits(
        maxHeight.top,
        deltaY,
        y,
        height
      );
      return {
        height: newHeight,
        y: newY,
      };
    },
  },
  {
    type: 'tr',
    fn: (meta) => {
      const { deltaX, deltaY, width, height, limits, y } = meta;
      const { maxWidth, maxHeight } = limits;

      const newWidth = checkSize(maxWidth.right, deltaX + width);

      const [newHeight, newY] = checkSizeAndPositionLimits(
        maxHeight.top,
        deltaY,
        y,
        height
      );

      return {
        width: newWidth,
        height: newHeight,
        y: newY,
      };
    },
  },
  {
    type: 'mr',
    fn: (meta) => {
      const { deltaX, width, limits } = meta;
      const { maxWidth } = limits;

      const newWidth = checkSize(maxWidth.right, width + deltaX);

      return {
        width: newWidth,
      };
    },
  },
  {
    type: 'br',
    fn: (meta) => {
      const { deltaX, deltaY, width, height, limits } = meta;
      const { maxWidth, maxHeight } = limits;

      const newWidth = checkSize(maxWidth.right, width + deltaX);
      const newHeight = checkSize(maxHeight.bottom, height + deltaY);
      return {
        width: newWidth,
        height: newHeight,
      };
    },
  },
  {
    type: 'mb',
    fn: (meta) => {
      const { deltaY, height, limits } = meta;
      const { maxHeight } = limits;

      const newHeight = checkSize(maxHeight.bottom, height + deltaY);

      return {
        height: newHeight,
      };
    },
  },
  {
    type: 'bl',
    fn: (meta) => {
      const { deltaX, deltaY, width, height, limits, x } = meta;
      const { maxWidth, maxHeight } = limits;

      const newHeight = checkSize(maxHeight.bottom, deltaY + height);

      const [newWidth, newX] = checkSizeAndPositionLimits(
        maxWidth.left,
        deltaX,
        x,
        width
      );
      return {
        width: newWidth,
        height: newHeight,
        x: newX,
      };
    },
  },
  {
    type: 'ml',
    fn: (meta) => {
      const { deltaX, width, limits, x } = meta;
      const { maxWidth } = limits;

      const [newWidth, newX] = checkSizeAndPositionLimits(
        maxWidth.left,
        deltaX,
        x,
        width
      );
      return {
        width: newWidth,
        x: newX,
      };
    },
  },
];

export function dragHandle(meta: Meta) {
  const { deltaX, deltaY, limits, x, y } = meta;

  let newX = deltaX + x;
  let newY = deltaY + y;

  if (newY > limits.bottom) {
    newY = limits.bottom;
  } else if (newY < limits.top) {
    newY = limits.top;
  }

  if (newX > limits.right) {
    newX = limits.right;
  } else if (newX < limits.left) {
    newX = limits.left;
  }

  return {
    x: newX,
    y: newY,
  };
}
