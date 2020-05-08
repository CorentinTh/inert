import {Renderable} from "../../interfaces/Renderable";
import {Enemy} from "../enemies/Enemy";
import {GridRenderable} from "../../interfaces/GridRenderable";
import {Tower} from "../towers/Tower";

export abstract class Munition extends Renderable {
    public target: Enemy;
    public alive: boolean = true;
    abstract speed: number;
    protected emitter: Tower;

    constructor(target: Enemy, emitter: Tower) {
        super(emitter.center.x, emitter.center.y);
        this.target = target;
        this.emitter = emitter
    }

    update() {
        if(!this.target.alive) {
            this.alive = false;
        }

        const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        const nearEqualX = this.x >= this.target.x - this.speed && this.x <= this.target.x + this.speed;
        const nearEqualY = this.y >= this.target.y - this.speed && this.y <= this.target.y + this.speed;

        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;

        if (nearEqualX && nearEqualY) {
            this.alive = false;
            this.dealDamage()
        }
    }

    private dealDamage() {
        this.target.takeDamage(this.emitter.damage);
    }
}