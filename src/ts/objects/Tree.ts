import { AbstractImageObject } from './AbstractImageObject';
import { RenderType } from '../types';

export class Tree extends AbstractImageObject {
  constructor(width: number, height: number, x: number, y: number, index: number, imageUrl: string) {    
    super(width, height, x, y, index, imageUrl);
  }
  
  render(): RenderType {
    const image = new Image(16, 32);
    image.src = this.state.image.url;

    const { x, y } = this.state.position;
    const { width, height } = this.state.dimensions;

    return {
      method: 'image',
      clear: true,
      properties: {
        image: {
          image,
          x,
          y,
          //31, 46
          width: 31,
          height: 46,
        },
      },
    };
  }
}