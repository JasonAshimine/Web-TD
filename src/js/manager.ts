
import { IMapData, ISpriteData, ISpriteSheet, Vector} from '../data';
import Creature, { state } from './creature';
import Level from './level';
import Building from './building'

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
    static ctx:CanvasRenderingContext2D;

    spriteData: ISpriteSheet;
    spriteBase: ISpriteBase;

    map: Level;

    enemyList: Creature[] = [];
    buildingList: Building[] = [];

    constructor({ctx, ctxBG, mapData, spriteData, width, height}:IManagerOption){
        this.spriteData = spriteData;

        ctx.imageSmoothingEnabled = false;
        ctxBG.imageSmoothingEnabled = false;

        Manager.ctx = ctx;

        this.map = new Level({ctx:ctxBG, mapData, width, height});

        let image = new Image();
        image.src = spriteData.src;

        this.spriteBase = {ctx, image,}

        promisfyEvent(image, 'load').then(() => this.animate());

        ctx.canvas.addEventListener('click', event => {
            let size = {width: 3, height: 3};
            let dim = {width: 3 * 16, height: 3*16}
            
            console.log(this.map.buildPos, this.map.buildTiles, this.map.isBuildable(size), this.map.mouse)
            if(!this.map.isBuildable(size) || this.map.buildPos == undefined) 
                return;

            this.buildingList.push(new Building({position: this.map.buildPos, size:dim, manager:this, radius: 150, fireRate: 5}))
            this.map.updateBuilt();
        });

        Creature.addEventListener(state.dead, creature => {
            this.enemyList = this.enemyList.filter(i => i.state == state.alive);
        });

        Creature.addEventListener(state.done, (creature) => {
            creature.index = 0;
            creature.position.set(creature.path[0]);
            creature.state = state.alive;
            creature.setNextWaypoint();
        });
    }

    get width(){return this.map.width;}
    get height(){return this.map.height;}
    get path(){return this.map.path;}
    get ctx(){return this.spriteBase.ctx;}

    spawnWave(items:ISpriteData[], space = 30){
        let start = this.path[0];
        let position = new Vector(start.x, start.y);
        let offset = new Vector(0,0);

        offset.x = isBetween(position.x, 0, this.width) * space;
        offset.y = isBetween(position.y, 0, this.height) * space;

        items.forEach((item, i) => {
            position.add(offset);
            this.spawn(item, {position});
        });
    }

    spawn(item:ISpriteData, option = {}){
        const creature =  new Creature({
            ...this.spriteBase,
            ...item,
            path: this.path,
            speed: 1,
            scale: 1,
            delay: 7,
            ...option
        })

        this.enemyList.push(creature);
        return creature;
    }

    updateAll(){ 
        this.buildingList.forEach(i => i.update()); 
        this.enemyList.forEach(i => i.update()); 
    }
    clear(){ this.ctx.clearRect(0, 0, this.width, this.height); }

    animate(){
        this.clear();
        this.updateAll();

        this.map.update();
        

        this.log();        
        requestAnimationFrame(this.animate.bind(this));
    }

    log(){
        let text = '';
        text += this.buildingList.join('\n') + '\n';
        text += this.enemyList.join('\n') + '\n';
        
        document.querySelector('#name')!.textContent = text;
    }


    static parseMap(map:IMapData){
        let data = [];
        for(let i = 0; i < map.height; i++){
            let start = i * map.width;
            data.push(map.placement.slice(start, start + map.width))
        }
        return data;
    }
}


function isBetween(value:number, min:number, max:number){
    if(value < min)
        return -1;
    if(value > max)
        return 1;
    return 0;
}

