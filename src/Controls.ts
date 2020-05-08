import {EventEmitter} from "./tools/EventEmitter";
import {canvas} from "./Canvas";

class Controls extends EventEmitter {
    private element: HTMLElement;
    private bounds: DOMRect;
    public mouse = {x: 0, y: 0};

    constructor() {
        super();
        this.element = canvas.getElement();
        this.bounds = this.element.getBoundingClientRect();

        canvas.on('resize', () => {
            this.bounds = this.element.getBoundingClientRect();
        });

        this.createClickHandler();
        this.createMouseMoveHandler();
        this.createKeyDownHandler();
    }

    createClickHandler() {
        this.element.addEventListener('click', event => {
            const x = event.clientX - this.bounds.left - this.element.clientLeft;
            const y = event.clientY - this.bounds.top - this.element.clientTop;

            this.emit('click', x, y);
        })
    }

    private createMouseMoveHandler() {
        this.element.addEventListener('mousemove', event => {
            this.mouse.x = event.clientX - this.bounds.left - this.element.clientLeft;
            this.mouse.y = event.clientY - this.bounds.top - this.element.clientTop;
        });
    }

    private createKeyDownHandler() {
        this.element.addEventListener('keydown', ({key}) => {
            console.log(key.toUpperCase());
            this.emit(`keydown:${key.toUpperCase()}`);
        });
    }

    tabHasFocus(){
        return document.hasFocus()
    }
}


export const controls = new Controls();