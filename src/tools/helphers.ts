import {controls} from "../Controls";
import {Timer} from "./Timer";

const euclideanDistanceSquared = (x1: number, y1: number, x2: number, y2: number) => {
    const deltaX = x1 - x2;
    const deltaY = y1 - y2;
    return deltaX * deltaX + deltaY * deltaY;
}

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

const randIndex = (array: any[]) => Math.floor(Math.random() * array.length);

const asyncSleep = (delayMs: number) => {
    return new Promise(resolve => {
        const timer = new Timer(resolve, delayMs);
        controls.on('focusout', () => timer.pause())
        controls.on('focusin', () => timer.resume())

        if (!controls.tabHasFocus()) {
            timer.pause()
        }
    });
}

const asyncSleepIntervalSecond = (delaySec: number, callback: (remainingSeconds: number) => void = () => {
}) => {
    callback(delaySec);

    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (controls.tabHasFocus() && --delaySec === 0) {
                resolve()
                clearInterval(interval);
            } else {
                callback(delaySec);
            }
        }, 1000)
    });
}

const shuffle = (array: any[]) => {
    for (let i = array.length - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export {
    asyncSleep,
    asyncSleepIntervalSecond,
    euclideanDistanceSquared,
    rand,
    randIndex,
    shuffle
}