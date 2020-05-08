import {initialBalance} from './config.json'

class CashManager {
    private balance: number = initialBalance;

    add(amount: number){
        this.balance += amount;
    }

    canWithdraw(amount: number){
        return this.balance - amount >= 0;
    }

    withdraw(amount: number){
        if (this.canWithdraw(amount)){
            this.balance -= amount
        }
    }
}

export const cashManager = new CashManager();