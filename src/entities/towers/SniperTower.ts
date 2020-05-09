import {Tower} from "./Tower";
import {Enemy} from "../enemies/Enemy";

export class SniperTower extends Tower {
    public name = 'Sniper';
    aimRadius: number = 100;
    cost: number = 200;
    colors = {primary: '#f39c12', secondary: '#f1c40f'};
    damage: number = 100;
    reloadDurationMs: number = 1000;

    target: Enemy | undefined;

    shoot(): void {
    }

    draw(ctx: CanvasRenderingContext2D) {
        const x = this.x;
        const y = this.y;
        const width = this.width;
        const height = this.width;
        const radius = 3;

        ctx.fillStyle = this.colors.primary
        ctx.strokeStyle = this.colors.secondary
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.moveTo(x + 3, y + 3);
        ctx.lineTo(x + width - 3, y + 3);
        ctx.lineTo(x + width / 2+5, y + width - 12);
        ctx.lineTo(x + width / 2-5, y + width - 12);
        ctx.closePath()
        ctx.rect(x + width / 2-2,y + width - 12, 4, 5)

        ctx.fill()
        ctx.stroke()
    }
}