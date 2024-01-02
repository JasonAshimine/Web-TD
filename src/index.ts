import Sprite from './js/sprite';
import {IDim} from './data';
import Creature from './js/creature';
import Manager, { GameState } from './js/manager';

import SpriteData from './data/DungeonTilesetII.json' assert {type: 'json'};
import MapData from './data/Map.json' assert {type: 'json'};
import Building from './data/Building.json' assert {type: 'json'};

interface Data extends IDim{
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
    const {sprites} = SpriteData;

    let ctxUI = getContext('#ui', DATA);

    ctxUI.fillText("hello", 20, 20);
    console.log(ctxUI);

    let manager = new Manager({
        ctx: getContext('#main', DATA),
        ctxBG: getContext('#background', DATA),
        ctxUI: getContext('#ui', DATA),
        mapData: MapData,
        spriteData: SpriteData,
        buildingData: Building,
        width: DATA.width,
        height: DATA.height,
        cell:{width:16, height:16}
    });



    //manager.spawnWave([sprites.doc_run_anim]);

    

    document.addEventListener('keydown', ev => {
        switch(ev.key){
            case 't': return manager.spawn(sprites.doc_run_anim);
            case 'd': return manager.damagePlayer(1);
            case ' ': return manager.enabled ? manager.pause(): manager.unpause(); 
            case 'g': return manager.setState(GameState.gameover); 


        }
    })

    // console.log(manager.spawnWave([
    //     sprites.doc_run_anim,
    //     sprites.imp_run_anim,
    //     sprites.ogre_run_anim,
    //     sprites.angel_run_anim,
    //     sprites.chort_run_anim,
    //     sprites.elf_f_run_anim,
    //     sprites.wogol_run_anim
    // ]));

    // if(!SpriteSheet.complete){
    //     SpriteSheet.onload = start;
    //     return;
    // }
    
    // genBackground();
    // genMain();   

    // requestAnimationFrame(animate);
}

// function find(center:Vector2D, distance:number){
//     const x = center.x - distance;
//     const y = center.y - distance;
//     const xMax = center.x + distance;
//     const yMax = center.y + distance;
    
//     const between = (val:number, min:number, max:number) => val >= min && val <= max;

//     return DATA.sprites.find(sprite => 
//         between(sprite.position.x, x, xMax) && between(sprite.position.y, y, yMax) && isWithin(sprite, center, distance)
//     );
// }

// function isWithin(sprite:Sprite, center:Vector2D, distance:number){
//     return sprite.position.distance(center.x, center.y) < distance;
// }