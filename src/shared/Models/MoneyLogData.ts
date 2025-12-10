import translate from "../Translation/Translation";

export const MoneyLogType = {
	Unknown: 0,
	Salary: 1,
	Purchase: 2,
	ATMDeposit: 3,
	ATMWithdraw: 4,
	Transfer: 5
} as const;

export type MoneyLogType = typeof MoneyLogType[keyof typeof MoneyLogType];

export const MoneyLogTypeNames: Record<MoneyLogType, string> = {
    [MoneyLogType.Unknown]: translate('moneyLog.type.unknown'),
    [MoneyLogType.Salary]: translate('moneyLog.type.salary'),
    [MoneyLogType.Purchase]: translate('moneyLog.type.purchase'),
    [MoneyLogType.ATMDeposit]: translate('moneyLog.type.atmDeposit'),
    [MoneyLogType.ATMWithdraw]: translate('moneyLog.type.atmWithdraw'),
    [MoneyLogType.Transfer]: translate('moneyLog.type.transfer')
};

export const MoneyLogTypeIcons: Record<MoneyLogType, string> = {
    [MoneyLogType.Unknown]: 'dollar-sign',
    [MoneyLogType.Salary]: 'dollar-sign',
    [MoneyLogType.Purchase]: 'shopping-cart',
    [MoneyLogType.ATMDeposit]: 'arrow-down',
    [MoneyLogType.ATMWithdraw]: 'arrow-up',
    [MoneyLogType.Transfer]: 'arrow-right-left'
};

export const MoneyLogTypeColors: Record<MoneyLogType, string> = {
    [MoneyLogType.Unknown]: '76, 175, 80',
    [MoneyLogType.Salary]: '76, 175, 80',
    [MoneyLogType.Purchase]: '255, 152, 0',
    [MoneyLogType.ATMDeposit]: '33, 150, 243',
    [MoneyLogType.ATMWithdraw]: '244, 67, 54',
    [MoneyLogType.Transfer]: '156, 39, 176'
};

export const MoneyLogTypeColorsLight: Record<MoneyLogType, string> = {
    [MoneyLogType.Unknown]: '139, 195, 74',
    [MoneyLogType.Salary]: '139, 195, 74',
    [MoneyLogType.Purchase]: '255, 193, 7',
    [MoneyLogType.ATMDeposit]: '100, 181, 246',
    [MoneyLogType.ATMWithdraw]: '239, 83, 80',
    [MoneyLogType.Transfer]: '180, 91, 198'
};

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

export interface MoneyLogEntityInterface {
	uid: number;
	amount: number;
	amountBefore: number;
	type: MoneyLogType;
	description: string;
	createdAt: string;
}