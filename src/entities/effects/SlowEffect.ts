import {Effect} from "./Effect";
import {Enemy} from "../enemies/Enemy";
import {fps} from "../../config.json";

const frameDuration = 1000 / fps;

export class SlowEffect extends Effect {
    private previousSpeed: number;
    private counter: number = 0;
    public duration: number = 100;

    constructor(enemy: Enemy) {
        super(enemy);

        this.previousSpeed = this.enemy.speed;
        this.enemy.speed = this.previousSpeed / 2;
    }

    update() {
        this.counter += frameDuration
        if (this.counter >= this.duration) {
            this.stop();
        }
    }

    restart(): void {
        this.counter = 0;
    }

    stop(): void {
        this.enemy.speed = this.previousSpeed;
        this.unmountCb();
    }

}