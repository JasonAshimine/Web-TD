import {Vector, Vector2D} from '../data';

export interface ISpriteOption{
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,

    position?: Vector2D,
    scale?: number,
    width?:number,
    height?: number,
    numFrames?: number,
    spriteOffset?:Vector2D,
    delay?: number,
}

export default class Sprite implements ISpriteOption {
    ctx: CanvasRenderingContext2D;
    position: Vector;
    scale: number;
    width: number;
    height: number;
    numFrames: number;
    spriteOffset: Vector2D;
    delay: number;
    image: HTMLImageElement;
    framesElapsed = 0;
    framesCount = 0;

    centerOffset: Vector;

    scaledWidth: number;
    scaledHeight: number;
    center: Vector;

    constructor({ctx, image, position = {x:100, y:100}, scale=1, width, height, numFrames=1, spriteOffset: spriteOffset = {x:0, y:0}, delay = 2} : ISpriteOption){
        this.ctx = ctx;
        this.position = new Vector(position.x, position.y);

        this.image = image;
        this.width = width ?? this.image.width;
        this.height = height ?? this.image.height;

        this.scale = scale;
        this.scaledWidth =  this.width * scale;
        this.scaledHeight = this.height * scale;
        
        this.centerOffset = new Vector(this.scaledWidth / 2, this.scaledHeight / 2);
        this.center = new Vector(position).add(this.centerOffset);

        this.spriteOffset = spriteOffset;
        this.numFrames = numFrames;
        this.delay = delay;
    }

    draw(){
        this.center.set(this.position).add(this.centerOffset);
        this.ctx.drawImage(
            this.image, 
            this.spriteOffset.x + this.framesCount * this.width,
            this.spriteOffset.y,
            this.width,
            this.height,
            this.position.x,
            this.position.y ,
            this.scaledWidth,
            this.scaledHeight
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