import { IContext, IDim, IMapData, Vector, Vector2D } from "../data";
import Tile, { TileID } from "./tile";


export interface IMapDataOption extends IContext, IDim{
    mapData:IMapData
}

export default class Level{
    path:Vector2D[];
    tiles:Tile[][];
    buildable: Tile[];
    ctx: CanvasRenderingContext2D;
    width:number;
    height:number;

    mouse: Vector;
    buildPos?: Vector2D;
    buildTiles?: TileID[];

    constructor({ctx, mapData, width, height}: IMapDataOption){
        this.ctx = ctx;

        this.path = mapData.path;
        let res = Level.parseMap(mapData);

        this.tiles = res.tiles;
        this.buildable = res.buildable;

        let mapImage = new Image();
        mapImage.src = mapData.src;

        this.width = width;
        this.height = height;

        mapImage.onload = () => {
            ctx.drawImage(mapImage,0,0);
            this.width = width ?? mapImage.width;
            this.height = height ?? mapImage.height;
        };

        this.mouse = new Vector(-1, -1);

        window.addEventListener('mousemove', (event:MouseEvent) => {
            this.setMouse(event.clientX , event.clientY)
        });
    }

    setMouse(x: number, y: number){
        this.mouse.set(Math.floor(x / Tile.width), Math.floor(y / Tile.height))
    }

    isBuildable(size:IDim){ return Array.isArray(this.canBuild(size)); }

    isBuildableTile(position:Vector2D):boolean{
        const col = this.tiles[position.x];
        if(!col) return false;
        return col[position.y]?.isBuildable; 
    }

    canBuild(dim:IDim){ 
        const getStart = (val:number) => Math.ceil((val-1)/2);

        this.buildPos = undefined;
        const start = {
            x: this.mouse.x - getStart(dim.width),
            y: this.mouse.y - getStart(dim.height)
        };

        const end = {
            x: start.x + dim.width,
            y: start.y + dim.height
        };
        
        const list = [];

        for(let x = start.x; x < end.x; x++)
            for(let y = start.y; y < end.y; y++)
                if(!this.isBuildableTile({x,y}))
                    return null;
                else
                    list.push(Tile.genId(x,y));

        this.buildPos = Level.gridToWorldPos(start);

        return list;        
    }

    update(size = {width: 3, height: 3 }){
        let buildArea = this.canBuild(size);
        
        this.buildable.forEach(i => i.update(buildArea));
    }

    static gridToWorldPos(vector:Vector2D){
        return {x: vector.x * Tile.width, y: vector.y * Tile.height };
    }

    static genTile(val:number, x: number, y: number){
        let isBuildable = val == 0;

        return new Tile({
            id:Tile.genId(x,y),
            position:{x,y},
            isBuildable
        });
    }

    static parseMap(map:IMapData){
        let buildable:Tile[] = [];

        const genTile = (v: number,x: number,y: number) => {
            let tile = Level.genTile(v,x,y);
            if(tile.isBuildable)
                buildable.push(tile);
            return tile;
        }

        let tiles = [];
        for(let y = 0; y < map.height; y++){
            let start = y * map.width;
            tiles.push(
                map.placement
                .slice(start, start + map.width)
                .map((v,x) => genTile(v, x, y))
            )
        }

        return {buildable, tiles};
    }
}