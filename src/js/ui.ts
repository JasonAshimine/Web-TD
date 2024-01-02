import { IContext, ISpriteBase, Vector } from "../data";
import Manager from "./manager";
import Sprite from "./sprite";
import SwitchSprite from "./switchSprite";


export interface IUIOption extends IContext{
    image: HTMLImageElement,
    maxHealth: number,
}

export default class UI{
    private _uiHealth:SwitchSprite[] = [];
    private _spriteBase:ISpriteBase;

    private _coin?:Sprite;

    private offset:Vector;

    constructor({ctx, image, maxHealth}: IUIOption){
        this._spriteBase = {ctx, image};
        this.offset =new Vector(0,10);

        this.initHealth(maxHealth);
        this.initGold();
        this.draw();
    }

    get ctx(){ return this._spriteBase.ctx; }

    initGold(){
        this.offset.x += 20;
        this.updateGold(0);
    }

    updateGold(val = 0){
        let x = this.offset.x;
        let y = this.offset.y;
        this.ctx.textBaseline = 'hanging';
        this.ctx.clearRect(x,y, 200, 20);
        this.ctx.fillText(`Gold: ${val}`, x, y);
    }

    initHealth(maxHealth: number){
        let hearts = [
            Manager.spriteData.sprites.ui_heart_full,
            Manager.spriteData.sprites.ui_heart_half,
            Manager.spriteData.sprites.ui_heart_empty
        ];

        
        for(let i = 0; i < maxHealth / 2; i++){
            this.offset.x += 20;

            this._uiHealth.push(new SwitchSprite({
                ...this._spriteBase,
                sprites: hearts,
                position:this.offset
            }))
        }
    }

    updateHealth(val:number){
        const calc = (i:number) => {
            let temp = val - i * 2;
            return temp <= 0 ? 2 : temp == 1 ? 1 : 0;
        }

        this._uiHealth.forEach((sprite,i) => sprite.setSprite(calc(i)));
    }

    draw(){
        this._coin?.draw();
    }

    update(){
        //this._coin?.update();
    }
}