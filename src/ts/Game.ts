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
      x: number;
      y: number;
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
        width: 30,
        height: 30,
      },      
      grid: {
        width: 50,
        height: 50,
      },
      viewport: {
        width: 300,
        height: 300,
        x: 0,
        y: 0,
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
    this.viewport = new Viewport(this.state.viewport.width, this.state.viewport.height, ((canvasDimensions.width - this.state.viewport.width) / 2), ((canvasDimensions.height - this.state.viewport.height) / 2), 99999999);

    // Build the  to be rendered
    this.generate();

    //this.renderer.renderObjects(this.state.objects);

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
    let index = 0;

    for(let y = 0; y < this.state.grid.height; ++y) {
      for(let x = 0; x < this.state.grid.width; ++x) {
        const width = this.state.tiles.width;
        const height = this.state.tiles.height;

        if(Math.random() < 0.9) {
          this.state.objects.push(new Tile(width, height, (x * width), (y * height), index));
        }
        else {
          this.state.objects.push(new Tree(width, height, (x * width), (y * height), index));
        }

        index++;
      }
    }

    console.log(this.state.objects, 'object');
  }
  
  private listen(): void {
    this.event.on('loop', this.main.bind(this));
    //this.event.on('render', this.render.bind(this));
    this.event.on('control', this.render.bind(this));
    this.event.on('render', this.move.bind(this));

    document.addEventListener('keydown', this.input.bind(this), false);
    document.addEventListener('keyup', this.input.bind(this), false);
  }

  private loop(): void {
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

  private move(): void {
    const {ArrowLeft, ArrowRight, ArrowUp, ArrowDown} = this.state.controls;

    if(ArrowLeft) {
      this.state.viewport.x--;
    }

    if(ArrowRight) {
      this.state.viewport.x++;
    }
    if(ArrowUp) {
      this.state.viewport.y--;
    }

    if(ArrowDown) {
      this.state.viewport.y++;
    }
  }
  
  private render(): void {
    const canvasDimensions = this.renderer.getDimensions();

    // Temp clear whole canvas
   // this.renderer.state.ctx.fillRect( 0,  0, canvasDimensions.width, canvasDimensions.height);

    // Get the viewport center relative to the canvas size (x, y)
    const viewportCenterX = Math.floor((this.viewport.getPosition().x + (this.viewport.getDimensions().width / 2)));
    const viewportCenterY = Math.floor((this.viewport.getPosition().y + (this.viewport.getDimensions().height/ 2)));

    // Get the top and right coordinates of the viewport
    const viewportTopX = Math.ceil(((canvasDimensions.width - this.state.viewport.width) / 2));
    const viewportTopY = Math.ceil(((canvasDimensions.height - this.state.viewport.height) / 2));

    // Get the bottom and right coordinates of the viewport
    const viewportBottomX = Math.ceil(((canvasDimensions.width + this.state.viewport.width) / 2));
    const viewportBottomY = Math.ceil(((canvasDimensions.height + this.state.viewport.height) / 2));
   
    // The start x/y for the array indexes
    const startX = Math.floor(((viewportTopX) / this.state.tiles.width));
    const startY = Math.floor(((viewportTopY)  / this.state.tiles.height));
        
    // The end x/y for the array indexes
    const endX = Math.floor((viewportBottomX / this.state.tiles.width));
    const endY = Math.floor((viewportBottomY / this.state.tiles.height));

    for(let y = startY; y <= endY; y++) {
      for(let x = startX; x <= endX; x++) {
        const objectX = (this.state.viewport.x + x) - 1;
        const objectY = (this.state.viewport.y + y) - 1;
        const index = ((objectY * this.state.grid.height) + objectX);
        const object = this.state.objects[index];

        object.setPosition((x * this.state.tiles.width), (y * this.state.tiles.height));

        this.renderer.render(object);
      }
    }

    this.renderer.render(this.viewport);

    this.renderer.state.ctx.fillRect(viewportCenterX - 2.5, viewportCenterY - 2.5, 5, 5);
    this.renderer.state.ctx.fillRect( (viewportTopX - 5), (viewportTopY - 5), 10, 10);
    this.renderer.state.ctx.fillRect( (viewportBottomX - 5), (viewportBottomY - 5), 10, 10);
  }

  private main(): void {
    // Scroll the viewport while user is pushing keys
    this.event.emit('render');
  }
}
