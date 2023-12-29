
import { IDim, IHealth, IMapData, ISpriteBase, ISpriteData, ISpriteSheet, Vector} from '../data';
import Creature, { state } from './creature';
import Level from './level';
import Building from './building'
import Player from './player';
import Sprite from './sprite';
import SwitchSprite from './switchSprite';
import UI from './ui';

interface IManagerOption{
    mapData: IMapData,
    spriteData: ISpriteSheet,
    ctx: CanvasRenderingContext2D,
    ctxBG: CanvasRenderingContext2D,
    ctxUI: CanvasRenderingContext2D,
    width: number,
    height: number,
}



function promisfyEvent(obj:Element, event:string):Promise<Event>{
    return new Promise(res => obj.addEventListener(event, res, {once:true}));
}


enum GameState{
    level = 'level',
    levelEnd = 'level end',
    gameover = 'game over',
}

export default class Manager{
    static ctx:CanvasRenderingContext2D;
    static ctxUI:CanvasRenderingContext2D;
    static spriteData:ISpriteSheet;

    spriteData: ISpriteSheet;
    spriteBase: ISpriteBase;

    private player: Player;
    private _UI?:UI;

    private map: Level;

    enemyList: Creature[] = [];
    buildingList: Building[] = [];

    state = GameState.level;
    level = 0;

    constructor({ctx, ctxBG, ctxUI, mapData, spriteData, width, height}:IManagerOption){
        this.spriteData = spriteData;

        ctx.imageSmoothingEnabled = false;
        ctxBG.imageSmoothingEnabled = false;

        this.player = new Player({health: 10});

        Manager.ctx = ctx;
        Manager.ctxUI = ctxUI;
        Manager.spriteData = spriteData;

        this.map = new Level({ctx:ctxBG, mapData, width, height});

        let image = new Image();
        image.src = spriteData.src;

        this.spriteBase = {ctx, image,}

        

        promisfyEvent(image, 'load').then(() => {
            this.animate();
            this._UI = new UI({ctx:ctxUI, image, maxHealth:this.player.maxHealth});            
        });

        ctxUI.canvas.addEventListener('click', event => {
            this.build();
        });

        Creature.addEventListener(state.dead, creature => {
            this.onCreatureDeath();
        });

        Creature.addEventListener(state.done, (creature) => {
            this.onCreatureEndPoint();
        });

        this.setState(GameState.level);
    }

    get width(){return this.map.width;}
    get height(){return this.map.height;}
    get path(){return this.map.path;}
    get ctx(){return this.spriteBase.ctx;}

    //#region Event Handler
    onCreatureDeath(){ 
        this.enemyList = this.enemyList.filter(i => i.state == state.alive);

        if(this.enemyList.length == 0)
            this.setState(GameState.levelEnd);
    }

    onCreatureEndPoint(){
        this.damagePlayer();

        this.enemyList = this.enemyList.filter(i => i.state == state.alive);

        if(this.enemyList.length == 0)
            this.setState(GameState.levelEnd);
    }

    damagePlayer(val = 1){
        this.player.damage(val);
        this._UI?.updateHealth(this.player.health);

        if(!this.player.isAlive)
            this.setState(GameState.gameover);
    }


    endGame(){

    }


    setState(state:GameState){
        this.state = state;
        this.onStateChange(this.state);
    }

    onStateChange(state:GameState){
        switch(state){
            case GameState.gameover:
                return this.endGame();
            case GameState.level:
                this.createWave();
                break;
            case GameState.levelEnd:
                this.level++;
                this.setState(GameState.level);
                break;
        }
    }
    //#endregion

    //#region Wave
    createWave(){
        let item = this.spriteData.sprites.doc_run_anim;
        this.spawnWave(Array(this.level * 2 + 5).fill(item))
    }

    //#endregion

//#region Build
    build(){
        let size = {width: 3, height: 3};
        let dim = {width: 3 * 16, height: 3*16}
        
        if(!this.map.isBuildable(size) || this.map.buildPos == undefined) 
            return;

        let building = new Building({
            position: this.map.buildPos, 
            size:dim, 
            manager:this, 
            radius: 150, 
            fireRate: 60
        });

        this.buildingList.push(building)
        this.map.updateBuilt();
    }
//#endregion

//#region Spawn
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
            speed: 3,
            scale: 1,
            delay: 7,
            ...option
        })

        this.enemyList.push(creature);
        return creature;
    }
//#endregion

    //#region update / animation



    updateAll(){ 
        this.buildingList.forEach(i => i.update()); 
        this.enemyList.forEach(i => i.update()); 
        
        this.map.update();
    }
    clear(){ this.ctx.clearRect(0, 0, this.width, this.height); }

    animate(){
        let animationID = requestAnimationFrame(this.animate.bind(this));
        this.clear();
        this.updateAll();        
        
        this.log();        
        
        if(this.state == GameState.gameover){
            cancelAnimationFrame(animationID);
            this.clear();
        }            
    }

    //#endregion
    log(){
        let text = this.state + '\n';
        text += this.player + '\n';
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


