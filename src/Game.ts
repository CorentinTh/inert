import {canvas, ctx} from "./Canvas";
import {fps} from "./config.json";
import './Controls';
import {map} from "./Map";
import {enemyManager} from "./EnemyManager";
import {munitionManager} from "./MunitionManager";
import {controls} from "./Controls";
import {towerPlacer} from "./TowerPlacer";
import './InterfaceManager';
import './WavesManager';

class Game {

    constructor() {
        setInterval(this.updateLoop.bind(this), 1000 / fps);
        requestAnimationFrame(this.drawLoop.bind(this));

        map.on('added', () => {
            enemyManager.updatePaths()
        });
    }

    updateLoop() {
        if (controls.tabHasFocus()) {
            map.update();
            munitionManager.update()
            enemyManager.update()
            towerPlacer.update()
        }
    }

    drawLoop() {
        canvas.clear();
        map.drawGrid(ctx);
        munitionManager.draw(ctx);
        map.draw(ctx);
        enemyManager.draw(ctx);
        towerPlacer.draw(ctx);

        requestAnimationFrame(this.drawLoop.bind(this))
    }
}

export const game = new Game();