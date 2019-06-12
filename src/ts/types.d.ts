import {AbstractObject} from './objects/AbstractObject';
import { Tree } from './objects/Tree';
import { Tile } from './objects/Tile';
import { Viewport } from './objects/Viewport';

export type ObjectTypes = Tree | Tile | Viewport;

export interface RenderType {
    path: Path2D;
    method: 'stroke' | 'fill';
    properties: {
      strokeStyle?: string
      fillStyle?: string
    };
    clear: boolean;
  }