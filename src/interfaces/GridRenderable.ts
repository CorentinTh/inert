import {Renderable} from "./Renderable";
import {controls} from "../Controls";

export abstract class GridRenderable extends Renderable {
    public abstract traversable: boolean;
    public width: number;
    public center!: {
        x: number;
        y: number;
    };
    public halfWidth!: number;
    public isHovered = false;
    public top!: number;
    public bottom!: number;
    public left!: number;
    public right!: number;
    public j: number;
    public i: number;

    constructor(i: number, j: number, width: number) {
        super();
        this.i = i;
        this.j = j;
        this.width = width
        this.setCoordinates(i * width, j * width);
    }

    update(): void {
        this.isHovered =
            controls.mouse.y >= this.top &&
            controls.mouse.y <= this.bottom &&
            controls.mouse.x >= this.left &&
            controls.mouse.x <= this.right;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;

    setCoordinates(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.halfWidth = this.width / 2;
        this.center = {
            x: this.x + this.width / 2,
            y: this.y + this.width / 2,
        }
        this.top = this.y;
        this.bottom = this.y + this.width;
        this.left = this.x;
        this.right = this.x + this.width;
    }
}