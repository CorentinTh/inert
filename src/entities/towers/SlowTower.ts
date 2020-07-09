import {Tower} from "./Tower";
import {Enemy} from "../enemies/Enemy";
import {drawPolygon} from "../../tools/shapes";
import {enemyManager} from "../../EnemyManager";
import {SlowEffect} from "../effects/SlowEffect";


export class SlowTower extends Tower {
    public name = 'Slower';
    public description = 'Tower that slows enemies.'
    public reloadDurationMs: number = 0;
    public damage: number = 0;
    public cost: number = 150;

    public target: Enemy | undefined;
    public aimRadius: number;
    public colors = {
        primary: '#bcc1c4',
        secondary: '#e6e9ea'
    };
    private radius: number;

    constructor(x: number, y: number, width: number) {
        super(x, y, width);

        this.aimRadius = this.width * 2 + this.halfWidth;
        this.radius = this.halfWidth * 0.7;
    }

    shoot() {
    }

    update() {
        const enemies = enemyManager.getAllInRadius(this.center.x, this.center.y, this.aimRadius);
        enemies.forEach(e => e.addEffect(SlowEffect));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.colors.secondary;
        ctx.fillStyle = this.colors.primary;

        ctx.beginPath();
        ctx.lineWidth = 4;

        drawPolygon(ctx, this.center.x, this.center.y, 8, this.radius)
        ctx.fill()
        ctx.stroke()

        super.draw(ctx);
    }


    setCoordinates(x: number, y: number) {
        super.setCoordinates(x, y);
    }

}