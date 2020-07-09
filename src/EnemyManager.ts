import {EntityRenderer} from "./interfaces/EntityRenderer";
import {Enemy} from "./entities/enemies/Enemy";
import {euclideanDistanceSquared} from "./tools/helphers";

class EnemyManager extends EntityRenderer<Enemy> {
    constructor() {
        super();
    }

    getClosestPointInRadius(x: number, y: number, radius: number) {
        let closestEnemy;
        let shortestDistanceSquared = radius * radius;

        for (let i = 0; i < this.entities.length; ++i) {
            const enemy = this.entities[i];

            const distanceSquared = euclideanDistanceSquared(enemy.x, enemy.y, x, y);

            if (distanceSquared <= shortestDistanceSquared) {
                shortestDistanceSquared = distanceSquared;
                closestEnemy = enemy;
            }
        }

        return closestEnemy
    }

    getAllInRadius(x: number, y: number, radius: number) {
        const distanceSquared = radius * radius;
        return this.entities.filter(e => euclideanDistanceSquared(e.x, e.y, x, y) <= distanceSquared);
    }


    update() {
        for (let i = this.entities.length - 1; i >= 0; --i) {
            const enemy = this.entities[i];

            if (enemy.alive) {
                enemy.update();
            } else {
                this.entities.splice(i, 1);
            }
        }
    }

    canAllReachBase() {
        return this.entities.every(enemy => enemy.getPath())
    }

    updatePaths() {
        this.entities.forEach(enemy => enemy.updatePath())
    }

}

export const enemyManager = new EnemyManager();