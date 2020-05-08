import {Point} from "../../interfaces/Point";
import {Base} from "../terrain/Base";
import {Renderable} from "../../interfaces/Renderable";
import {map, Map} from "../../Map";
import {colors} from "../../config.json"
import {drawRoundedSquare} from "../../tools/shapes";

let path = map.getPathFromGridCell(map.enemyBases[0].i, map.enemyBases[0].j)
if (path) {
    path = path.map(value => ({
        x: value.x * Map.TILE_SIZE + Map.TILE_SIZE / 2,
        y: value.y * Map.TILE_SIZE + Map.TILE_SIZE / 2
    }))
}

export abstract class Enemy extends Renderable implements Point {
    abstract speed: number;
    abstract life: number;
    private damageTaken: number = 0;
    private targetIndex: number = 1;
    public alive = true;
    private base: Base;
    private path: Point[] | false = false;

    constructor(base: Base) {
        super(base.center.x, base.center.y);
        this.base = base;
        this.updatePath();
    }

    updatePath() {
        this.path = this.getPath()
        this.targetIndex = 1
    }


    update() {

        if (this.path) {
            const target = this.path[this.targetIndex];

            if (target) {
                const angle = Math.atan2(target.y - this.y, target.x - this.x);
                const nearEqualX = this.x >= target.x - this.speed && this.x <= target.x + this.speed;
                const nearEqualY = this.y >= target.y - this.speed && this.y <= target.y + this.speed;

                if (!nearEqualX) {
                    this.x += Math.cos(angle) * this.speed;
                } else {
                    this.x = target.x
                }

                if (!nearEqualY) {
                    this.y += Math.sin(angle) * this.speed;
                } else {
                    this.y = target.y
                }

                if (nearEqualX && nearEqualY) {
                    this.targetIndex++;
                }
            } else {
                // TODO: deal damage to home
                this.alive = false;
            }
        }
    }

    drawHealthBar(ctx: CanvasRenderingContext2D) {
        const ratio = 1 - this.damageTaken/this.life;
        ctx.fillStyle = '#4a4a4e'
        drawRoundedSquare(ctx,this.x -10, this.y+12, 20, 3, 3)
        ctx.fill()
        ctx.fillStyle = colors.enemyBase.primary
        drawRoundedSquare(ctx,this.x -10, this.y+12, 20*ratio, 3, 3)
        ctx.fill()
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.damageTaken > 0){
            this.drawHealthBar(ctx)
        }
    }

    takeDamage(damage: number) {
        this.damageTaken += damage;

        if (this.damageTaken >= this.life) {
            this.alive = false
        }
    }

    public getPath() {
        return map.getPathFromGridCell(
            Math.floor(this.x / Map.TILE_SIZE),
            Math.floor(this.y / Map.TILE_SIZE)
        )
    }
}