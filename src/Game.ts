import {canvas, ctx} from "./Canvas";
import {fps} from "./config.json";
import './Controls';
import {map} from "./Map";
import {enemyManager} from "./EnemyManager";
import {munitionManager} from "./MunitionManager";
import {controls} from "./Controls";
import {towerPlacer} from "./TowerPlacer";
import {ArmoredEnemy} from "./entities/enemies/ArmoredEnemy";
import './InterfaceManager';

class Game {

    constructor() {
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
        map.draw(ctx);
        munitionManager.draw(ctx);
        enemyManager.draw(ctx);
        towerPlacer.draw(ctx);

        requestAnimationFrame(this.drawLoop.bind(this))
    }
}

export const game = new Game();