import {EntityRenderer} from "./interfaces/EntityRenderer";
import {Munition} from "./entities/munitions/Munition";

class MunitionManager extends EntityRenderer<Munition> {

    update() {
        super.update();

        for (let i = this.entities.length - 1; i >= 0; --i) {
            const munition = this.entities[i];

            if (munition.alive) {
                munition.update();
            } else {
                this.entities.splice(i, 1);
            }
        }
    }
}

export const munitionManager = new MunitionManager();