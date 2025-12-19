import PasswordHash from '@/Utils/PasswordHash';
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({
	tableName: 'users',
	timestamps: false
})
export class UserEntity extends Model<UserEntity> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	uid!: number;

	@Column(DataType.STRING)
	username!: string;

	@Column(DataType.STRING)
	email!: string;

	@Column(DataType.STRING)
	passwordHash!: string;

	@Column(DataType.STRING)
	avatar!: string;

	@Column(DataType.TEXT)
	characterVisuals!: string;

	@Column(DataType.DATE)
	createdAt!: Date;

	@Column(DataType.DATE)
	lastLogin!: Date | null;

	@Column(DataType.DECIMAL(10, 2))
	money!: number;

	@Column(DataType.DECIMAL(10, 2))
	bankMoney!: number;

	@Column(DataType.INTEGER)
	level!: number;

	@Column(DataType.INTEGER)
	exp!: number;

	@Column(DataType.INTEGER)
	adminLevel!: number;

	public static async createUser(username: string, email: string, password: string): Promise<UserEntity> {
		const passwordHash = await PasswordHash.hashPassword(password);
		const user = UserEntity.build({
			username,
			email,
			passwordHash,
			avatar: '',
			characterVisuals: '',
			createdAt: new Date(),
			lastLogin: null,
			money: 0,
			bankMoney: 0,
			level: 0,
			exp: 0,
			adminLevel: 0
		});
		await user.save();
		return user;
	}
}
