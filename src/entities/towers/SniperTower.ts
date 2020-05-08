import {Tower} from "./Tower";
import {Enemy} from "../enemies/Enemy";

export class SniperTower extends Tower{
    aimRadius: number = 100;
    colors: { primary: string; secondary: string } = {primary:'red', secondary:'blue'};
    damage: number= 100;
    reloadDurationMs: number= 1000;
    target: Enemy | undefined;

    shoot(): void {
    }

    draw(ctx: CanvasRenderingContext2D) {

    }
}