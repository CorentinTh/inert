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
import {interfaceManager} from "./InterfaceManager";
import {waveManager} from "./WavesManager";

class Game {
    private updateInterval: number;
    private looping:boolean = true;

    constructor() {
        this.updateInterval = setInterval(this.updateLoop.bind(this), 1000 / fps);
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

        if(this.looping){
            requestAnimationFrame(this.drawLoop.bind(this))
        }
    }

    gameOver() {
        setTimeout(() => {
            clearInterval(this.updateInterval);
            this.looping = false;
            interfaceManager.showGameOver();
            waveManager.looping = false;
        }, 100)
    }
}

export const game = new Game();