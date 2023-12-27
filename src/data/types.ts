export interface Vector2D{
    x: number,
    y: number
}

export interface Dim {
    width: number;
    height: number;
}


interface points{
    components:number[];
}


export class Vector implements points{
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

    map(cb:(val:number, index:number) => number):Vector{
        return new Vector(...this.components.map(cb));
    }

    update(cb:(val:number, index:number) => number):Vector{
        this.components = this.components.map(cb);
        return this;
    }
}