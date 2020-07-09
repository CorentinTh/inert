import {Enemy} from "./Enemy";
import {colors} from "../../config.json"
import {Map} from "../../Map";
import {drawPolygon} from "../../tools/shapes";
import {Base} from "../terrain/Base";


export class BossEnemy extends Enemy {
    life: number = 2000;
    speed: number = 2.5;
    cash: number = 100;
    radius = Map.TILE_SIZE * 0.4


    constructor(base: Base) {
        super(base);

        this.healthBar.yOffset = 22
    }

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);

        ctx.strokeStyle = colors.enemyBase.primary
        ctx.fillStyle = '#222'
        ctx.lineWidth = 6
        drawPolygon(ctx, this.x, this.y, 8, this.radius)
        ctx.fill()
        ctx.stroke()
    }

    update(): void {
        super.update()
    }


}