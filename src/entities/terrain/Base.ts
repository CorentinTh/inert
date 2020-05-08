import {GridRenderable} from "../../interfaces/GridRenderable";
import {drawRoundedSquare} from "../../tools/shapes";
import {canvas} from "../../Canvas";
import {colors} from "../../config.json";

const ctx = canvas.getCtx();

export class Base extends GridRenderable {
    private colors: { primary: string; secondary: string };
    public traversable = true;

    constructor(x: number, y: number, width: number, isHome = false) {
        super(x, y, width);
        this.colors = isHome ? colors.homeBase : colors.enemyBase;
    }

    draw(): void {
        ctx.fillStyle = this.colors.primary
        ctx.strokeStyle = this.colors.secondary

        ctx.lineWidth = 8;
        drawRoundedSquare(ctx, this.x + 5, this.y + 5, this.width - 10, this.width - 10, 5);
        ctx.stroke();
        ctx.fill();
    }
}