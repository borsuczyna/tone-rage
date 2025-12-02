import PasswordHash from '@/Utils/PasswordHash';
import { DatabaseEntity } from './DatabaseEntity';

export class UserEntity extends DatabaseEntity {
	username: string = '';
	email: string = '';
	passwordHash: string = '';
    avatar: string = '';
	createdAt: Date = new Date(Date.now());
	lastLogin: Date | null = null;
    money: number = 0;
    bankMoney: number = 0;
    level: number = 0;
    exp: number = 0;
    adminLevel: number = 0;

	constructor() {
		super();
	}

	public static async create(username: string, email: string, password: string): Promise<UserEntity> {
		const user = new UserEntity();
		user.username = username;
		user.email = email;
		user.passwordHash = await PasswordHash.hashPassword(password);
		return user;
	}
}
