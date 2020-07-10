import {Tower} from "./entities/towers/Tower";
import {CanonTower} from "./entities/towers/CanonTower";
import {map, Map} from "./Map";
import {Renderable} from "./interfaces/Renderable";
import {controls} from "./Controls";
import {GridRenderable} from "./interfaces/GridRenderable";
import {interfaceManager} from "./InterfaceManager";
import {cashManager} from "./CashManager";
import {canvas} from "./Canvas";

class TowerPlacer extends Renderable {
    public tower: Tower = new CanonTower(0, 0, Map.TILE_SIZE);
    public placing = false;
    private j: number = 0;
    private i: number = 0;
    private shouldBeDrawn = false;

    constructor() {
        super();

        controls.on('click', () => {
            if (this.placing && this.canBePlaced()) {
                if (cashManager.canWithdraw(this.tower.cost)) {
                    cashManager.withdraw(this.tower.cost)
                    map.addElement(this.i, this.j, <new (...args: any[]) => GridRenderable>this.tower.constructor);
                } else {
                    interfaceManager.snackbar.toast('You don\'t have enought money to buy this tower');
                }
            }
        })

        controls.on('keydown:ESCAPE', () => {
            if (this.placing) {
                this.placing = false;
            }
        })
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.placing && this.shouldBeDrawn) {
            this.tower.draw(ctx);
            this.tower.drawAimingRadius(ctx)

            if (!this.canBePlaced()) {
                ctx.strokeStyle = 'red'
                ctx.lineWidth = 4;
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
            this.shouldBeDrawn = false;

            const mouse = canvas.transformMatrix!.inverse().transformPoint(controls.mouse)

            this.i = Math.floor(mouse.x / Map.TILE_SIZE);
            this.j = Math.floor(mouse.y / Map.TILE_SIZE);

            if (this.isMouseOverGrid()) {
                this.x = this.i * Map.TILE_SIZE
                this.y = this.j * Map.TILE_SIZE
                this.tower.setCoordinates(this.x, this.y)

                this.shouldBeDrawn = true;
            }
        }
    }

    isMouseOverGrid() {
        return controls.mouseInCanvas && this.i >= 0 && this.i < map.grid.length && this.j >= 0 && this.j < map.grid[0].length
    }

    canBePlaced() {
        return this.isMouseOverGrid() && map.canBePlaced(this.i, this.j);
    }

    place(TowerClass: new (...args: any[]) => Tower) {
        this.shouldBeDrawn = false;
        this.placing = true;

        this.tower = new TowerClass(0, 0, Map.TILE_SIZE);
    }
}

export const towerPlacer = new TowerPlacer();
