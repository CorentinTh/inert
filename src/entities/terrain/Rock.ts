import {GridRenderable} from "../../interfaces/GridRenderable";
import {drawRoundedSquare} from "../../tools/shapes";

export class Rock extends GridRenderable {
    public traversable = false;

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#4a4a4e";
        drawRoundedSquare(ctx, this.x + 3, this.y + 3, this.width - 6, this.width - 6, 5);
        ctx.fill();
    }
}