import {CanonTower} from "./CanonTower";

export class GatlingTower extends CanonTower {
    public name = 'Gatling';
    public reloadDurationMs: number = 200;
    public cost: number = 100;

    public colors = {
        primary: '#44b0e5',
        secondary: '#71d0ff'
    };

}