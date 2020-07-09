import {BasicBulletMunition} from "./BasicBulletMunition";

export class SniperBulletMunition extends BasicBulletMunition {
    private counter = 2;

    update() {
        if (--this.counter <= 0) {
            this.alive = false;
            this.dealDamage()
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.emitter.colors.primary
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.moveTo(this.emitter.center.x, this.emitter.center.y);
        ctx.lineTo(this.target.x, this.target.y);
        ctx.stroke()

        // ctx.save()
        // ctx.globalAlpha = 0.5
        //
        // ctx.translate(this.x, this.y)
        // ctx.rotate(this.angle);
        // ctx.translate(-this.x, -this.y)
        //
        // ctx.beginPath();
        //
        // ctx.moveTo(this.x - 30, this.y);
        // ctx.lineTo(this.x + 30, this.y);
        //
        // // ctx.stroke()
        // // ctx.restore();
    }
}
