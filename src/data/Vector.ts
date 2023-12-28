import {IPoints, Vector2D} from './types';

export default class Vector implements IPoints{
    components:number[] = [];
    constructor(...args : number[]){
        this.components = args;
    }

    get length(){ return Math.hypot(...this.components); }

    get x(){ return this.components[0]; }
    get y(){ return this.components[1]; }

    static convert(vector:Vector2D):number[];
    static convert(...args:number[]):number[];
    static convert(...args:any[]):number[]{
        if(typeof args[0] == 'number')
            return args;
        return [args[0].x, args[0].y];  
    }

    add(vector:Vector2D):Vector;
    add(...args:number[]):Vector;
    add(...args:any[]):Vector{
        const data = Vector.convert(...args);
        return this.update((val, i) => val + data[i]);
    }

    sub(vector:Vector2D):Vector;
    sub(...args:number[]):Vector;
    sub(...args:any[]):Vector{
        const data = Vector.convert(...args);
        return this.update((val, i) => val - data[i]);
    }

    distance(vector:Vector2D):number;
    distance(...args:number[]):number;
    distance(...args:any[]):number{
        const data = Vector.convert(...args);
        return this.map((val, i) => val - data[i]).length;
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
    
    //----------------------------------------------------------
    // set values
    set(vector:Vector2D):Vector;
    set(...args:number[]):Vector;
    set(...args:any[]):Vector{
        const data = Vector.convert(...args);
        return this.update((_, i) => data[i]);
    }

    zero():Vector{
        return this.set(0);
    }

    //----------------------------------------------------------
    // Duplicate 
    clone():Vector{
        return new Vector(...this.components);
    }

    copy(data:Vector){
        this.components = [...data.components];
        return this;
    }

    //----------------------------------------------------------
    // Iterators
    map(cb:(val:number, index:number) => number):Vector{
        return new Vector(...this.components.map(cb));
    }

    update(cb:(val:number, index:number) => number):Vector{
        this.components = this.components.map(cb);
        return this;
    }

    toString(){ return this.components.map(i => i.toFixed(0)).join(); }
}