import { Vector, Vector2D } from "../data";
import Manager from "./manager";

export type TileID = string;

export interface ITileOption {
    position:Vector2D,
    isBuildable: boolean,
    id:TileID,
}

export default class Tile{
    static width = 16;
    static height = 16;
    static color = 'rgba(0, 0, 255, 0.4)';
    static hoverColor = 'rgba(0, 0, 255, 0.7)';

    position:Vector;
    worldPos:Vector2D;
    isBuildable: boolean;

    id:TileID;

    constructor({position, isBuildable, id}: ITileOption){
        this.position = new Vector(position);
        this.worldPos = {
            x: position.x * Tile.width, 
            y: position.y * Tile.height
        };
        this.isBuildable = isBuildable;

        this.id = id;
    }

    draw(color = Tile.color){
        if(!this.isBuildable) return;
        Manager.ctx.fillStyle = color;
        Manager.ctx.fillRect(this.worldPos.x, this.worldPos.y, Tile.width, Tile.height);
    }

    update(buildArea:TileID[] | null){
        if(buildArea)
            this.draw(buildArea.includes(this.id) ? Tile.hoverColor : Tile.color);
    }

    static genId(x: number, y: number):TileID{return `${x}.${y}`;}
}