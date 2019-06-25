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

  render(object: ObjectTypes): void {
    const {x, y} = object.getPosition();
    const {width, height} = object.getDimensions();
    const render: RenderType = object.render();

    if(render.clear) {
      this.clear(x, y, width, height);
    }

    this.state.ctx.fillStyle = 'blue';
    this.state.ctx.fillText(object.state.index.toString(), x, y + 15);

    this.draw(render);
  }

  renderObjects(objects: ObjectTypes[]) {
    objects.forEach((object) => {
      this.render(object);
    });
  }

  getDimensions(): {width: number, height: number} {
    return {
      width: this.state.width,
      height: this.state.height,
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

  private draw(render: RenderType): void {
    if(render.method === 'path') {
      if(render.properties.pathMethod === 'fill') {
        this.state.ctx.fillStyle = render.properties.color ? render.properties.color : '';
        this.state.ctx[render.properties.pathMethod](render.properties.path || new Path2D());
      }
      
      if(render.properties.pathMethod === 'stroke') {
        this.state.ctx.strokeStyle = render.properties.color ? render.properties.color : '';
        this.state.ctx[render.properties.pathMethod](render.properties.path || new Path2D());
      }
    }

    if(render.method === 'image' && render.properties.image) {
      this.state.ctx.drawImage(render.properties.image.image || new Image(), render.properties.image.x, render.properties.image.y, render.properties.image.width, render.properties.image.height);

      
      //(render.properties.image.image, 0, 0, render.properties.image.x, render.properties.image.y); 
    }
  }
}
