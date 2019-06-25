import {AbstractObject} from './objects/AbstractObject';
import { Tree } from './objects/Tree';
import { Tile } from './objects/Tile';
import { Viewport } from './objects/Viewport';

export type ObjectTypes = Tree | Tile | Viewport;

export interface RenderType {
  method?: 'path' | 'image';
  clear: boolean;
  properties: {
    image?: {
      image: HTMLImageElement,
      x: number,
      y: number,
      width: number,
      height: number
    };
    path?: Path2D;
    pathMethod?: 'stroke' | 'fill'
    color?: string
  }
}