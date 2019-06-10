export class BaseObject {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(width: number, height: number, x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  getPosition(): { x: number; y: number } {
    return {
      x: this.x,
      y: this.y,
    };
  }

  getDimensions(): { width: number; height: number } {
    return {
      width: this.width,
      height: this.height,
    };
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;

    return this.getPosition();
  }
}
