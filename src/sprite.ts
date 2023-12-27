import {Vector, Vector2D} from './data/types';

export interface ISpriteOption{
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,

    position?: Vector2D,
    scale?: number,
    width?:number,
    height?: number,
    numFrames?: number,
    offset?:Vector2D,
    delay?: number,    
}

export default class Sprite implements ISpriteOption {
    ctx: CanvasRenderingContext2D;
    position: Vector;
    scale: number;
    width: number;
    height: number;
    numFrames: number;
    offset: Vector2D;
    delay: number;
    image: HTMLImageElement;
    framesElapsed = 0;
    framesCount = 0;

    constructor({ctx, image, position = {x:0, y:0}, scale=1, width, height, numFrames=1, offset = {x:0, y:0}, delay = 2} : ISpriteOption){
        this.ctx = ctx;
        this.position = new Vector(position.x, position.y);
        this.image = image;

        this.scale = scale;

        this.width = width ?? this.image.width;
        this.height = height ?? this.image.height;

        this.offset = offset;
        this.numFrames = numFrames;
        this.delay = delay;
    }

    draw(){
        this.ctx.drawImage(
            this.image, 
            this.offset.x + this.framesCount * this.width,
            this.offset.y,
            this.width,
            this.height,
            this.position.x, 
            this.position.y,
            this.width * this.scale,
            this.height * this.scale
        );
    }

    animate(){
        this.framesElapsed++;

        if(this.framesElapsed % this.delay == 0){
            if(this.framesCount < this.numFrames - 1){
                this.framesCount++;
            }
            else{
                this.framesCount = 0;
            }
        }
    }

    update(){
        this.draw();
        this.animate();
    }
}