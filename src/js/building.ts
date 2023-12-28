import { IDim, Vector2D } from "../data";
import Creature from "./creature";
import Manager from "./manager";
import Projectile from "./projectile";

export interface IBuildingOption{
    position: Vector2D,
    size:IDim,
    manager:Manager,
}

export default class Building{
    size:IDim;
    position:Vector2D;
    center:Vector2D;
    projectile:Projectile[] = []
    manager:Manager;

    constructor({position = {x:0, y:0}, size, manager}:IBuildingOption){
        this.size = size;
        this.position = position;
        this.center = {x: position.x + size.width/2, y: position.y + size.height/2};
        
        this.shoot(manager.enemyList[0]);

        this.manager = manager;
    }

    shoot(target:Creature){
        this.projectile.push(new Projectile({position:this.center, target}));
    }

    draw(){
        Manager.ctx.fillStyle = 'rgba(255,0,0,0.5)';
        Manager.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }

    update(){
        this.draw();

        for(let i = this.projectile.length -1; i >= 0; i--){
            const projectile = this.projectile[i];
            projectile.update();

            if(projectile.distance <= projectile.target.radius)
                this.projectile.splice(i, 1);
        }
    }
}