import {Renderable} from "../../interfaces/Renderable";
import {Enemy} from "../enemies/Enemy";
import {Tower} from "../towers/Tower";

export abstract class Munition extends Renderable {
    public target: Enemy;
    public alive: boolean = true;
    protected emitter: Tower;

    constructor(target: Enemy, emitter: Tower) {
        super(emitter.center.x, emitter.center.y);
        this.target = target;
        this.emitter = emitter
    }

}