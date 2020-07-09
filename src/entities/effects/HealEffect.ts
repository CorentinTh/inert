import {Effect} from "./Effect";
import {Enemy} from "../enemies/Enemy";
import {fps} from "../../config.json";

const frameDuration = 1000 / fps;

export class HealEffect extends Effect {
    private healRate: number = 100 /* pv/sec */ / frameDuration;
    private counter: number = 0;
    public duration: number = 100;

    constructor(enemy: Enemy) {
        super(enemy);
    }

    update() {
        this.enemy.heal(this.healRate);

        this.counter += frameDuration
        if (this.counter >= this.duration) {
            this.stop();
        }
    }

    restart(): void {
        this.counter = 0;
    }

    stop(): void {
        this.unmountCb();
    }

}