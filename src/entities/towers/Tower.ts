import {GridRenderable} from "../../interfaces/GridRenderable";
import {fps} from "../../config.json";
import {Enemy} from "../enemies/Enemy";
import {euclideanDistanceSquared} from "../../tools/helphers";
import {munitionManager} from "../../MunitionManager";
import {BasicMunition} from "../munitions/BasicMunition";
import {enemyManager} from "../../EnemyManager";
import {PI2} from "../../tools/constants";
import {ctx} from "../../Canvas";

const frameDuration = 1000 / fps;

export abstract class Tower extends GridRenderable {
    abstract reloadDurationMs: number;
    abstract damage: number;
    private countdown: number = 0;
    protected canShoot: boolean = false;
    public traversable = false;
    abstract target: Enemy | undefined;
    abstract aimRadius: number;
    abstract colors: {
        primary:string,
        secondary:string
    };

    update() {
        super.update();
        this.countdown += frameDuration;
        if (this.countdown >= this.reloadDurationMs) {
            this.canShoot = true;
            this.countdown = 0;
        }

        if (this.target && !this.target.alive) {
            // Target died
            this.target = undefined;
        } else if (this.target && euclideanDistanceSquared(this.center.x, this.center.y, this.target.x, this.target.y) < this.aimRadius * this.aimRadius) {
            // Target in range

            if (this.canShoot) {
                this.canShoot = false;
                this.shoot();
            }
        } else {
            // No target or target no more in range
            this.target = enemyManager.getClosestPointInRadius(this.center.x, this.center.y, this.aimRadius);
        }

    }

    drawAimingRadius() {
        ctx.beginPath();
        const tmpColor = ctx.fillStyle;
        ctx.fillStyle += '22'
        ctx.ellipse(this.center.x, this.center.y, this.aimRadius, this.aimRadius, 0, 0, PI2);
        ctx.fill()
        ctx.fillStyle = tmpColor;
    }

    draw() {
        if (this.isHovered) {
            this.drawAimingRadius()
        }
    }

    abstract shoot(): void;
}
