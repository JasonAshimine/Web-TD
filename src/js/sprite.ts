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

    color = 'black';
    scaledWidth: number;
    scaledHeight: number;

    constructor({ctx, image, position = {x:100, y:100}, scale=1, width, height, numFrames=1, spriteOffset: spriteOffset = {x:0, y:0}, delay = 2} : ISpriteOption){
        this.ctx = ctx;
        this.position = new Vector(position.x, position.y);
        this.image = image;

        this.width = width ?? this.image.width;
        this.height = height ?? this.image.height;

        this.scale = scale;
        this.scaledWidth =  this.width * scale;
        this.scaledHeight = this.height * scale;

        this.centerOffset = new Vector(this.width / 2 * scale, this.height / 2 * scale);

        this.spriteOffset = spriteOffset;
        this.numFrames = numFrames;
        this.delay = delay;
    }


    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.strokeRect(
            this.position.x - this.centerOffset.x, 
            this.position.y - this.centerOffset.y, 
            this.scaledWidth, 
            this.scaledHeight
        );

        this.ctx.drawImage(
            this.image, 
            this.spriteOffset.x + this.framesCount * this.width,
            this.spriteOffset.y,
            this.width,
            this.height,
            this.position.x - this.centerOffset.x, 
            this.position.y - this.centerOffset.y,
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