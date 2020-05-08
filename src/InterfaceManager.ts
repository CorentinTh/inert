import {version} from './../package.json'
import {SimpleTower} from "./entities/towers/SimpleTower";
import {FastTower} from "./entities/towers/FastTower";
import {Tower} from "./entities/towers/Tower";
import {SniperTower} from "./entities/towers/SniperTower";
import {Map} from "./Map";
import {GridRenderable} from "./interfaces/GridRenderable";
import {towerPlacer} from "./TowerPlacer";

class InterfaceManager {
    private versionElement = document.getElementById('version')!;
    private waveElement = document.getElementById('wave')!;
    private cashElement = document.getElementById('cash')!;
    private towersWrapperElement = document.getElementById('towers-wrapper')!;

    constructor() {
        this.versionElement.innerText = 'v' + version;

        this.setTowers()
    }

    setWave(wave: number) {
        this.waveElement.innerText = String(wave);
    }

    setCash(cash: number) {
        this.cashElement.innerText = String(cash);
    }

    private setTowers() {
        const towers = [
            SimpleTower,
            FastTower,
        ];
        const pad = Map.TILE_SIZE * 0.5;
        const canvasSize = Map.TILE_SIZE + pad;

        towers.forEach(TowerClass => {
            const canvas = document.createElement('canvas');
            canvas.width = canvasSize;
            canvas.height = canvasSize;
            this.towersWrapperElement.insertAdjacentElement("beforeend", canvas);

            const ctx = canvas.getContext('2d')!;
            const tower = new TowerClass(0,0, Map.TILE_SIZE);
            tower.setCoordinates(pad/2, pad/2);
            tower.draw(ctx);

            canvas.onclick = () => towerPlacer.place(TowerClass);
        })

    }
}

export const interfaceManager = new InterfaceManager();