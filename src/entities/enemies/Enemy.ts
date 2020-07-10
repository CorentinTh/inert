import {Point} from "../../interfaces/Point";
import {Base} from "../terrain/Base";
import {Renderable} from "../../interfaces/Renderable";
import {map, Map} from "../../Map";
import {colors} from "../../config.json"
import {drawRoundedSquare} from "../../tools/shapes";
import {cashManager} from "../../CashManager";
import {Effect} from "../effects/Effect";


export abstract class Enemy extends Renderable implements Point {
    abstract speed: number;
    abstract life: number;
    abstract cash: number;
    abstract radius: number;
    protected damage: number = 10;
    damageTaken: number = 0;
    private targetIndex: number = 1;
    public alive = true;
    private base: Base;
    private path: Point[] | false = false;
    private effects: Effect[] = [];

    protected healthBar = {
        yOffset: 12,
        width: 20,
        height: 3,
        borderRadius: 2
    }

    constructor(base: Base) {
        super(base.center.x, base.center.y);
        this.base = base;
        this.updatePath();
    }

    updatePath() {
        this.path = this.getPath()
        this.targetIndex = 1
    }

    update() {
        this.effects.forEach(e => e.update());

        if (this.path) {
            const target = this.path[this.targetIndex];

            if (target) {
                const angle = Math.atan2(target.y - this.y, target.x - this.x);
                const nearEqualX = this.x >= target.x - this.speed && this.x <= target.x + this.speed;
                const nearEqualY = this.y >= target.y - this.speed && this.y <= target.y + this.speed;

                if (!nearEqualX) {
                    this.x += Math.cos(angle) * this.speed;
                } else {
                    this.x = target.x
                }

                if (!nearEqualY) {
                    this.y += Math.sin(angle) * this.speed;
                } else {
                    this.y = target.y
                }

                if (nearEqualX && nearEqualY) {
                    this.targetIndex++;
                }
            } else {
                map.homeBase.handleDamage();
                this.alive = false;
            }
        }
    }

    drawHealthBar(ctx: CanvasRenderingContext2D) {
        const ratio = 1 - this.damageTaken / this.life;
        ctx.fillStyle = '#4a4a4e'
        drawRoundedSquare(ctx, this.x - this.healthBar.width / 2, this.y + this.healthBar.yOffset, this.healthBar.width, this.healthBar.height, this.healthBar.borderRadius)
        ctx.fill()
        ctx.fillStyle = colors.enemyBase.primary
        drawRoundedSquare(ctx, this.x - this.healthBar.width / 2, this.y + this.healthBar.yOffset, this.healthBar.width * ratio, this.healthBar.height, this.healthBar.borderRadius)
        ctx.fill()
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.effects.forEach(e => e.draw(ctx));

        if (this.damageTaken > 0) {
            this.drawHealthBar(ctx);
        }
    }

    takeDamage(damage: number) {
        this.damageTaken += damage;

        if (this.damageTaken >= this.life && this.alive) {
            this.alive = false;
            this.onDie();
        }
    }

    public getPath() {
        return map.getPathFromGridCell(
            Math.floor(this.x / Map.TILE_SIZE),
            Math.floor(this.y / Map.TILE_SIZE)
        )
    }

    private onDie() {
        cashManager.add(this.cash);
    }

    heal(amount: number) {
        this.damageTaken = Math.max(this.damageTaken - amount, 0);
    }

    addEffect(effect: { new(e: Enemy): Effect }) {
        const existingEffect = this.effects.find(e => e.constructor.name === effect.name);

        if (existingEffect) {
            existingEffect.restart();
        } else {
            const e = new effect(this);
            const i = this.effects.push(e) - 1;
            e.onUnmount(() => {
                this.effects.splice(i, 1);
            });
        }
    }

}