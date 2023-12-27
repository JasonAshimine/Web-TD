import Sprite from './sprite';
import {Dim, ISpriteData, Vector2D} from './data';
import Creature from './creature';

import SpriteData from './data/DungeonTilesetII.json' assert {type: 'json'};
import MapData from './data/Map.json' assert {type: 'json'};

interface Data extends Dim{
    ctx?: CanvasRenderingContext2D,
    player?: Sprite,
    sprites: (Creature|Sprite)[],
}

const DATA: Data = {
    width: 512,
    height: 512,
    sprites: [],
};

const SpriteSheet = new Image();
SpriteSheet.src = 'img/DungeonTilesetII_v1.6.png';

document.addEventListener("DOMContentLoaded", start);

function getContext(selector:string, {width = 1024, height = 500}) : CanvasRenderingContext2D {
    const canvas: HTMLCanvasElement | null = document.querySelector(selector);
    if(!canvas) 
        throw new Error(`Invalid Selector ${selector}`);

    canvas.width = width;
    canvas.height = height; 
    return canvas.getContext('2d')!;
}

/*
Tower Defense.
Sprite render.
pathing: waypoint movement

Map Tower Enemy
trigger range

tower range, attack
Gold build waves
*/



function start(){
    if(!SpriteSheet.complete){
        SpriteSheet.onload = start;
        return;
    }
    
    genBackground();
    genMain();   

    requestAnimationFrame(animate);
}

function genBackground(){
    const ctx = getContext('#background', DATA);
    ctx.fillStyle = 'grey';
    
    const image = new Image();
    image.src = 'img/Map.png';

    image.onload = () => ctx.drawImage(image,0,0);
}

function genMain(){
    const ctx = getContext('#main', DATA);
    ctx.imageSmoothingEnabled = false;

    DATA.ctx = ctx;

    
    Object.values(SpriteData).slice(0, 5).forEach((item, index) => {
        let i = index % 3;
        const r:number = 255 * (i == 0 ? 1 : 0);
        const g:number = 255 * (i == 1 ? 1 : 0);
        const b:number = 255 * (i == 2 ? 1 : 0);

        console.log(r,g,b);
        genSprite(ctx, item, 2, `rgba(${r}, ${g}, ${b}, 1)`)
    });
}

function genSprite(ctx:CanvasRenderingContext2D, item: ISpriteData, scale = 1, color = 'black'){
    const delay = 7;

    const creature = new Creature({
        ctx,
        path: MapData.path,
        image: SpriteSheet,
        scale, 
        ...item,
        speed: 3,
        delay
    });

    DATA.sprites.push(creature)
    creature.color = color;
}

interface spawnData{
    ctx:CanvasRenderingContext2D,
    items: ISpriteData,
    space: number,
}

function animate(){
    DATA.ctx?.clearRect(0, 0, DATA.width, DATA.height);
    DATA.sprites.forEach(i => i.update());

    document.querySelector('#name')!.textContent = DATA.sprites[0].toString();

    requestAnimationFrame(animate);
}


function find(center:Vector2D, distance:number){
    const x = center.x - distance;
    const y = center.y - distance;
    const xMax = center.x + distance;
    const yMax = center.y + distance;
    
    const between = (val:number, min:number, max:number) => val >= min && val <= max;

    return DATA.sprites.find(sprite => 
        between(sprite.position.x, x, xMax) && between(sprite.position.y, y, yMax) && isWithin(sprite, center, distance)
    );
}

function isWithin(sprite:Sprite, center:Vector2D, distance:number){
    return sprite.position.distance(center.x, center.y) < distance;
}