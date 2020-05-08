import {SimpleTower} from "./entities/towers/SimpleTower";
import {Base} from "./entities/terrain/Base";
import {GridRenderable} from "./interfaces/GridRenderable";
import {Rock} from "./entities/terrain/Rock";
import {Point} from "./interfaces/Point";
import {easyAStar} from "./tools/astar";
import {randIndex} from "./tools/helphers";
import {enemyManager} from "./EnemyManager";
import {EventEmitter} from "./tools/EventEmitter";
import {FastTower} from "./entities/towers/FastTower";

class Map extends EventEmitter{
    public grid: (GridRenderable | 0 |1)[][] = new Array(40).fill(0).map(() => new Array(20).fill(0));
    public static TILE_SIZE: number = 40;
    public homeBase: Base;
    public enemyBases: Base[] = [];
    private pathsCache: { [k: string]: Point[] | false } = {}

    constructor() {
        super();
        this.addElement(9, 11, SimpleTower)
        this.addElement(9, 12, FastTower)
        this.addElement(18, 3, SimpleTower)

        this.homeBase = this.addBase(10, 15, true);
        this.enemyBases.push(
            this.addBase(20, 3)
        )

        for (let i = 0; i < 40; i++) {
            this.addElement(randIndex(this.grid), randIndex(this.grid[0]), Rock)
        }
    }

    draw(ctx: CanvasRenderingContext2D) {

        ctx.strokeStyle = "#eeeeee06";
        ctx.lineWidth = 1;

        for (let x = 0; x < this.grid.length; ++x) {
            for (let y = 0; y < this.grid[x].length; ++y) {
                const element = this.grid[x][y];
                if (element !== 0 && element !== 1) {
                    element.draw(ctx);
                    ctx.strokeStyle = "#eeeeee06";
                    ctx.lineWidth = 1;
                } else {
                    ctx.strokeRect(x * Map.TILE_SIZE, y * Map.TILE_SIZE, Map.TILE_SIZE, Map.TILE_SIZE)
                }
            }
        }

    }

    pathFind(i: number, j: number) {
        return easyAStar(
            (x, y) => {
                return this.grid[x] && this.grid[x][y] !== undefined && (this.grid[x][y] === 0 || (<GridRenderable>this.grid[x][y]).traversable)
            },
            {x: i, y: j},
            {
                x: this.homeBase.i,
                y: this.homeBase.j
            }
        )
    }

    getPathFromGridCell(i: number, j: number) {
        const key = `${i}-${j}`;
        const fromCache = this.pathsCache[key];

        if (fromCache !== undefined) {
            return fromCache;
        } else {
            let path = this.pathFind(i, j);

            if (path) {
                path = path.map(value => ({
                    x: value.x * Map.TILE_SIZE + Map.TILE_SIZE / 2,
                    y: value.y * Map.TILE_SIZE + Map.TILE_SIZE / 2
                }));
            }

            return this.pathsCache[key] = path;
        }
    }

    invalidatePathsCache() {
        this.pathsCache = {};
    }

    addElement(i: number, j: number, elementClass: new (...args: any[]) => GridRenderable): boolean {
        if (this.canBePlaced(i, j)) {
            this.grid[i][j] = new elementClass(i, j, Map.TILE_SIZE);
            this.invalidatePathsCache();
            this.emit('added');
            return true;
        }
        return false;
    }

    addBase(i: number, j: number, isHome = false): Base {
        const base = new Base(i, j, Map.TILE_SIZE, isHome);
        this.grid[i][j] = base;
        return base;
    }

    canBePlaced(i: number, j: number) {
        if(this.grid[i][j] === 0){
            this.grid[i][j] = 1;
            const canBePlaced = this.enemyBases.every(base => this.pathFind(base.i, base.j)) && enemyManager.canAllReachBase();
            this.grid[i][j] = 0;
            return canBePlaced;
        }else{
            return false
        }
    }

    update() {
        this.grid.forEach(row => row.forEach(el => {
            if (el !== 0 && el !== 1) {
                el.update()
            }
        }))
    }

    canvasCoordinateToGridIndex(n: number) {
        return Math.floor(n / Map.TILE_SIZE);
    }
}

const map = new Map();
export {
    map,
    Map
}