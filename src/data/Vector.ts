import {IPoints, Vector2D} from './types';

export default class Vector implements IPoints{
    components:number[] = [];

    constructor(vector:Vector2D);
    constructor(...args : number[]);
    constructor(...args :any[]){
        this.components = Vector.convert(...args);
    }

    get length(){ return Math.hypot(...this.components); }

    get x(){ return this.components[0]; }
    get y(){ return this.components[1]; }

    set x(val){ this.components[0] = val;}
    set y(val){ this.components[1] = val;}

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

    moveTowards(vector:Vector){
        return this.sub(vector).normalize();
    }

    //----------------------------------------------------------
    // Eval
    equals(vector:Vector2D):boolean;
    equals(...args:number[]):boolean;
    equals(...args:any[]):boolean{
        let data = Vector.convert(...args);
        return this.every(Vector.convert(...args), (a, b) => a == b);
    }

    isLess(vector:Vector2D):boolean;
    isLess(...args:number[]):boolean;
    isLess(...args:any[]):boolean{
        return this.every(Vector.convert(...args), (a, b) => a < b);
    }
    
    isGreater(vector:Vector2D):boolean;
    isGreater(...args:number[]):boolean;
    isGreater(...args:any[]):boolean{
        return this.every(Vector.convert(...args), (a, b) => a < b);
    }


    isLte(vector:Vector2D):boolean;
    isLte(...args:number[]):boolean;
    isLte(...args:any[]):boolean{
        return this.every(Vector.convert(...args), (a, b) => a <= b);
    }
    
    isGte(vector:Vector2D):boolean;
    isGte(...args:number[]):boolean;
    isGte(...args:any[]):boolean{
        return this.every(Vector.convert(...args), (a, b) => a <= b);
    }

    isBetween(min:Vector2D, max:Vector2D){
        return this.isLess(max) && this.isGreater(min);
    }
    
    isBetweenEqual(min:Vector2D, max:Vector2D){ return this.isLte(max) && this.isGte(min); }
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

    every(data: number[], cb:(val:number, data:number) => boolean){
        return this.components.every((v, i) => cb(v, data[i]));
    }

    test(cb:(val:number, data:number) => boolean, ...args:number[]):boolean;
    test(cb:(val:number, data:number) => boolean, vector:Vector2D):boolean;
    test(cb:(val:number, data:number) => boolean, ...args:any[]){
        const data = Vector.convert(...args);
        return this.components.every((v, i) => cb(v, data[i]));
    }

    toString(){ return this.components.map(i => i.toFixed(0)).join(); }
}