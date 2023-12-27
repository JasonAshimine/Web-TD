export interface Vector2D{
    x: number,
    y: number
}

export interface Dim {
    width: number;
    height: number;
}


export interface points{
    components:number[];
}


export interface ISpriteData extends Dim{
    name: string,
    spriteOffset: Vector2D,
    numFrames: number
}

export interface IMapData{
    src:string,
    path: Vector2D[],
}


export interface IDamagable {
    health?: number,
    damage: (v:number) => void
}

export type EventCB<T> = (obj:T) => void;

