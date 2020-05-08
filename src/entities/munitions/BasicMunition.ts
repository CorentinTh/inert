import {Munition} from "./Munition";
import {PI2} from "../../tools/constants";

export class BasicMunition extends Munition{
    speed: number = 6;
    private radius = 5

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.emitter.colors.primary
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, PI2);
        ctx.fill()
    }

}
