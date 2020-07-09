export class Timer {
    private timerID!: number;
    private start!: number;

    constructor(private callback: () => void, private delay: number) {
        this.resume();
    }

    resume() {
        this.start = Date.now();
        this.timerID = setTimeout(this.callback, this.delay);
        return this;
    }

    pause() {
        this.clear();
        this.delay -= Date.now() - this.start;
        return this;
    }

    clear() {
        clearTimeout(this.timerID);
        return this;
    }
}