export class Object {
    constructor(width, height, x, y) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    getPosition() {
        return {
            x: this.x,
            y: this.y
        };
    }
    getDimensions() {
        return {
            width: this.width,
            height: this.height
        };
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        return this.getPosition();
    }
}
