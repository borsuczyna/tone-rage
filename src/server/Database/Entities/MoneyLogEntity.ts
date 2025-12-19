import { MoneyLogType } from '@shared/Models/MoneyLogData';
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({
	tableName: 'moneyLogs',
	timestamps: false
})
export class MoneyLogEntity extends Model<MoneyLogEntity> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	uid!: number;

	@Column(DataType.INTEGER)
	userId!: number;

	@Column(DataType.DECIMAL(10, 2))
	amount!: number;

	@Column(DataType.DECIMAL(10, 2))
	amountBefore!: number;

	@Column(DataType.INTEGER)
	type!: MoneyLogType;

	@Column(DataType.STRING)
	description!: string;

	@Column(DataType.DATE)
	createdAt!: Date;

	public static async createLog(userId: number, amount: number, amountBefore: number, type: MoneyLogType, description: string): Promise<MoneyLogEntity> {
		const log = MoneyLogEntity.build({
			userId,
			amount,
			amountBefore,
			type,
			description,
			createdAt: new Date()
		});
		await log.save();
		return log;
	}

	public static async createAtmDeposit(userId: number, amount: number, amountBefore: number): Promise<MoneyLogEntity> {
		return await MoneyLogEntity.createLog(userId, amount, amountBefore, MoneyLogType.ATMDeposit, 'ATM Deposit');
	}

	public static async createAtmWithdraw(userId: number, amount: number, amountBefore: number): Promise<MoneyLogEntity> {
		return await MoneyLogEntity.createLog(userId, -amount, amountBefore, MoneyLogType.ATMWithdraw, 'ATM Withdrawal');
	}
}
