export enum MoneyLogType {
    Unknown = 0,
    Salary = 1,
    Purchase = 2,
    ATMDeposit = 3,
    ATMWithdraw = 4,
}

export interface MoneyLogData {
    id?: number;
    userId: number;
    amount: number;
    amountBefore: number;
    type: MoneyLogType;
    description: string;
    createdAt: Date;
}

export interface AtmTransactionData {
    id: number;
    amount: number;
    type: 'deposit' | 'withdraw';
    description: string;
    date: Date;
    balanceAfter: number;
}