import {Tower} from "./Tower";
import {canvas} from "../../Canvas";
import {PI2} from "../../tools/constants";
import {colors} from "../../config.json"
import {Point} from "../../interfaces/Point";
import {Enemy} from "../enemies/Enemy";
import {munitionManager} from "../../MunitionManager";
import {BasicMunition} from "../munitions/BasicMunition";
import {SimpleTower} from "./SimpleTower";

const ctx = canvas.getCtx();

export class FastTower extends SimpleTower {
    reloadDurationMs= 100;
    public colors = {
        primary: '#44b0e5',
        secondary: '#71d0ff'
    };

}