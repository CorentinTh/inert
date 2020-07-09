import {Base} from "./entities/terrain/Base";
import {GridRenderable} from "./interfaces/GridRenderable";
import {Rock} from "./entities/terrain/Rock";
import {Point} from "./interfaces/Point";
import {easyAStar} from "./tools/astar";
import {randIndex} from "./tools/helphers";
import {enemyManager} from "./EnemyManager";
import {EventEmitter} from "./tools/EventEmitter";

class Map extends EventEmitter {
    public grid: (GridRenderable | 0 | 1)[][] = new Array(100).fill(0).map(() => new Array(40).fill(0));
    public static TILE_SIZE: number = 40;
    public homeBase: Base;
    public enemyBases: Base[] = [];
    private pathsCache: { [k: string]: Point[] | false } = {}

    constructor() {
        super();
        // this.addElement(9, 11, SniperTower)
        // this.addElement(9, 12, GatlingTower)
        // this.addElement(18, 3, SniperTower)

        this.homeBase = this.addBase(10, 20, true);
        this.enemyBases.push(
            this.addBase(20, 3)
        )

        for (let i = 0; i < 120; i++) {
            this.addElement(randIndex(this.grid), randIndex(this.grid[0]), Rock)
        }
    }
    drawGrid(ctx: CanvasRenderingContext2D){
        ctx.strokeStyle = "#25272b";
        ctx.lineWidth = 1;

        const gridWidth = this.grid.length * Map.TILE_SIZE;
        const gridHeight = this.grid[0].length * Map.TILE_SIZE;

        ctx.beginPath()
        for (let x = 0; x < this.grid.length; ++x) {
            ctx.moveTo(x * Map.TILE_SIZE, 0);
            ctx.lineTo(x * Map.TILE_SIZE, gridHeight);
        }
        for (let y = 0; y < this.grid[0].length; ++y) {
            ctx.moveTo(0, y * Map.TILE_SIZE);
            ctx.lineTo(gridWidth, y * Map.TILE_SIZE);
        }
        ctx.closePath()
        ctx.stroke();
    }

    draw(ctx: CanvasRenderingContext2D) {

        for (let x = 0; x < this.grid.length; ++x) {
            for (let y = 0; y < this.grid[x].length; ++y) {
                const element = this.grid[x][y];

                if (element instanceof GridRenderable) {
                    element.draw(ctx);
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
        if (this.grid[i][j] === 0) {
            this.grid[i][j] = 1;
            const canBePlaced = this.enemyBases.every(base => this.pathFind(base.i, base.j)) && enemyManager.canAllReachBase();
            this.grid[i][j] = 0;
            return canBePlaced;
        } else {
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