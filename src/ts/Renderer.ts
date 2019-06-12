import { ObjectTypes, RenderType } from './types';

export class Renderer {
  state: {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    x: number;
    y: number;
    ctx: CanvasRenderingContext2D;
  };

  constructor(canvas: HTMLCanvasElement) {
    this.state = {
      canvas,
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
      ctx: canvas.getContext('2d') as CanvasRenderingContext2D,
    };
  }

  private clear(x: number, y: number, width: number, height: number): void {
    this.state.ctx.clearRect(
      x,
      y,
      width,
      height
    );
  }

  getDimensions(): {width: number, height: number} {
    return {
      width: this.state.width,
      height: this.state.height,
    };
  }

  private draw(render: RenderType): void {
    if(render.properties.fillStyle) {
      this.state.ctx.fillStyle = render.properties.fillStyle;
    }    
    
    if(render.properties.strokeStyle) {
      this.state.ctx.strokeStyle = render.properties.strokeStyle;
    }

    this.state.ctx[render.method](render.path);
  }

  render(object: ObjectTypes): void {
    const {x, y} = object.getPosition();
    const {width, height} = object.getDimensions();

    const render: RenderType = object.render();

    if(render.clear) {
      this.clear(x, y, width, height);
    }

    this.draw(render);
  }

  renderObjects(objects: ObjectTypes[]) {
    objects.forEach((object) => {
      this.render(object);
    });
  }
}
