import { IDim, Vector2D } from "../data";
import Manager from "./manager";

export interface IBuildingOption{
    position: Vector2D,
    size:IDim
}

export default class Building{
    size:IDim;
    position:Vector2D;

    constructor({position = {x:0, y:0}, size}:IBuildingOption){
        this.size = size;
        this.position = position;
    }

    draw(){
        Manager.ctx.fillStyle = 'rgba(255,0,0,0.5)';
        Manager.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }

    update(){
        this.draw();
    }
}