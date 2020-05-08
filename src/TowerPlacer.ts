import {Tower} from "./entities/towers/Tower";
import {SimpleTower} from "./entities/towers/SimpleTower";
import {map, Map} from "./Map";
import {Renderable} from "./interfaces/Renderable";
import {controls} from "./Controls";
import {ctx} from "./Canvas";
import {GridRenderable} from "./interfaces/GridRenderable";

class TowerPlacer extends Renderable {
    public tower: Tower = new SimpleTower(0, 0, Map.TILE_SIZE);
    public placing = true;
    private j: number = 0;
    private i: number = 0;
    private placementCache: { [k: string]: boolean } = {}

    constructor() {
        super();

        controls.on('click', () => {
            if (this.placing && this.canBePlaced()) {
                map.addElement(this.i, this.j, <new (...args: any[]) => GridRenderable>this.tower.constructor);
                this.invalidatePlacementCache()
            }
        })

        controls.on('keydown:ESCAPE', () => {
            if (this.placing){
                this.placing = false;
            }
        })
    }

    draw(): void {
        if (this.placing) {
            this.tower.draw();
            this.tower.drawAimingRadius()

            if (!this.canBePlaced()) {
                ctx.strokeStyle = 'red'
                ctx.beginPath();
                ctx.moveTo(this.x + Map.TILE_SIZE / 2 - 10, this.y + Map.TILE_SIZE / 2 - 10);
                ctx.lineTo(this.x + Map.TILE_SIZE / 2 + 10, this.y + Map.TILE_SIZE / 2 + 10);
                ctx.moveTo(this.x + Map.TILE_SIZE / 2 + 10, this.y + Map.TILE_SIZE / 2 - 10);
                ctx.lineTo(this.x + Map.TILE_SIZE / 2 - 10, this.y + Map.TILE_SIZE / 2 + 10);
                ctx.stroke();
            }
        }
    }

    update(): void {
        if (this.placing) {
            this.i = Math.min(Math.floor(controls.mouse.x / Map.TILE_SIZE), map.grid.length-1);
            this.j = Math.min(Math.floor(controls.mouse.y / Map.TILE_SIZE), map.grid[0].length-1);
            this.x = this.i * Map.TILE_SIZE
            this.y = this.j * Map.TILE_SIZE

            this.tower.setCoordinates(this.x, this.y)
        }
    }

    canBePlaced() {
        const key = `${this.i}-${this.j}`;
        const fromCache = this.placementCache[key];

        if (fromCache !== undefined) {
            return fromCache;
        } else {
            return /*this.placementCache[key] =*/ map.canBePlaced(this.i, this.j);
        }
    }

    invalidatePlacementCache() {
        this.placementCache = {};
    }
}

export const towerPlacer = new TowerPlacer();
