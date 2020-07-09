import {Munition} from "./Munition";
import {fps} from "../../config.json";

const frameDuration = 1000 / fps;

export class LaserMunition extends Munition {
    charge: number = 0;

    getDamage(ratio: number) {
        const {max, min} = <{ min: number, max: number }>this.emitter.damage

        return ((max - min) * ratio + min) / (this.emitter.reloadDurationMs / frameDuration);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = 'red'
        ctx.lineWidth = 2 + 2 * this.charge
        ctx.shadowColor = 'red'
        ctx.shadowBlur = 3 + 5 * this.charge
        ctx.globalAlpha = this.charge + 0.1
        ctx.beginPath();
        ctx.moveTo(this.emitter.center.x, this.emitter.center.y)
        ctx.lineTo(this.target.x, this.target.y);
        ctx.stroke();
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
    }

    update(): void {
        if (this.target.alive && this.emitter.targetInRange) {
            this.charge = Math.min(1, this.charge + 0.01);

            this.target.takeDamage(this.getDamage(this.charge));
        } else {
            this.alive = false;
        }
    }

}