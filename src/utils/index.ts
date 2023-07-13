export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const calcCenter = (a: number, b: number) => {
  return (a - b) / 2;
};

export const saveAs = (url: string, name: string) => {
  let downloadLink = document.createElement('a');
  downloadLink.setAttribute('download', name);
  downloadLink.setAttribute('href', url);
  downloadLink.click();
};
