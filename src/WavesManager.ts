import {enemyManager} from "./EnemyManager";
import {BossEnemy} from "./entities/enemies/BossEnemy";
import {map} from "./Map";
import {asyncSleep, asyncSleepIntervalSecond} from "./tools/helphers";
import {interfaceManager} from "./InterfaceManager";
import {Enemy} from "./entities/enemies/Enemy";
import {Base} from "./entities/terrain/Base";
import {SimpleEnemy} from "./entities/enemies/SimpleEnemy";
import {ArmoredEnemy} from "./entities/enemies/ArmoredEnemy";
import {FastEnemy} from "./entities/enemies/FastEnemy";

interface WaveGroup {
    enemyClass: { new(base: Base): Enemy },
    enemySpecsMultiplier?: { [k: string]: any }
    quantity: number,
    delay: number
}

type Wave = WaveGroup[]

class WavesManager {
    private delayBetweenWaves = 7; //sec
    public waveCounter = 1
    public looping = true;

    constructor() {
        this.wavesLoop()
    }

    private async wavesLoop() {
        while (this.looping) {
            const wave = this.generateWave()

            if(!this.looping) break;
            for (let i = 0; i < wave.length; ++i) {
                if(!this.looping) break;
                let {enemyClass, enemySpecsMultiplier, quantity, delay} = wave[i];

                for (let j = 0; j < quantity; ++j) {
                    if(!this.looping) break;
                    for (let k = 0; k < map.enemyBases.length; ++k) {
                        if(!this.looping) break;
                        let base = map.enemyBases[k];
                        enemyManager.add(this.enemyFactory(enemyClass, enemySpecsMultiplier, base));
                    }
                    await asyncSleep(delay)
                }
            }
            if(!this.looping) break;
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


        if (this.waveCounter % 10 === 0) {
            wave.push({
                enemyClass: BossEnemy,
                enemySpecsMultiplier: {
                    life: ratio,
                },
                quantity: this.waveCounter / 10,
                delay: 500
            })
        } else if (this.isOnWave({below: 4})) {
            wave.push({
                enemyClass: SimpleEnemy,
                enemySpecsMultiplier: {
                    life: ratio
                },
                quantity: 9 + this.waveCounter,
                delay: 500
            })
        } else {
            if(Math.random() > 0.7){
                wave.push({
                    enemyClass: FastEnemy,
                    enemySpecsMultiplier: {
                        life: ratio,
                        speed: Math.min(ratio, 1.5)
                    },
                    quantity: 2 + this.waveCounter / 5,
                    delay: 200
                })
            }

            wave.push({
                enemyClass: ArmoredEnemy,
                enemySpecsMultiplier: {
                    life: ratio,
                },
                quantity: 10 + this.waveCounter,
                delay: 500
            })

        }


        return wave;
    }

    isOnWave(config: { above?: number, below?: number, rand?: number }) {
        let result = true;

        if (config.above) result = result && this.waveCounter > config.above;
        if (config.below) result = result && this.waveCounter < config.below;

        return result;
    }
}

export const waveManager = new WavesManager();