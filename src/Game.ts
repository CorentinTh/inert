import {canvas, ctx} from "./Canvas";
import {fps} from "./config.json";
import './Controls';
import {map} from "./Map";
import {camera} from "./Camera";
import {enemyManager} from "./EnemyManager";
import {munitionManager} from "./MunitionManager";
import {controls} from "./Controls";
import {towerPlacer} from "./TowerPlacer";
import './InterfaceManager';
import './WavesManager';
import {interfaceManager} from "./InterfaceManager";
import {waveManager} from "./WavesManager";

class Game {
    private updateInterval: number = -1;
    private looping: boolean = true;

    constructor() {
        map.on('added', () => {
            enemyManager.updatePaths()
        });

        this.start()
    }

    start(){
        this.updateInterval = setInterval(this.updateLoop.bind(this), 1000 / fps);
        requestAnimationFrame(this.drawLoop.bind(this));
        waveManager.start();
    }

    updateLoop() {
        if (controls.tabHasFocus()) {
            camera.update();
            map.update();
            munitionManager.update()
            enemyManager.update()
            towerPlacer.update()
        }
    }

    drawLoop() {
        ctx.save();
        canvas.clear();
        camera.process(ctx);

        map.drawGrid(ctx);
        munitionManager.draw(ctx);
        enemyManager.draw(ctx);
        map.draw(ctx);
        towerPlacer.draw(ctx);
        ctx.restore();

        if (this.looping) {
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