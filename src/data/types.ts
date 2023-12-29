export interface Vector2D{
    x: number,
    y: number
}

export interface IDim {
    width: number;
    height: number;
}


export interface IPoints{ components:number[]; }
export interface IPosition{ position:Vector2D; }
export interface IContext{ ctx:CanvasRenderingContext2D }

export interface IHealth{
    health:number;
    maxHealth:number;
}

interface IImage{
    src:string,
}

interface JSON<T>{
    [key:string]:T
}

export interface ISpriteSheet extends IImage{
    sprites: JSON<ISpriteData>
}



export interface ISpriteData extends IDim{
    name: string,
    spriteOffset: Vector2D,
    numFrames: number
}


export interface IBuildingJSON {
    tower:JSON<IBuildingData>,
    projectile:JSON<IProjectileData>
}

interface IProjectileData extends IWeapon{
    speed:number,
    radius:number,
}

interface IWeapon{
    fireRate:number,
    damage:number,
}


export interface IBuildingData extends ISpriteData, IWeapon{
    cost:number,
    radius: number,
    size:IDim,
    sprite: string,
    delay:number,
}


export interface IMapData extends IImage, IDim{
    path: Vector2D[],
    placement: number[]
}


export interface IDamagable extends IHealth{
    damage: (v:number) => void
}

export type EventCB<T> = (obj:T) => void;

export interface ISpriteBase{
    image: HTMLImageElement,
    ctx: CanvasRenderingContext2D,
}



export function applyMixins(derivedCtor: any, constructors: any[]) {
    constructors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
            Object.create(null)
        );
      });
    });
  }