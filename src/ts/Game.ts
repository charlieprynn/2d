import EventEmitter from 'events';
import { Tree } from './objects/Tree';
import { Renderer } from './Renderer';

import { ObjectTypes } from './types';

export class Game {
  event: NodeJS.EventEmitter;
  renderer: Renderer;
  state: {
    game: {
      fps: number;
      lastTime: number;
      currentTime: number;
      delta: number;
      interval: number;
    };
    objects: ObjectTypes[]
  };

  constructor(canvas: HTMLCanvasElement) {
    const fps = 30;
    this.event = new EventEmitter();
    this.renderer = new Renderer(canvas);

    this.state = {
      game: {
        fps,
        lastTime: new Date().getTime(),
        currentTime: 0,
        delta: 0,
        interval: 1000 / fps,
      },
      objects: [],
    };

    this.bindEvents();
    this.loop();
  }

  bindEvents() {
    this.event.on('loop', this.render.bind(this));
    this.event.on('clear', this.renderer.clear.bind(this.renderer));
  }

  loop() {
    window.requestAnimationFrame(this.loop.bind(this));

    this.state.game.currentTime = new Date().getTime();
    this.state.game.delta =
      this.state.game.currentTime - this.state.game.lastTime;

    if (this.state.game.delta > this.state.game.interval) {
      this.state.game.lastTime =
        this.state.game.currentTime -
        (this.state.game.delta % this.state.game.interval);
      this.event.emit('loop');
    }
  }
  render() {
    this.state.objects = [new Tree(10, 10, 10, 10), new Tree(10, 10, 100, 100), new Tree(10, 10, 200, 200), new Tree(10, 10, 300,300)];
    
    this.event.emit('clear');

    this.renderer.renderObjects(this.state.objects);

    this.event.emit('render');
  }
}
