import {Map} from "./Map";
import {canvas} from "./Canvas";
import {controls} from "./Controls";
import {towerPlacer} from "./TowerPlacer";

export class Camera {
    x: number = Map.TILE_SIZE * Map.GRID_W / 2;
    y: number = Map.TILE_SIZE * Map.GRID_H / 2;
    scaleRatio: number = 0.82;
    static DELTA_MOVE: number = 100;
    static SCALE_FACTOR: number = 0.1;
    scaleCenter = {
        x: -this.x + canvas.getElement().width / 2,
        y: -this.y + canvas.getElement().height / 2
    }
    private dragging: boolean = false;
    private dragStartCoordinates = {x: 0, y: 0};
    private dragDeltaDistances = {x: 0, y: 0};

    constructor() {
        controls.on('keydown:ARROWUP', () => this.move(0, -Camera.DELTA_MOVE))
        controls.on('keydown:ARROWDOWN', () => this.move(0, Camera.DELTA_MOVE))
        controls.on('keydown:ARROWRIGHT', () => this.move(Camera.DELTA_MOVE, 0))
        controls.on('keydown:ARROWLEFT', () => this.move(-Camera.DELTA_MOVE, 0))
        controls.on('wheel:up', () => this.scale(1 + Camera.SCALE_FACTOR))
        controls.on('wheel:down', () => this.scale(1 - Camera.SCALE_FACTOR))
        controls.on('mousedown', () => {
            if (!towerPlacer.placing) {
                this.dragging = true;
                this.dragStartCoordinates = controls.mouse;
            }
        })
        controls.on('mouseup', () => {
            this.dragging = false;
            this.move(-this.dragDeltaDistances.x, -this.dragDeltaDistances.y)
            this.dragDeltaDistances = {x: 0, y: 0}
        })
    }

    update(): void {
        if (this.dragging) {
            this.dragDeltaDistances = {
                x: (controls.mouse.x - this.dragStartCoordinates.x) / this.scaleRatio,
                y: (controls.mouse.y - this.dragStartCoordinates.y) / this.scaleRatio
            }
        }
    }

    process(ctx: CanvasRenderingContext2D): void {
        ctx.translate(canvas.getElement().width / 2, canvas.getElement().height / 2)
        ctx.scale(this.scaleRatio, this.scaleRatio)
        ctx.translate(-this.x + this.dragDeltaDistances.x, -this.y + this.dragDeltaDistances.y);

        canvas.updateTransformMatrix();
    }

    private move(dx: number, dy: number) {
        this.x = Math.min(Math.max(this.x + dx, 0), Map.TILE_SIZE * Map.GRID_W);
        this.y = Math.min(Math.max(this.y + dy, 0), Map.TILE_SIZE * Map.GRID_H);
    }

    private scale(factor: number) {
        this.scaleRatio *= factor;
        this.scaleCenter = {...controls.mouse};
    }

}

export const camera = new Camera();