import {Enemy} from "./Enemy";
import {PI2} from "../../tools/constants";
import {ctx} from "../../Canvas";
import {colors} from "../../config.json"


export class SimpleEnemy extends Enemy{
    life: number = 50;
    speed: number = 2.5;
    private radius = 8

    draw(): void {
        super.draw();

        ctx.fillStyle = colors.enemyBase.primary
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, PI2);
        ctx.fill()
    }

    update(): void {
        super.update()
    }

}