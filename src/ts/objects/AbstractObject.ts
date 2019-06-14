import { RenderType } from '../types';

export abstract class AbstractObject {
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
  };

  constructor(width: number, height: number, x: number, y: number, index: number) {
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
   };
  }

  abstract render(): RenderType;

  getPosition(): { x: number; y: number } {
    return this.state.position;
  }

   getDimensions(): { width: number; height: number } {
    return this.state.dimensions;
  }

  setPosition(x: number, y: number) {
    this.state.position.x = x;
    this.state.position.y = y;

    return this.getPosition();
  }
}
