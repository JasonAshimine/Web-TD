import { IDamagable, Vector, Vector2D, EventCB } from './data';
import Sprite, {ISpriteOption} from './sprite';


interface CreatureData extends ISpriteOption{
    path: Vector2D[],
    health?: number,
    speed?:number,
    name: string,
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

export default class Creature extends Sprite implements IDamagable{
    speed: number;
    health: number;
    
    movement: Vector;
    movementTicks: number;
    name:string;

    path:Vector2D[];
    index: number;
    nextWaypoint!: Vector2D;

    state!: state;

    constructor({name, path, speed=2, health = 5, ...data} : CreatureData){
        if(!data.position)
            data.position = path[0];
        super({...data});
        this.speed = speed;
        this.health = health;
        this.name = name;

        this.path = path;
        this.index = 0;
        this.setState(state.alive);

        this.setNextWaypoint();
        this.movement = new Vector(0,0);
        this.movementTicks = 0;
    }

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

        this.position.add(...this.movement.components);
    }

    setNextWaypoint(){
        if(this.index >= this.path.length)
            return this.setState(state.done);

        return this.nextWaypoint = this.path[this.index++];
    }

    triggerEndMove(){
        this.onMoveEnd();
        this.movement.zero();
        this.onMoveStart();
    }

    onMoveEnd(){
        this.setNextWaypoint();
    }

    onMoveStart(){
        //setup direction velocity & get # ticks to complete
        this.movement = this.movement.copy(this.position);
        const length = this.movement.sub(this.nextWaypoint.x, this.nextWaypoint.y).length;
        
        this.movementTicks = length / this.speed;
        this.movement.normalize().multi(this.speed);
    }

    update(){
        if(this.state != state.alive)
            return;

        super.update();
        this.ctx.fillRect(this.nextWaypoint.x, this.nextWaypoint.y, 5, 5);
        this.moveTowards();
    }

    toString(){
        let waypoint = `(${this.nextWaypoint.x}, ${this.nextWaypoint.y})`

        return `${this.state} ${this.index} ${waypoint}`;
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