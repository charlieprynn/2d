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
    objects: ObjectTypes[],
  };

  constructor(canvas: HTMLCanvasElement) {
    // Frames per second
    const fps = 30;

    // Node event emiter
    this.event = new EventEmitter();

    // Rendering engine
    this.renderer = new Renderer(canvas);

    // Game state
    this.state = {
      game: {
        fps,
        lastTime: new Date().getTime(),
        currentTime: 0,
        delta: 0,
        interval: 1000 / fps,
      },
      objects: [new Tree(10, 10, 0, 10), new Tree(10, 10, 50, 10), new Tree(10, 10, 100, 10)],
    };

    // Start listening to events
    this.listen();

    // Start the loop
    this.loop();
  }

  listen() {
    this.event.on('loop', this.main.bind(this));
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

  main() {
    // Render the objects (that are in view)
    this.renderer.renderObjects(this.state.objects);
    
    this.event.emit('render');
  }
}
