import { IDim, Vector, Vector2D } from "../data";
import Creature, { state } from "./creature";
import Manager from "./manager";
import Projectile from "./projectile";
import Sprite, { ISpriteOption } from "./sprite";

export interface IBuildingOption extends ISpriteOption{
    position: Vector2D,
    manager:Manager,
    radius: number,
    fireRate: number,
    damage:number,
}

export default class Building extends Sprite{
    projectile:Projectile[] = []
    manager:Manager;

    radius: number;
    target?: Creature;
    fireRate: number;
    fireCD = 0;
    damage:number;

    constructor({manager, radius = 150, fireRate = 30, damage=1, ...sprite}:IBuildingOption){
        super(sprite);
        this.radius = radius;
        this.fireRate = fireRate;

        this.manager = manager;
        this.damage = damage;
    }

    getEnemy(){
        this.target = this.manager.enemyList.find(enemy => enemy.state == state.alive && this.center.distance(enemy.position) < this.radius + enemy.radius);
    }

    shoot(target:Creature){
        this.fireCD = this.fireRate;
        this.projectile.push(new Projectile({position:this.center, target, damage:this.damage}));
    }

    draw(){        
        // Manager.ctx.beginPath();
        // Manager.ctx.arc(this.center.x, this.center.y, this.radius, 0 , Math.PI * 2)
        // Manager.ctx.fillStyle = 'rgba(0,0,200,0.2)';
        // Manager.ctx.fill();
        super.draw();
    }

    update(){
        super.update();
        
        this.fireCD--;
        if(this.target && this.center.distance(this.target.position) > this.radius + this.target.radius){
            this.target = undefined;
        }

        if(!this.target){ this.getEnemy(); }
        
        if(this.target && this.fireCD <= 0){
            this.shoot(this.target);
        }

        for(let i = this.projectile.length -1; i >= 0; i--){
            const projectile = this.projectile[i];
            projectile.update();

            if(!projectile.enabled){
                this.projectile.splice(i, 1);
            }

            if(!projectile.target.isAlive)
                this.target = undefined;          
        }
    }

    toString(){
        let fire = `${this.damage}[${this.fireRate} ${this.fireCD} ]`;
        return `${this.position} ${this.projectile.length} ${fire} Target:${this.target?.name ?? '-'}`
    }
}