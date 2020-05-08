import {Point} from "../interfaces/Point";

type PFSet = { [key: string]: { pos: Point, parent: Point | null, h: number, g: number } }

export const easyAStar = (reachable: (x: number, y: number) => boolean, start: Point, end: Point): Point[] | false => {
    const openSet: PFSet = {};
    const closeSet: PFSet = {};

    openSet[start.x + '-' + start.y] = {
        pos: start,
        parent: null,
        g: 0,
        h: Math.abs(end.x - start.x) + Math.abs(end.y - start.y)
    };
    while ((!closeSet[end.x + '-' + end.y]) && Object.keys(openSet).length > 0) {
        let minF = Number.POSITIVE_INFINITY;
        let minFkey = "";
        for (const key in openSet) {
            if (openSet.hasOwnProperty(key)) {
                let f = openSet[key].g + openSet[key].h;
                if (f < minF) {
                    minF = f;
                    minFkey = key;
                }
            }
        }
        closeSet[minFkey] = openSet[minFkey];
        delete openSet[minFkey];
        let currentNode = closeSet[minFkey];
        let fourDt = [{x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}];
        for (let index = 0; index < fourDt.length; index++) {
            const dt = fourDt[index];
            let tmpPos = {x: currentNode.pos.x + dt.x, y: currentNode.pos.y + dt.y};
            if (reachable(tmpPos.x, tmpPos.y)) {
                if (!closeSet[tmpPos.x + '-' + tmpPos.y]) {
                    if ((!openSet[tmpPos.x + '-' + tmpPos.y]) || (openSet[tmpPos.x + '-' + tmpPos.y].g > currentNode.g + 1)) {
                        openSet[tmpPos.x + '-' + tmpPos.y] = {
                            pos: tmpPos,
                            parent: currentNode.pos,
                            g: currentNode.g + 1,
                            h: Math.abs(end.x - tmpPos.x) + Math.abs(end.y - tmpPos.y)
                        }
                    }
                }
            }
        }
    }
    if (closeSet[end.x + '-' + end.y]) {
        let path: { x: number, y: number }[] = [];
        path.push(closeSet[end.x + '-' + end.y].pos);
        let parent = closeSet[end.x + '-' + end.y].parent;
        while (parent) {
            path.push(parent);
            parent = closeSet[parent.x + '-' + parent.y].parent;
        }
        return path.reverse();
    } else {
        return false;
    }
}

