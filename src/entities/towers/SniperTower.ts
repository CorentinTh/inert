import {Tower} from "./Tower";
import {Enemy} from "../enemies/Enemy";
import {drawPolygon} from "../../tools/shapes";
import {munitionManager} from "../../MunitionManager";
import {SniperBulletMunition} from "../munitions/SniperBulletMunition";

export class SniperTower extends Tower {
    public name = 'Sniper';
    aimRadius: number = 250;
    cost: number = 350;
    colors = {primary: '#f39c12', secondary: '#f1c40f'};
    damage: number = 300;
    reloadDurationMs: number = 3000;
    description: string = "Huge range, huge damages, but slow reload.";
    target: Enemy | undefined;
    radius: number = this.halfWidth * 0.9
    private angle: number = 0;

    update() {
        super.update();

        if (this.target) {
            this.angle = Math.atan2(this.target.y - this.center.y, this.target.x - this.center.x);
        }
    }

    shoot(): void {
        if (this.target) {
            const munition = new SniperBulletMunition(this.target, this);
            munitionManager.add(munition)
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.colors.primary
        ctx.strokeStyle = this.colors.secondary
        ctx.lineJoin = 'round';

        ctx.save();
        ctx.translate(this.center.x, this.center.y)
        ctx.rotate(this.angle);
        ctx.translate(-this.center.x, -this.center.y)

        ctx.beginPath()
        ctx.lineWidth = 8;
        ctx.moveTo(this.center.x, this.center.y);
        ctx.lineTo(this.center.x + 25, this.center.y)
        ctx.stroke()

        ctx.lineWidth = 4;

        drawPolygon(ctx, this.center.x, this.center.y, 5, this.radius)
        ctx.fill()
        ctx.stroke()

        ctx.restore()

        super.draw(ctx);
    }

}