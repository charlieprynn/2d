export class Renderer {
    constructor(canvas) {
        this.state = {
            canvas,
            width: canvas.width,
            height: canvas.height,
            ctx: canvas.getContext('2d'),
        };
    }
    clear() {
        this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.width);
    }
}
