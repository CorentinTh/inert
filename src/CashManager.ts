import {initialBalance} from './config.json'
import {interfaceManager} from "./InterfaceManager";

class CashManager {
    private balance: number = initialBalance;

    constructor() {
        interfaceManager.setCash(this.balance);
    }

    add(amount: number) {
        this.balance += amount;
        interfaceManager.setCash(this.balance);
    }

    canWithdraw(amount: number) {
        return this.balance - amount >= 0;
    }

    withdraw(amount: number) {
        if (this.canWithdraw(amount)) {
            this.balance -= amount
            interfaceManager.setCash(this.balance);
        }
    }
}

export const cashManager = new CashManager();