import {Enemy} from "./Enemy";
import {PI2} from "../../tools/constants";
import {colors} from "../../config.json"

export class ArmoredEnemy extends Enemy {
    life: number = 200;
    speed: number = 2.5;
    cash: number = 10;
    radius = 8

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);

        ctx.fillStyle = colors.enemyBase.primary
        ctx.strokeStyle = colors.enemyBase.secondary
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