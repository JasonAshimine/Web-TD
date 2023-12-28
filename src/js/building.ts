import { IDim, Vector, Vector2D } from "../data";
import Creature, { state } from "./creature";
import Manager from "./manager";
import Projectile from "./projectile";

export interface IBuildingOption{
    position: Vector2D,
    size:IDim,
    manager:Manager,
    radius: number,
    fireRate: number,
}

export default class Building{
    size:IDim;
    position:Vector;
    center:Vector;
    projectile:Projectile[] = []
    manager:Manager;

    radius: number;
    target?: Creature;
    fireRate: number;
    fireCD = 0;

    constructor({position = {x:0, y:0}, size, manager, radius = 150, fireRate = 30}:IBuildingOption){
        this.size = size;
        this.position = new Vector(position);
        this.center = new Vector(position).add(size.width/2, size.height/2);
        this.radius = radius;
        this.fireRate = fireRate;

        this.manager = manager;
    }

    getEnemy(){
        this.target = this.manager.enemyList.find(enemy => enemy.state == state.alive && this.center.distance(enemy.position) < this.radius + enemy.radius);
    }

    shoot(target:Creature){
        this.fireCD = this.fireRate;
        this.projectile.push(new Projectile({position:this.center, target}));
    }

    draw(){
        Manager.ctx.fillStyle = 'rgba(255,0,0,1)';
        Manager.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);

        Manager.ctx.beginPath();
        Manager.ctx.arc(this.center.x, this.center.y, this.radius, 0 , Math.PI * 2)
        Manager.ctx.fillStyle = 'rgba(255,0,0,0.2)';
        Manager.ctx.fill();
    }

    update(){
        this.draw();

        if(this.target && this.center.distance(this.target.position) > this.radius + this.target.radius){
            this.target = undefined;
        }

        if(!this.target){ this.getEnemy(); }
        
        if(this.target && this.fireCD-- <= 0){
            this.shoot(this.target);
        }

        for(let i = this.projectile.length -1; i >= 0; i--){
            const projectile = this.projectile[i];
            projectile.update();

            if(projectile.distance <= projectile.target.radius){
                this.projectile.splice(i, 1);

                if(projectile.target.state == state.dead){
                    this.target = undefined;
                }
                projectile.target.damage(1);
            }                
        }
    }

    toString(){
        return `${this.position} ${this.projectile.length} Target:${this.target?.name ?? '-'}`
    }
}