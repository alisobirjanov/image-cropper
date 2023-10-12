import { loadImage, calcCenter, saveAs } from '../utils'

interface ImageData {
  width: number,
  height: number,
  x: number,
  y: number
}

export class Cropper {
  image: HTMLImageElement;
  imageData: ImageData = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };

  wrapperBox = {
    width: 0,
    height: 0,
  };

  cropAspectRatio: number

  constructor(options) {
    this.wrapperBox = options;
  }

  loadImage(url: string) {
    return loadImage(url).then((image) => {
      this.image = image;
      return {
        url,
        ...this.calcCenter(),
      };
    });
  }

  calcCenter() {
    const { width: dw, height: dh } = this.wrapperBox;
    const { width, height } = this.image;

    const aspectRatio = Math.min(width, height) / Math.max(width, height);

    this.cropAspectRatio = 1;

    if (dw > width && dh > height) {
      this.imageData = {
        width,
        height,
        x: calcCenter(dw, width),
        y: calcCenter(dh, height),
      };
      return this.imageData;
    }

    if (width > height) {
      const newW = width > dw ? dw : width;
      if (width > dw) {
        this.cropAspectRatio = dw / width;
      }
        this.imageData = {
          height: newW * aspectRatio,
          width: newW,
          x: calcCenter(dw, newW),
          y: calcCenter(dh, newW * aspectRatio),
        };
      return this.imageData;
    }

    const newH = height > dh ? dh : height;
    if(height > dh) {
      this.cropAspectRatio = dh / height
    }
    this.imageData = {
      height: newH,
      width: newH * aspectRatio,
      y: calcCenter(dh, newH),
      x: calcCenter(dw, newH * aspectRatio),
    };
    return this.imageData;
  }

  savaAs({ width: w, height: h, x, y }) {
    if (!this.image) return;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const { x: a, y: b } = this.imageData;

    canvas.width = w / this.cropAspectRatio;
    canvas.height = h / this.cropAspectRatio;

    const dx = (x - a) / this.cropAspectRatio;
    const dy = (y - b) / this.cropAspectRatio;

    const sw = w / this.cropAspectRatio;
    const sh = h / this.cropAspectRatio;

    context?.drawImage(this.image, dx, dy, sw, sh, 0, 0, sw, sh);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        saveAs(url, 'image.jpg');
      }
    });
  }


  selectImage(accept: string = 'image/*') {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', accept);


    return new Promise((resolve) => {
      input.addEventListener('input', (event: Event) => {
        const blob = (event.target as HTMLInputElement).files
        if (blob) {
          const imageUrl = URL.createObjectURL(blob[0])
          this.loadImage(imageUrl).then(resolve)
        }
      })

      input.click()
    })
  }
}
