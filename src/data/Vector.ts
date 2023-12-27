import {points} from './types';

export default class Vector implements points{
    components:number[] = [];
    constructor(...args : number[]){
        this.components = args;
    }

    get length(){ return Math.hypot(...this.components); }

    get x(){ return this.components[0]; }
    get y(){ return this.components[1]; }

    add(...args:number[]):Vector{
        return this.update((val, i) => args[i] + val);
    }

    sub(...args:number[]):Vector {

        return this.update((val, i) => args[i] - val);
    }

    multi(value:number):Vector{
        return this.update((val) => value * val);
    }

    normalize():Vector{
        return this.multi(1 / this.length);
    }

    normalMult(value:number):Vector{
        return this.normalize().multi(value);
    }

    set(...args:number[]){
        return this.update((val, i) => args[i]);
    }

    zero():Vector{
        return this.multi(0);
    }

    clone():Vector{
        return new Vector(...this.components);
    }

    copy(data:Vector){
        this.components = [...data.components];
        return this;
    }

    distance(...args:number[]){
        return this.map((val, i) => args[i] - val).length;
    }

    map(cb:(val:number, index:number) => number):Vector{
        return new Vector(...this.components.map(cb));
    }

    update(cb:(val:number, index:number) => number):Vector{
        this.components = this.components.map(cb);
        return this;
    }

    toString(){ return this.components.join(); }
}