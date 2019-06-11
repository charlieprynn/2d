import {AbstractObject} from './objects/AbstractObject';
import { Tree } from './objects/Tree';

export type ObjectTypes = Tree;

export interface RenderType {
    path: Path2D;
    method: 'stroke' | 'fill';
  }