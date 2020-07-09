import {Tower} from "./Tower";
import {Enemy} from "../enemies/Enemy";
import {munitionManager} from "../../MunitionManager";
import {PI2} from "../../tools/constants";
import {LaserMunition} from "../munitions/LaserMunition";


export class LaserTower extends Tower {
    public name = 'Laser';
    public description = 'Laser tower beam focusing on one enemy. The longer the focus, the bigger the damages.'
    public reloadDurationMs: number = 300;
    public damage = {
        max: 50,
        min: 20
    };
    public cost: number = 400;
    private readonly radius: number;
    private canonLength: number;
    public target: Enemy | undefined;
    public aimRadius: number = this.width * 2 + this.halfWidth;
    public colors = {
        primary: '#7f8c8d',
        secondary: '#95a5a6'
    };

    private angle: number = 0;

    constructor(x: number, y: number, width: number) {
        super(x, y, width);

        this.radius = this.halfWidth * 0.8;
        this.canonLength = this.halfWidth * 0.3;
    }

    onNewTargetInRange() {
        if (this.target) {
            munitionManager.add(new LaserMunition(this.target, this))
        }
    }

    update() {
        super.update();

        if (this.target) {
            this.angle = Math.atan2(this.target.y - this.center.y, this.target.x - this.center.x);
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.colors.secondary;
        ctx.fillStyle = this.colors.primary;

        this.drawCanon(ctx)

        ctx.save();
        ctx.translate(this.center.x, this.center.y)
        ctx.rotate(this.angle);
        ctx.translate(-this.center.x, -this.center.y)

        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.center.x, this.center.y - this.radius);
        ctx.lineTo(this.center.x + this.radius + 3, this.center.y)
        ctx.lineTo(this.center.x, this.center.y + this.radius);
        ctx.stroke()
        ctx.beginPath();
        ctx.ellipse(this.center.x + this.radius + 3, this.center.y, 2, 2, 0, 0, PI2);
        ctx.stroke()

        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(this.center.x, this.center.y, this.radius, this.radius, 0, Math.PI / 3, -Math.PI / 3);
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        ctx.restore()
        super.draw(ctx);
    }

    drawCanon(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = 12;
    }

    setCoordinates(x: number, y: number) {
        super.setCoordinates(x, y);
    }

}