
import { IBuildingData, IBuildingJSON, IDim, IHealth, IMapData, ISpriteBase, ISpriteData, ISpriteSheet, Vector} from '../data';
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
    buildingData: IBuildingJSON,
    ctx: CanvasRenderingContext2D,
    ctxBG: CanvasRenderingContext2D,
    ctxUI: CanvasRenderingContext2D,
    width: number,
    height: number,
}



function promisfyEvent(obj:Element, event:string):Promise<Event>{
    return new Promise(res => obj.addEventListener(event, res, {once:true}));
}


export enum GameState{
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

    private _buildingData: IBuildingJSON;

    private player: Player;
    private _UI?:UI;

    private map: Level;

    enemyList: Creature[] = [];
    buildingList: Building[] = [];

    buildList:IBuildingData[] = [];

    state = GameState.level;
    level = 0;
    enabled = true;

    buildMode = false;

    constructor({ctx, ctxBG, ctxUI, mapData, buildingData ,spriteData, width, height}:IManagerOption){
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

        this._buildingData = buildingData;
        this.buildList.push(...Object.values(this._buildingData.tower));
        this.map.setBuildingSelected(this.buildList[0]);

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
        this.giveGold(1 + 1 * this.level);
        this.cleanUpCreature();
    }

    onCreatureEndPoint(){
        this.damagePlayer();
        this.cleanUpCreature();
    }

    cleanUpCreature(){
        this.enemyList = this.enemyList.filter(i => i.state == state.alive);

        if(this.enemyList.length == 0)
            this.setState(GameState.levelEnd);
    }

    giveGold(val:number){
        this.player.gold += val;
    }

    damagePlayer(val = 1){
        this.player.damage(val);
        this._UI?.updateHealth(this.player.health);

        if(!this.player.isAlive)
            this.setState(GameState.gameover);
    }

    setBuildMode(state:boolean){
        this.buildMode = state;
        this.map.enabled = state;
    }

    endGame(){
        this.enabled = false;
    }

    setState(state:GameState){
        this.state = state;
        this.onStateChange(this.state);
    }

    onStateChange(state:GameState){
        switch(state){
            case GameState.gameover:                
                this.endGame();
                break;
            case GameState.level:
                this.createWave();
                this.giveGold(this.level * 10);
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
        if(!this.enabled) return;
        let cost = 10;
        
        if(!this.map.canBuild() || this.map.buildPos == undefined) 
            return;

        if(this.player.gold < cost)
            return;

        
        let {sprite, ...buildData} = this._buildingData.tower.basic ;
        let item = Manager.spriteData.sprites[sprite];
        let building = new Building({
            ...this.spriteBase,
            position: this.map.buildPos,
            ...buildData,
            ...item,            
            manager:this
        });

        this.buildingList.push(building)
        this.map.updateBuilt();
        this.giveGold(-cost);
    }
//#endregion

    pause(){
        if(this.state == GameState.gameover) return;

        this.enabled = false;
        this.ctx.fillStyle = 'rgba(255,255,255, 0.5)'
        this.ctx.fillRect(0,0, this.width, this.height);
    }

    unpause(){
        if(this.state == GameState.gameover) return;
    
        this.enabled = true;
        this.animate();
    }

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
        
        this.log();

        if(!this.enabled){
            return cancelAnimationFrame(animationID);
        }

        this.clear();
        this.updateAll();        
    }

    //#endregion
    log(){
        let text = `${this.state} ${this.enabled}\n`;
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


