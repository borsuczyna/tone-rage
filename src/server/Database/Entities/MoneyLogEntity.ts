import { MoneyLogType } from '@shared/Models/MoneyLogData';
import { DatabaseEntity } from './DatabaseEntity';

export class MoneyLogEntity extends DatabaseEntity {
	userId: number = 0;
	amount: number = 0;
	amountBefore: number = 0;
	type: MoneyLogType = MoneyLogType.Unknown;
	description: string = '';
	createdAt: Date = new Date(Date.now());

	constructor() {
		super();
	}

	protected convertDatabaseTypes(): void {
		super.convertDatabaseTypes();

		// Convert decimal fields from strings to numbers
		if (typeof this.amount === 'string') {
			this.amount = parseFloat(this.amount);
		}
		if (typeof this.amountBefore === 'string') {
			this.amountBefore = parseFloat(this.amountBefore);
		}
		if (typeof this.userId === 'string') {
			this.userId = parseInt(this.userId);
		}
		if (typeof this.type === 'string') {
			this.type = parseInt(this.type) as MoneyLogType;
		}
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

	public static createAtmDeposit(userId: number, amount: number, amountBefore: number): MoneyLogEntity {
		return MoneyLogEntity.create(userId, amount, amountBefore, MoneyLogType.ATMDeposit, 'ATM Deposit');
	}

	public static createAtmWithdraw(userId: number, amount: number, amountBefore: number): MoneyLogEntity {
		return MoneyLogEntity.create(userId, -amount, amountBefore, MoneyLogType.ATMWithdraw, 'ATM Withdrawal');
	}
}
