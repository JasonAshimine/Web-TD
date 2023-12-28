export interface Vector2D{
    x: number,
    y: number
}

export interface IDim {
    width: number;
    height: number;
}


export interface IPoints{
    components:number[];
}

interface IImage{
    src:string,
}


export interface ISpriteSheet extends IImage{
    sprites: Sprites
}


interface Sprites {
    [key: string]: ISpriteData;
}
  

export interface ISpriteData extends IDim{
    name: string,
    spriteOffset: Vector2D,
    numFrames: number
}

export interface IMapData extends IImage{
    path: Vector2D[],
}


export interface IDamagable {
    health?: number,
    damage: (v:number) => void
}

export type EventCB<T> = (obj:T) => void;

