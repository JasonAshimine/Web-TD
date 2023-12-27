import {Vector, Vector2D} from './data/types';
import Sprite, {ISpriteOption} from './sprite';


interface CreatureData extends ISpriteOption{
    path?: Vector2D[],
    speed?:number,
    health?: number,
}

export default class Creature extends Sprite{
    speed: number;
    health: number;
    nextWaypoint: Vector2D;
    movement: Vector;
    movementTicks: number;

    constructor({path, speed=2, health = 5, ...data} : CreatureData){
        super(data);
        this.speed = speed;
        this.health = health;

        this.framesElapsed = 0;
        this.delay = 5;
        //this.nextWaypoint = path[0];
        this.nextWaypoint = {x:500, y:250};
        this.movement = new Vector(0,0);
        this.movementTicks = 0;
    }

    moveTowards(){
        this.movementTicks--;
        
        if(this.movementTicks <= 0){
            return this.triggerEnd();
        }

        this.position.add(...this.movement.components);
    }

    triggerEnd(){
        this.onMoveEnd();
        this.movement.zero();
        this.onMoveStart();
    }

    onMoveEnd(){}
    onMoveStart(){
        this.nextWaypoint.x = getRandomInt(500);
        this.nextWaypoint.y = getRandomInt(500);

        this.movement = this.movement.copy(this.position);
        const length = this.movement.sub(this.nextWaypoint.x, this.nextWaypoint.y).length;
        
        this.movementTicks = length / this.speed;
        this.movement.normalize().multi(this.speed);
    }

    update(){        
        super.update();
        this.ctx.fillRect(this.nextWaypoint.x, this.nextWaypoint.y, 5, 5);
        this.moveTowards();
    }
}


function getRandomInt(max:number) {
    return Math.floor(Math.random() * max);
}
  