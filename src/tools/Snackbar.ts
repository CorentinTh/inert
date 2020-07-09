export class Snackbar {
    private element: HTMLElement;
    private timeoutID: number | false = false;

    constructor(snackbarID: string = 'snackbar') {
        this.element = document.getElementById(snackbarID)!;
    }

    show() {
        this.element.classList.remove('hide');
        this.element.classList.add('show');
    }

    hide() {
        this.element.classList.remove('show');
        this.element.classList.add('hide');
    }

    setText(text: string) {
        this.element.innerText = text;
    }

    clearTimeout() {
        if (this.timeoutID) {
            clearTimeout(this.timeoutID);
        }
    }

    toast(text: string, duration: number = 3000) {
        this.clearTimeout();
        this.hide();
        this.setText(text);
        this.show()

        this.timeoutID = setTimeout(() => this.hide(), duration)
    }
}