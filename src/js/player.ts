import { IDamagable } from "../data";

export interface IPlayerOption{
    health: number,
}

enum PlayerState{
    alive = 'alive',
    dead = 'dead'
}

export default class Player implements IDamagable{
    health: number;
    maxHealth: number;
    state: PlayerState;

    constructor({health = 10}){
        this.health = health;
        this.maxHealth = health;

        this.state = PlayerState.alive;
    }
    
    get isAlive(){ return this.state == PlayerState.alive; }

    setState(state:PlayerState){
        this.state = state;
    }

    damage(damage: number){
        this.health -= damage;
        if(this.health <= 0 )
            return this.setState(PlayerState.dead);
    }

    toString(){
        return `${this.health} / ${this.maxHealth} ${this.state}`;
    }
}