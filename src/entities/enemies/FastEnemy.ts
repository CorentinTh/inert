import {Enemy} from "./Enemy";
import {PI2} from "../../tools/constants";
import {colors} from "../../config.json"

export class FastEnemy extends Enemy {
    life: number = 200;
    speed: number = 4;
    cash: number = 20;
    radius = 8

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);

        ctx.fillStyle = colors.enemyBase.primary
        ctx.strokeStyle = "#42b0e5"
        ctx.lineWidth = 3
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, PI2);
        ctx.fill()
        ctx.stroke()
    }

    update(): void {
        super.update()
    }

}