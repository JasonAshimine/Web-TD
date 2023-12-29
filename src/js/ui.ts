import { IContext, ISpriteBase } from "../data";
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

    constructor({ctx, image, maxHealth}: IUIOption){
        this._spriteBase = {ctx, image};
        this.initHealth(maxHealth);
        this.initGold();
    }

    initGold(){
        let gold = Manager.spriteData.sprites.coin_anim;

        this._coin = new Sprite({
            ...this._spriteBase,
            ...gold,
            position: {x: 10,y :10}
        })

        this._coin.draw();
    }

    initHealth(maxHealth: number){
        let hearts = [
            Manager.spriteData.sprites.ui_heart_full,
            Manager.spriteData.sprites.ui_heart_half,
            Manager.spriteData.sprites.ui_heart_empty
        ];

        let x = 20;
        let y = 10;
        
        for(let i = 0; i < maxHealth / 2; i++){
            this._uiHealth.push(new SwitchSprite({
                ...this._spriteBase,
                ctx: Manager.ctxUI,
                sprites: hearts,
                position:{x: x += 20, y}
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
        
    }
}