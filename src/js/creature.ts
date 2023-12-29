import { IDamagable, Vector, Vector2D, EventCB } from '../data';
import Sprite, {ISpriteOption} from './sprite';
import StateEventMixin from './stateEvent';


interface CreatureData extends ISpriteOption{
    path: Vector2D[],
    health?: number,
    speed?:number,
    name: string,
    radius?:number,
}

interface ICreatureEvent{
    [state.dead]: EventCB<Creature>[],
    [state.done]: EventCB<Creature>[],
    [state.alive]: EventCB<Creature>[]
}



export enum state{
    dead = 'dead',
    alive = 'alive',
    done = 'done'
}

//interface Creature extends Sprite {}



class Creature extends Sprite implements IDamagable{
    speed: number;
    health: number;
    maxHealth: number;
    
    velocity: Vector;
    movementTicks: number;
    name:string;

    path:Vector2D[];
    index: number;
    nextWaypoint!: Vector2D;

    radius: number;

    state!: state;

    constructor({name, path, speed=2, health = 5, radius = 10, ...data} : CreatureData){
        if(!data.position)
            data.position = path[0];
        super({...data});
        this.speed = speed;
        
        this.health = health;
        this.maxHealth = health;

        this.name = name;
        this.radius = data.width ?? 30;

        this.path = path;
        this.index = 0;
        this.setState(state.alive);

        this.setNextWaypoint();
        this.velocity = new Vector(0,0);
        this.movementTicks = 0;

        //this.offset.set(this.centerOffset).multi(-1);
    }

    get isAlive(){ return this.state == state.alive; }

    damage(damage: number){
        this.health -= damage;
        if(this.health <= 0 )
            return this.setState(state.dead);
    }

    setState(state:state){
        this.state = state;
        this.onStateChange();
    }

    onStateChange(){
        Creature.trigger(this.state, this);
        switch(this.state){
            case state.dead:                
                break;
            case state.alive:
                break;
            case state.done:
                break;
        }
    }

    moveTowards(){
        this.movementTicks--;
        
        if(this.movementTicks <= 0){
            return this.triggerEndMove();
        }

        this.position.sub(this.velocity);
    }

    setNextWaypoint(){
        if(this.index >= this.path.length)
            return this.setState(state.done);

        return this.nextWaypoint = this.path[this.index++];
    }

    triggerEndMove(){
        this.onMoveEnd();
        this.velocity.zero();
        this.onMoveStart();
    }

    onMoveEnd(){
        this.setNextWaypoint();
    }

    onMoveStart(){
        //setup direction velocity & get # ticks to complete
        this.velocity = this.velocity.copy(this.center);
        const length = this.velocity.sub(this.nextWaypoint.x, this.nextWaypoint.y).length;
        
        this.movementTicks = length / this.speed;
        this.velocity.normalize().multi(this.speed);
    }

    draw(){
        super.draw();
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath()
        this.ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI *2);
        this.ctx.stroke();


        //healthBar
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.position.x,   this.position.y - this.centerOffset.y, this.scaledWidth, 5)

        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(this.position.x,   this.position.y - this.centerOffset.y, this.scaledWidth * this.health / this.maxHealth, 5);
    }


    update(){
        if(this.state != state.alive)
            return;

        super.update();
        this.moveTowards();
    }

    toString(){
        let waypoint = `Waypoint:[${this.index} (${this.nextWaypoint.x}, ${this.nextWaypoint.y})]`;
        let health = `Health:[${this.health}/${this.maxHealth}]`;
        let position = `Position:${this.velocity}${this.position}`;

        return `${this.name} ${health} ${this.state}\n ${waypoint}\n ${position}`;
    }

    //---------------------------------------
    //static Event listener
    static listener: ICreatureEvent = {
        [state.dead]: [],
        [state.done]: [],
        [state.alive]: []
    };

    static trigger(state:state, obj:Creature){ Creature.listener[state].forEach(fn => fn(obj)); }
    static addEventListener(state:state, cb:EventCB<Creature>){ Creature.listener[state].push(cb); }
    static removeEventListener(state:state, cb:EventCB<Creature>){ Creature.listener[state] = Creature.listener[state].filter(fn => fn !== cb)}
}

export default Creature;