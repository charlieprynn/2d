import { AbstractObject } from './AbstractObject';
import { RenderType } from '../types';

export class Tile extends AbstractObject {
  colour: string;
  constructor(width: number, height: number, x: number, y: number, index: number) {    
    super(width, height, x, y, index);

    this.colour = '#' + Math.floor(Math.random()*16777215).toString(16);
  }
  
  render(): RenderType {
    const path = new Path2D();

    const { x, y } = this.state.position;
    const { width, height } = this.state.dimensions;

    path.rect(x, y, width, height);

    return {
      method: 'path',
      clear: true,
      properties: {
        path,
        pathMethod:  'fill',
        color: '#E3E3E3',
      },
    };
  }
}