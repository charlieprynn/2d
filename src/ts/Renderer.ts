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

  clear(x: number, y: number, width: number, height: number): void {
    this.state.ctx.clearRect(
      x,
      y,
      width,
      height
    );
  }

  draw(render: RenderType): void {
    this.state.ctx[render.method](render.path);
  }

  render(object: ObjectTypes): void {
    const {x, y} = object.getPosition();
    const {width, height} = object.getDimensions();

    const render: RenderType = object.render();

    this.clear(x, y, width, height);
    this.draw(render);
  }

  renderObjects(objects: ObjectTypes[]) {
    objects.forEach((object) => {
      this.render(object);
    });
  }
}
