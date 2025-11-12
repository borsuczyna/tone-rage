import { DatabaseEntity } from "./DatabaseEntity";

export enum MoneyLogType {
    Unknown = 0,
    Salary = 1,
    Purchase = 2,
}

export class MoneyLogEntity extends DatabaseEntity {
    userId: number = 0;
    amount: number = 0
    amountBefore: number = 0;
    type: MoneyLogType = MoneyLogType.Unknown;
    description: string = '';
    createdAt: Date = new Date(Date.now());

    constructor() {
        super();
    }

    public static create(userId: number, amount: number, amountBefore: number, type: MoneyLogType, description: string): MoneyLogEntity {
        const log = new MoneyLogEntity();
        log.userId = userId;
        log.amount = amount;
        log.amountBefore = amountBefore;
        log.type = type;
        log.description = description;
        return log;
    }
}