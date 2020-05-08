import * as config from './config.json'
import {canvas, ctx} from "./Canvas";
import {fps} from "./config.json";
import './Controls';
import {map} from "./Map";
import {enemyManager} from "./EnemyManager";
import {SimpleEnemy} from "./entities/enemies/SimpleEnemy";
import {munitionManager} from "./MunitionManager";
import {controls} from "./Controls";
import {towerPlacer} from "./TowerPlacer";
import {ArmoredEnemy} from "./entities/enemies/ArmoredEnemy";

class Game {
    private gameWrapper: HTMLElement;

    constructor() {
        this.gameWrapper = document.getElementById(config.containerID)!;
        this.gameWrapper.insertAdjacentElement("beforeend", canvas.getElement());

        setInterval(this.updateLoop.bind(this), 1000 / fps);
        requestAnimationFrame(this.drawLoop.bind(this));

        map.on('added', () => {
            enemyManager.updatePaths()
        });

        setInterval(() => {
            if (controls.tabHasFocus()) {
                enemyManager.add(new ArmoredEnemy(map.enemyBases[0]));
            }
        }, 300)
    }

    updateLoop() {
        if (controls.tabHasFocus()) {
            munitionManager.update()
            enemyManager.update()
            map.update();
            towerPlacer.update()
        }
    }

    drawLoop() {
        canvas.clear();
        munitionManager.draw(ctx);
        enemyManager.draw(ctx);
        map.draw(ctx);
        towerPlacer.draw(ctx);

        requestAnimationFrame(this.drawLoop.bind(this))
    }
}

export const game = new Game();