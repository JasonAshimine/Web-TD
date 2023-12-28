
import {IMapData, ISpriteData, ISpriteSheet, Vector} from './data';
import Creature from './js/creature';


interface IManagerOption{
    mapData: IMapData,
    spriteData: ISpriteSheet,
    ctx: CanvasRenderingContext2D,
    ctxBG: CanvasRenderingContext2D,
    width: number,
    height: number,
}

interface ISpriteBase{
    image: HTMLImageElement,
    ctx: CanvasRenderingContext2D,
}

function promisfyEvent(obj:Element, event:string):Promise<Event>{
    return new Promise(res => obj.addEventListener(event, res, {once:true}));
}

export default class Manager{
    mapData: IMapData;
    spriteData: ISpriteSheet;
    spriteBase: ISpriteBase;

    width: number;
    height: number;

    enemyList: Creature[] = [];

    constructor({ctx, ctxBG, mapData, spriteData, width, height}:IManagerOption){
        this.mapData = mapData;
        this.spriteData = spriteData;

        ctx.imageSmoothingEnabled = false;
        ctxBG.imageSmoothingEnabled = false;

        let mapImage = new Image();
        mapImage.src = mapData.src;

        this.width = width;
        this.height = height;

        let promises = [];
        promises.push(promisfyEvent(mapImage, 'load').then(() => {
            ctxBG.drawImage(mapImage,0,0);
            this.width = width ?? mapImage.width;
            this.height = height ?? mapImage.height;
        }));

        let image = new Image();
        image.src = spriteData.src;

        this.spriteBase = {ctx, image,}

        promises.push(promisfyEvent(image, 'load'));

        Promise.all(promises).then(() => this.animate());
    }

    spawnWave(items:ISpriteData[], space = 5){
        let start = this.mapData.path[0];
        let position = new Vector(start.x, start.y);

        position.sub(this.width/2, this.height/2);

        console.log(start, position);
    }

    spawn(item:ISpriteData){
        const creature =  new Creature({
            ...this.spriteBase,
            ...item,
            path: this.mapData.path,
            speed:3,
            scale: 2,
            delay: 7
        })

        this.enemyList.push(creature);
        return creature;
    }

    updateAll(){ this.enemyList.forEach(i => i.update()); }
    clear(){ this.spriteBase.ctx.clearRect(0, 0, this.width, this.height); }

    animate(){
        this.clear();
        this.updateAll();

        document.querySelector('#name')!.textContent = this.enemyList[0].toString();
        requestAnimationFrame(this.animate.bind(this));
    }
}