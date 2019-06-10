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

  clear() {
    this.state.ctx.clearRect(
      0,
      0,
      this.state.canvas.width,
      this.state.canvas.width
    );
  }
}
