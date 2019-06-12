import { AbstractObject } from './AbstractObject';
import { RenderType } from '../types';

export class Viewport extends AbstractObject {
  constructor(width: number, height: number, x: number, y: number) {    
    super(width, height, x, y);
  }
  
  render(): RenderType {
    const path = new Path2D();

    const { x, y } = this.state.position;
    const { width, height } = this.state.dimensions;

    path.rect(x, y, width, height);

    return {
      path,
      method: 'stroke',
      properties: {
        strokeStyle: 'red',
      },
      clear: false,
    };
  }
}