import { AbstractObject } from './AbstractObject';
import { RenderType } from '../types';

export class Tree extends AbstractObject {
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
      method: Math.random() < 0.5 ? 'fill' : 'stroke',
    };
  }

  updatePosition() {
    const x = Math.floor((Math.random() * 100) + 1);
    const y = Math.floor((Math.random() * 100) + 1);

    this.setPosition(x, y);
  }
}