import SpriteData from './data/DungeonTilesetII.json' assert {type: 'json'};
import Sprite from './sprite';
import {Dim, Vector, Vector2D} from './data/types';
import Creature from './creature';

export interface ISpriteData extends Dim{
    name: string,
    offset: Vector2D,
    count: number
}


interface Data extends Dim{
    ctx?: CanvasRenderingContext2D,
    player?: Sprite,
    sprites: Sprite[],
}

const DATA: Data = {
    width: 1024,
    height: 500,
    sprites: [],
};

let clear = () => {};

const SpriteSheet = new Image();
SpriteSheet.src = 'img/DungeonTilesetII_v1.6.png';


document.addEventListener("DOMContentLoaded", start);
document.addEventListener("mousemove", handleMouseMove);


let movement:Vector2D = {x:0, y:0};
let mouse:Vector2D = {x:0, y:0};

function handleMouseMove(event:MouseEvent){
    mouse.x = event.clientX;
    mouse.y = event.clientY;
}


function getContext(selector:string, {width = 1024, height = 500}) : CanvasRenderingContext2D {
    const canvas: HTMLCanvasElement | null = document.querySelector(selector);
    if(!canvas) 
        throw new Error(`Invalid Selector ${selector}`);

    canvas.width = width;
    canvas.height = height; 
    return canvas.getContext('2d')!;
}



function start(){
    if(!SpriteSheet.complete){
        SpriteSheet.onload = start;
        return;
    }
    
    const ctxBG = getContext('#background', DATA);
    ctxBG.fillStyle = 'grey';
    ctxBG.fillRect(0, 0 , ctxBG.canvas.width, ctxBG.canvas.height);

    const ctx = getContext('#main', DATA);
    ctx.imageSmoothingEnabled = false;

    DATA.ctx = ctx;

    genSprite(SpriteData.big_demon_run_anim);

    console.log(DATA);
    requestAnimationFrame(animate);
}

function genSprite(item: ISpriteData, position?:Vector2D, scale = 1){
    const ctx = DATA.ctx!;
    const numFrames = item.count;
    const delay = 7;

    DATA.sprites.push(new Creature({
        ctx,
        image: SpriteSheet,
        numFrames, 
        scale, 
        ...item, 
        delay
    }))
}


/*
Tower Defense.
Sprite render.

Map Tower Enemy

pathing
tower range, attack
Gold build waves
  
*/

function animate(){
    DATA.ctx?.clearRect(0, 0, DATA.width, DATA.height);
    DATA.sprites.forEach(i => i.update());
    requestAnimationFrame(animate);
}