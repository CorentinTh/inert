type EventCallback = (...args: any[]) => any;

export class EventEmitter {
    private readonly callbacks: { [key: string]: EventCallback[] } = {}

    on(event: string, callback: EventCallback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }

        this.callbacks[event].push(callback);
    }

    emit(event: string, ...args: any[]) {
        const callbacks = this.callbacks[event];

        if (callbacks) {
            callbacks.forEach(callback => callback(...args))
        }
    }
}