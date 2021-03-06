import { Game } from './Game';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const canvas: HTMLCanvasElement = document.getElementById(
      'canvas'
    ) as HTMLCanvasElement;

    const asset: HTMLImageElement = new Image();
    asset.src = '/asset/tree.png';

    if(asset){
      asset.onload = () => {
        const game = new Game(canvas);
  
        // tslint:disable-next-line: no-any
        (window as any).game = game;
      };
    }
  },
  false
);
