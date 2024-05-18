import {version} from './../package.json'
import {CanonTower} from "./entities/towers/CanonTower";
import {GatlingTower} from "./entities/towers/GatlingTower";
import {Tower} from "./entities/towers/Tower";
import {SniperTower} from "./entities/towers/SniperTower";
import {Map} from "./Map";
import {towerPlacer} from "./TowerPlacer";
import {Snackbar} from "./tools/Snackbar";
import {LaserTower} from "./entities/towers/LaserTower";
import {SlowTower} from "./entities/towers/SlowTower";
import {controls} from "./Controls";
import {queryParamsManager} from "./QueryParamsManager";

class InterfaceManager {
    private versionElement = document.getElementById('version')!;
    private waveElement = document.getElementById('wave')!;
    private cashElement = document.getElementById('cash')!;
    private towersWrapperElement = document.getElementById('towers-wrapper')!;
    private towersStatsElement = document.getElementById('towers-stats')!;
    private waveDelayElement = document.getElementById('delay')!;
    private gameOverElement = document.getElementById('game-over')!;
    private demolishToggleElement = document.getElementById('demolish-toggle')!;
    private demolishToggleLabelElement = document.getElementById('switch-text')!;
    public snackbar = new Snackbar();

    constructor() {
        this.versionElement.textContent = 'v' + version;
        controls.on('focusout', this.showFocusLost.bind(this));
        controls.on('focusin', this.hideFocusLost.bind(this));
        this.demolishToggleElement.onclick = this.handleDemolishToggle.bind(this);

        if(!controls.tabHasFocus()) {
            this.showFocusLost()
        }

        document.getElementById('spawner' + queryParamsManager.getDifficulty())!.classList.add('active')

        this.setTowers()
    }

    displaySnackbarToast(text: string, duration: number = 3000) {
        this.snackbar.toast(text, duration);
    }

    showFocusLost() {
        this.snackbar.hide();
        this.snackbar.setText('Focus as been lost, click on the window to continue.');
        this.snackbar.show()
    }

    hideFocusLost() {
        this.snackbar.hide();
    }

    setWave(wave: number) {
        this.waveElement.textContent = String(wave);
    }

    setWaveDelay(sec: number) {
        this.waveDelayElement.textContent = `(${sec}s)`;
    }

    clearWaveDelay() {
        this.waveDelayElement.textContent = '';
    }

    setCash(cash: number) {
        this.cashElement.textContent = String(cash);
    }

    handleDemolishToggle(e: Event) {
        const isChecked = e.target instanceof HTMLInputElement && e.target.checked;

        towerPlacer.toggleDemolishMode(isChecked);

        if (isChecked) {
            this.displaySnackbarToast('🚧 Click on a tower to demolish it. 🚧', 1500)
            this.demolishToggleLabelElement.textContent = 'Demolish-Mode: On';
        } else {
            this.displaySnackbarToast('🚧 Demolish-Mode disabled 🚧', 1500)
            this.demolishToggleLabelElement.textContent = 'Demolish-Mode: Off';
        }
    }

    private setTowers() {
        const towers = [
            CanonTower,
            GatlingTower,
            SlowTower,
            SniperTower,
            LaserTower
        ];
        const pad = Map.TILE_SIZE * 0.5;
        const canvasSize = Map.TILE_SIZE + pad;

        towers.forEach(TowerClass => {
            const canvas = document.createElement('canvas');
            canvas.width = canvasSize;
            canvas.height = canvasSize;
            this.towersWrapperElement.insertAdjacentElement("beforeend", canvas);

            const ctx = canvas.getContext('2d')!;
            const tower = new TowerClass(0, 0, Map.TILE_SIZE);
            tower.setCoordinates(pad / 2, pad / 2);
            tower.draw(ctx);

            canvas.onclick = () => {
                if ((this.demolishToggleElement as HTMLInputElement).checked) {
                    towerPlacer.toggleDemolishMode(false);
                    (this.demolishToggleElement as HTMLInputElement).click();
                }
                towerPlacer.place(TowerClass);
                this.showTowerStats(tower);
            };
        })
    }

    private showTowerStats(tower: Tower) {

        const damage = typeof tower.damage === 'object' ?
            `${tower.damage.min} - ${tower.damage.max}` :
            tower.damage;

        const reloadDuration = tower.reloadDurationMs / 1000;
        const dps = typeof tower.damage === 'object' ?
            `${(tower.damage.min / reloadDuration).toFixed(0)} - ${(tower.damage.max / reloadDuration).toFixed(0)}` :
            tower.damage / reloadDuration;

        this.towersStatsElement.innerHTML = `
            <div class="title">${tower.name}</div>
            <div class="description">${tower.description}</div>
            <table class="table5050">
                <tr><td>Cost: </td><td class="accent">${tower.cost} ¢</td></tr>
                <tr><td>Aim radius:</td><td class="accent">${tower.aimRadius}</td></tr>
                ${typeof tower.damage === 'number' && tower.damage > 0 ? `
                    <tr><td>Damage:</td><td class="accent">${damage}</td></tr>
                    <tr><td>Reload:</td><td class="accent">${reloadDuration.toFixed(3)} s</td></tr>
                    <tr><td title="Damage Per Second">DPS:</td><td class="accent">${dps}</td></tr>
                ` : ''}
            </table>
        `
    }

    showGameOver() {
        this.gameOverElement.classList.add('visible')
    }
}

export const interfaceManager = new InterfaceManager();