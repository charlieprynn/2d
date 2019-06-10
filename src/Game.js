import EventEmitter from 'events';
import { Tree } from './objects/Tree';
import { Renderer } from './Renderer';
export class Game {
    constructor() {
        const canvas = document.getElementById('canvas');
        const fps = 30;
        const renderer = new Renderer(canvas);
        this.event = new EventEmitter();
        this.state = {
            game: {
                fps,
                lastTime: (new Date()).getTime(),
                currentTime: 0,
                delta: 0,
                interval: 1000 / fps,
            },
            objects: {
                tree: new Tree()
            },
            renderer
        };
        this.bindEvents();
        this.loop();
    }
    bindEvents() {
        this.event.on('loop', this.render.bind(this));
        this.event.on('clear', this.state.renderer.clear.bind(this.state.renderer));
    }
    loop() {
        window.requestAnimationFrame(this.loop.bind(this));
        this.state.game.currentTime = (new Date()).getTime();
        this.state.game.delta = (this.state.game.currentTime - this.state.game.lastTime);
        if (this.state.game.delta > this.state.game.interval) {
            this.state.game.lastTime = this.state.game.currentTime - (this.state.game.delta % this.state.game.interval);
            this.event.emit('loop');
        }
    }
    render() {
        this.event.emit('clear');
        console.log('render');
        this.event.emit('render');
    }
}
