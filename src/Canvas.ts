import {EventEmitter} from "./tools/EventEmitter";
import {colors} from "./config.json"

class Canvas extends EventEmitter{
    private readonly ctx: CanvasRenderingContext2D;
    private readonly canvasElement: HTMLCanvasElement;

    constructor() {
        super();
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.tabIndex = 1;
        this.ctx = this.canvasElement.getContext('2d')!;

        this.ctx.fillStyle = '#568EA6';
        this.ctx.fillStyle = '#568EA6';

        this.resize()

        window.addEventListener('resize', this.resize.bind(this))
        // this.canvasElement.addEventListener('wheel', this.handleScroll.bind(this))
    }

    private resize() {
        this.canvasElement.width = document.body.clientWidth;
        this.canvasElement.height = document.body.clientHeight;

        this.emit('resize', this.canvasElement);
    }

    public getElement(): HTMLCanvasElement {
        return this.canvasElement;
    }

    public getCtx(): CanvasRenderingContext2D {
        return this.ctx;
    }

    clear() {
        // this.ctx.clearRect(0,0, this.canvasElement.width, this.canvasElement.height);
        this.ctx.fillStyle = colors.background;
        this.ctx.fillRect(0,0, this.canvasElement.width, this.canvasElement.height);
    }
}

const canvas = new Canvas();
const ctx = canvas.getCtx();

export {
    canvas,
    ctx
}