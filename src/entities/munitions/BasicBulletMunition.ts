import {Munition} from "./Munition";
import {PI2} from "../../tools/constants";

export class BasicBulletMunition extends Munition {
    speed: number = 6;
    protected radius = 5
    protected angle: number = 0;

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.emitter.colors.primary
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, PI2);
        ctx.fill()
    }

    update() {
        if (this.target.alive) {
            this.angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
            const nearEqualX = this.x >= this.target.x - this.speed && this.x <= this.target.x + this.speed;
            const nearEqualY = this.y >= this.target.y - this.speed && this.y <= this.target.y + this.speed;

            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;

            if (nearEqualX && nearEqualY) {
                this.alive = false;
                this.dealDamage()
            }
        } else {
            this.alive = false;
        }
    }

    dealDamage() {
        if (typeof this.emitter.damage !== 'object') {
            this.target.takeDamage(this.emitter.damage);
        }
    }
}
