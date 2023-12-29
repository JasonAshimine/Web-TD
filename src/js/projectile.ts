import { IPosition, Vector, Vector2D } from "../data";
import Creature from "./creature";
import Manager from "./manager";


interface IProjectileOption extends IPosition{
    target:Creature,
    speed?: number,
    radius?: number,
    damage?: number,
}

export default class Projectile{
    position:Vector;
    velocity:Vector;
    target:Creature;
    speed: number;
    damage: number;

    distance = 99;
    radius:number;
    
    enabled:boolean;

    constructor({position, target, speed = 5, radius = 5, damage = 1}:IProjectileOption){
        this.position = new Vector(position);
        this.velocity = new Vector(0,0);
        this.target = target;
        this.speed = speed;
        this.radius = radius;
        this.damage = damage;

        this.enabled = true;
    }

    checkHit(){
        if(this.distance <= this.target.radius){
            this.target.damage(this.damage);
            this.enabled = false;
        }      
    }

    draw(){
        Manager.ctx.beginPath();
        Manager.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        Manager.ctx.fillStyle = 'orange';
        Manager.ctx.fill();
    }

    update(){
        if(!this.enabled) return;
        this.draw();

        this.distance = this.velocity.set(this.position).sub(this.target.position).length;
        this.velocity.normalize().multi(this.speed);
        this.position.sub(this.velocity);

        this.checkHit();
    }
}