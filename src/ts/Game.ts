import EventEmitter from 'events';
import { Tree } from './objects/Tree';
import { Tile } from './objects/Tile';
import { Viewport } from './objects/Viewport';
import { Renderer } from './Renderer';

import { ObjectTypes } from './types';



export class Game {
  event: NodeJS.EventEmitter;
  renderer: Renderer;
  viewport: Viewport;
  state: {
    controls: { 
      ArrowLeft: boolean;
      ArrowRight: boolean;
      ArrowUp: boolean;
      ArrowDown: boolean;
      [key: string]: boolean;
    };
    game: {
      fps: number;
      lastTime: number;
      currentTime: number;
      delta: number;
      interval: number;
    };
    tiles: {
      width: number;
      height: number;
    };
    grid: {
      width: number;
      height: number;
    };
    viewport: {
      width: number;
      height: number;
    }
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
      controls: {
        ArrowLeft: false,
        ArrowRight: false,
        ArrowUp: false,
        ArrowDown: false,
      },
      tiles: {
        width: 20,
        height: 20,
      },      
      grid: {
        width: 30,
        height: 30,
      }, 
      viewport: {
        width: 300,
        height: 300,
      },
      game: {
        fps,
        lastTime: new Date().getTime(),
        currentTime: 0,
        delta: 0,
        interval: 1000 / fps,
      },
      objects: [],
    };
 
    const canvasDimensions = this.renderer.getDimensions();

    // Setup the viewport
    this.viewport = new Viewport(this.state.viewport.width, this.state.viewport.height, ((canvasDimensions.width - this.state.viewport.width) / 2), ((canvasDimensions.height - this.state.viewport.height) / 2));

    // Build the  to be rendered
    this.generate();

    // Start listening to events
    this.listen();

    // Start the loop
    this.loop();
  }

  private input(event: KeyboardEvent) {
    const value = event.type === 'keydown';

    this.state.controls[event.key] = value;

    this.event.emit('control');
  }

  private generate(): void {
    for(let y = 0; y < (this.state.viewport.height / this.state.tiles.height); ++y) {
      for(let x = 0; x < (this.state.viewport.width / this.state.tiles.width); ++x) {
        const width = this.state.tiles.width;
        const height = this.state.tiles.height;

        const tX = (x * this.state.tiles.width) + ((this.renderer.getDimensions().width - this.state.viewport.width) / 2);
        const tY = (y * this.state.tiles.height) + ((this.renderer.getDimensions().width - this.state.viewport.width) / 2);

        if(Math.random() < 0.5){
          this.state.objects.push(new Tile(width, height, tX, tY));
        }
        else{
          this.state.objects.push(new Tree(width, height, tX, tY));
        }
      }
    }

    console.log(this.state.objects);
  }
  
  private listen(): void {
    this.event.on('loop', this.main.bind(this));

    document.addEventListener('keydown', this.input.bind(this), false);
    document.addEventListener('keyup', this.input.bind(this), false);
  }

  private loop(): void{
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
  
  private main(): void {
    // Render the objects (that are in view)
    this.renderer.renderObjects(this.state.objects);

    this.renderer.render(this.viewport);
    this.event.emit('render');
  }
}
