import { ObjectTypes, RenderType } from './types';

export class Renderer {
  state: {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D;
  };

  constructor(canvas: HTMLCanvasElement) {
    this.state = {
      canvas,
      width: canvas.width,
      height: canvas.height,
      ctx: canvas.getContext('2d') as CanvasRenderingContext2D,
    };
  }

  clear(): void {
    this.state.ctx.clearRect(
      0,
      0,
      this.state.canvas.width,
      this.state.canvas.width
    );
  }

  render(object: ObjectTypes): void {
    const render: RenderType = object.render();

    this.state.ctx[render.method](render.path);
  }

  renderObjects(objects: ObjectTypes[]) {
    objects.forEach((object) => {
      this.render(object);
    });
  }
}
