import {Tower} from "./Tower";
import {PI2} from "../../tools/constants";
import {Point} from "../../interfaces/Point";
import {Enemy} from "../enemies/Enemy";
import {munitionManager} from "../../MunitionManager";
import {BasicBulletMunition} from "../munitions/BasicBulletMunition";


export class CanonTower extends Tower {
    public name = 'Canon';
    public description = 'Basic early game tower. Low cost, low damages.'
    public reloadDurationMs: number = 400;
    public damage: number = 25;
    public cost: number = 50;

    private readonly radius: number;
    private canonLength: number;
    public target: Enemy | undefined;
    private canonExtremity: Point;
    public aimRadius: number;
    public colors = {
        primary: '#556EE6',
        secondary: '#778BEB'
    };

    constructor(x: number, y: number, width: number) {
        super(x, y, width);

        this.radius = this.halfWidth * 0.8;
        this.canonLength = this.halfWidth * 1.2;
        this.canonExtremity = {
            x: this.center.x,
            y: this.center.y + this.canonLength
        }
        this.aimRadius = this.width * 2 + this.halfWidth;
    }

    shoot() {
        munitionManager.add(new BasicBulletMunition(this.target!, this));
        this.canonLength *= 0.8;
    }

    update() {
        this.canonLength = this.halfWidth * 1.2;

        super.update();

        if (this.target) {
            const angle = Math.atan2(this.target.y - this.center.y, this.target.x - this.center.x);

            this.canonExtremity.x = this.center.x + this.canonLength * Math.cos(angle);
            this.canonExtremity.y = this.center.y + this.canonLength * Math.sin(angle)
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.colors.secondary;
        ctx.fillStyle = this.colors.primary;

        this.drawCanon(ctx)

        ctx.beginPath();
        ctx.lineWidth = 4;

        ctx.ellipse(this.center.x, this.center.y, this.radius, this.radius, 0, 0, PI2);
        ctx.fill()
        ctx.stroke()

        super.draw(ctx);
    }

    drawCanon(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = 12;

        ctx.beginPath()
        ctx.moveTo(this.center.x, this.center.y);
        ctx.lineTo(this.canonExtremity.x, this.canonExtremity.y);
        ctx.stroke()
    }

    setCoordinates(x: number, y: number) {
        super.setCoordinates(x, y);

        this.canonExtremity = {
            x: this.center.x + this.canonLength,
            y: this.center.y
        }
    }

}