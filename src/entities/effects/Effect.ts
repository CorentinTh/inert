import {Renderable} from "../../interfaces/Renderable";
import {Enemy} from "../enemies/Enemy";

export abstract class Effect extends Renderable {
    protected enemy: Enemy;
    protected unmountCb: () => void = () => {
    }

    protected constructor(enemy: Enemy) {
        super();
        this.enemy = enemy;
    }

    abstract restart(): void;

    abstract stop(): void;

    onUnmount(cb: () => void) {
        this.unmountCb = cb;
    }

    draw(ctx: CanvasRenderingContext2D): void {
    }

    update(): void {
    }
}
