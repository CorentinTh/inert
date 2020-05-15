import {controls} from "./Controls";
import {enemyManager} from "./EnemyManager";
import {BossEnemy} from "./entities/enemies/BossEnemy";
import {map} from "./Map";
import {asyncSleep, asyncSleepIntervalSecond} from "./tools/helphers";
import {interfaceManager} from "./InterfaceManager";
import {Enemy} from "./entities/enemies/Enemy";
import {Base} from "./entities/terrain/Base";
import {SimpleEnemy} from "./entities/enemies/SimpleEnemy";

interface WaveGroup {
    enemyClass: { new(base: Base): Enemy },
    enemySpecsMultiplier?: { [k: string]: any }
    quantity: number,
    delay: number
}

type Wave = WaveGroup[]

class WavesManager {
    private delayBetweenWaves = 10; //sec
    public waveCounter = 1
    private looping = true;

    constructor() {
        this.wavesLoop()
    }


    private async wavesLoop() {
        while (this.looping) {
            const wave = this.generateWave()

            for (let i = 0; i < wave.length; ++i) {
                let {enemyClass, enemySpecsMultiplier, quantity, delay} = wave[i];

                for (let j = 0; j < quantity; ++j) {
                    for (let k = 0; k < map.enemyBases.length; ++k) {
                        let base = map.enemyBases[k];
                        enemyManager.add(this.enemyFactory(enemyClass, enemySpecsMultiplier, base));
                    }
                    await asyncSleep(delay)
                }
            }

            await asyncSleepIntervalSecond(this.delayBetweenWaves, interfaceManager.setWaveDelay.bind(interfaceManager))
            interfaceManager.clearWaveDelay();
            interfaceManager.setWave(++this.waveCounter);
        }
    }

    enemyFactory<T extends Enemy, K extends keyof T>(enemyClass: { new(base: Base): T }, enemySpecsMultiplier: { [k: string]: any } | undefined, base: Base): Enemy {
        const enemy = new enemyClass(base);

        if (enemySpecsMultiplier) {
            for (const [specKey, specMultiplier] of Object.entries(enemySpecsMultiplier)) {
                (<any>enemy[<K>specKey]) *= specMultiplier;
            }
        }
        return enemy;
    }

    private generateWave(): Wave {
        const wave = [];
        const ratio = 1 + this.waveCounter / 10;


        if (this.waveCounter <= 10) {
            wave.push({
                enemyClass: SimpleEnemy,
                enemySpecsMultiplier: {
                    life: ratio,
                    speed: ratio
                },
                quantity: 10,
                delay: 500
            })
        } else {

            if (this.waveCounter % 5 === 0){
                wave.push({
                    enemyClass: SimpleEnemy,
                    enemySpecsMultiplier: {
                        life: ratio,
                    },
                    quantity: this.waveCounter / 5,
                    delay: 500
                })
            }

            if (this.waveCounter % 5 === 0){
                wave.push({
                    enemyClass: SimpleEnemy,
                    enemySpecsMultiplier: {
                        life: ratio,
                    },
                    quantity: this.waveCounter / 5,
                    delay: 500
                })
            }

        }



        return wave;
    }
}

export const waveManager = new WavesManager();