
export function useMouseOffsetCoords() {
  let clientX = 0;
  let clientY = 0;
  // @ts-ignore
  let moveHanler = (...args: any[]) => {}

  

  const onMouseMove = (event: MouseEvent) => {
    const newX = event.clientX - clientX;
    const newY = event.clientY - clientY;
    moveHanler(newX, newY)
  };

  const onMove = (cb: (x: number, y: number) => any) => {
    moveHanler = cb
  }

  const cleanup = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', cleanup);
  };
  
  const onMouseDown = (event: MouseEvent) => {
    clientX = event.clientX;
    clientY = event.clientY;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', cleanup);
  };

  return [onMouseDown, onMove];
}
