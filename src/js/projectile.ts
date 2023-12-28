import { IPosition, Vector, Vector2D } from "../data";
import Creature from "./creature";
import Manager from "./manager";


interface IProjectileOption extends IPosition{
    target:Creature,
    speed?: number,
}

export default class Projectile{
    position:Vector;
    velocity:Vector;
    target:Creature;
    speed: number;

    distance = 99;
    
    constructor({position, target, speed = 5}:IProjectileOption){
        this.position = new Vector(position);
        this.velocity = new Vector(0,0);
        this.target = target;
        this.speed = speed;
    }

    draw(){
        Manager.ctx.beginPath();
        Manager.ctx.arc(this.position.x, this.position.y, 10, 0, Math.PI * 2);
        Manager.ctx.fillStyle = 'orange';
        Manager.ctx.fill();
    }

    update(){
        this.draw();

        this.distance = this.velocity.set(this.position).sub(this.target.position).length;
        this.velocity.normalize().multi(this.speed);
        this.position.sub(this.velocity);
    }
}