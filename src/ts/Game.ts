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
    objects: ObjectTypes[][],
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
        width: 50,
        height: 50,
      },      
      grid: {
        width: 100,
        height: 100,
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
    this.viewport = new Viewport(
      this.state.viewport.width, 
      this.state.viewport.height, 
      ((canvasDimensions.width - this.state.viewport.width) / 2), 
      ((canvasDimensions.height - this.state.viewport.height) / 2), 
      -1
    );

    // Build the  to be rendered
    this.generate();

   // this.renderer.render(new Tree(15, 15, 30, 30, 1, '/asset/tree.png'));

    this.render();

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
    for(let x = 0; x < this.state.grid.width; ++x) {
      this.state.objects[x] = [];

      for(let y = 0; y < this.state.grid.height; ++y) {
        const width = this.state.tiles.width;
        const height = this.state.tiles.height;

        if(Math.random() < 0.9) {
          this.state.objects[x].push(new Tile(width, height, (x * width), (y * height), x + y));
        }
        else {
          this.state.objects[x].push(new Tree(width, height, (x * width), (y * height), x + y, '/asset/tree.png'));
        }
      }
    }

    console.log(this.state.objects, 'object');
  }
  
  private listen(): void {
    this.event.on('loop', this.main.bind(this));
    //this.event.on('render', this.render.bind(this));
    //this.event.on('control', .bind(this));
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
      if(this.state.viewport.x > 0){
        this.state.viewport.x--;
      }
    }

    if(ArrowRight) {
      if(this.state.viewport.x < (this.state.grid.width - 1)){
        this.state.viewport.x++;
      }
    }
    if(ArrowUp) {
      if(this.state.viewport.y > 0){
        this.state.viewport.y--;
      }
    }

    if(ArrowDown) {
      if(this.state.viewport.y < (this.state.grid.height - 1)){
        this.state.viewport.y++;
      }
    }
  }
  
  private render(): void {
    const canvasDimensions = this.renderer.getDimensions();

    this.renderer.state.ctx.font =  "normal normal 12px Arial";

    // Temp clear whole canvas
    this.renderer.state.ctx.fillStyle = '#FFFFFF';
    this.renderer.state.ctx.fillRect( 0,  0, canvasDimensions.width, canvasDimensions.height);

    let index = 0;

    let startX = (this.state.viewport.x);
    let startY = (this.state.viewport.y);

    if(startX < 0) {
      startX = 0;
    }

    if(startY < 0) {
      startY = 0;
    }

    let gridX = Math.floor((this.viewport.getDimensions().width / this.state.tiles.width) + startX);
    let gridY = Math.floor((this.viewport.getDimensions().height / this.state.tiles.height) + startY);

    const offsetX = Math.floor((this.renderer.getDimensions().width / 2) - (this.viewport.getDimensions().width / 2));
    const offsetY = Math.floor((this.renderer.getDimensions().height / 2) - (this.viewport.getDimensions().height / 2));

    if(gridX > this.state.grid.width) {
      gridX = this.state.grid.width;
    }

    if(gridY > this.state.grid.height) {
      gridY = this.state.grid.height;
    }

    let loopX = 0;
    let loopY = 0;

    for (let x = startX; x < gridX; x++) {
      loopY = 0;

      for (let y = startY; y < gridY; y++) {
        const object = this.state.objects[x][y];

        const objectX = (loopX * this.state.tiles.width) + offsetX;
        const objectY = (loopY * this.state.tiles.height) + offsetY;
  
        object.setPosition(objectX, objectY);

        this.renderer.render(object);
        
        index++;
        loopY++;
      }

      loopX ++;
    }

    this.renderer.render(this.viewport);

   // this.renderer.state.ctx.fillRect(viewportCenterX - 2.5, viewportCenterY - 2.5, 5, 5);
   // this.renderer.state.ctx.fillRect( (this.viewport.getPosition().x - 5), (this.viewport.getPosition().y - 5), 10, 10);
   // this.renderer.state.ctx.fillRect( (viewportBottomX - 5), (viewportBottomY - 5), 10, 10);
  }

  private main(): void {
    // Scroll the viewport while user is pushing keys
    this.event.emit('render');
  }
}
