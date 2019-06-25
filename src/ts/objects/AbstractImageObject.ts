import { AbstractObject } from './AbstractObject';

export abstract class AbstractImageObject extends AbstractObject {
  state: {
    index: number;
    position: {
      x: number;
      y: number;
    }
    dimensions: {
      width: number;
      height: number;
    }
    image: {
      url: string
    }
  };

  constructor(width: number, height: number, x: number, y: number, index: number, imageUrl: string) {
    super(width, height, x, y, index);

    this.state = {
      index,
      position: {
        x,
        y,
      },
      dimensions: {
        width,
        height,
      },
      image: {
        url: imageUrl,
      }, 
    };
  }

  getImageObject(): HTMLImageElement {
    return new Image();
  }
}
