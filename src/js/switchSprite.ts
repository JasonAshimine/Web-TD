import { ISpriteData } from "../data";
import Sprite, { ISpriteOption } from "./sprite"


interface ISwitchSprite extends ISpriteOption{
    sprites: ISpriteData[],
}

export default class SwitchSprite extends Sprite{
    sprites: ISpriteData[] = [];
    name?: string;
    constructor({sprites, ...data}: ISwitchSprite){
        super(data);

        this.sprites = sprites;
        this.changeSprite(this.sprites[0]);
    }

    changeSprite(item: ISpriteData){
        this.height = item.height;
        this.width = item.width;

        this.scaledWidth =  this.width * this.scale;
        this.scaledHeight = this.height * this.scale;

        this.spriteOffset = item.spriteOffset;
        this.numFrames = item.numFrames;
        this.name = item.name;

        this.framesCount = 0;

        this.draw();
    }

    setSprite(index:number){
        this.changeSprite(this.sprites[index]);
    }
}