import Database from '@/Database/Database';
import { UserEntity } from '@/Database/Entities/UserEntity';
import PasswordHash from '@/Utils/PasswordHash';

interface CreateUserResult {
	userId: number | null;
	error?: string;
}

interface LoginResult {
	user: UserEntity | null;
	error?: string;
}

export default class UserService {
	public static async createUser(username: string, email: string, password: string): Promise<CreateUserResult> {
		let existingUser = await UserService.getUserByUsernameOrEmail(username);
		if (existingUser) {
			return {
				userId: null,
				error: existingUser.username === username ? 'Username already taken' : 'Email already registered'
			};
		}

		const newUser = await UserEntity.create(username, email, password);
		const userId = await Database.InsertEntity('users', newUser);
		if (!userId) {
			return { userId: null, error: 'Failed to create user, contact support' };
		}

		return { userId };
	}

	public static async getUserById(uid: number): Promise<UserEntity | null> {
		return await Database.First<UserEntity>('SELECT * FROM users WHERE uid = ?', [uid]);
	}

	public static async getUserByUsername(username: string): Promise<UserEntity | null> {
		return await Database.First<UserEntity>('SELECT * FROM users WHERE username = ?', [username]);
	}

	public static async getUserByEmail(email: string): Promise<UserEntity | null> {
		return await Database.First<UserEntity>('SELECT * FROM users WHERE email = ?', [email]);
	}

	public static async getUserByUsernameOrEmail(identifier: string): Promise<UserEntity | null> {
		return await Database.First<UserEntity>('SELECT * FROM users WHERE username = ? OR email = ?', [identifier, identifier]);
	}

	public static async loginUser(identifier: string, password: string): Promise<LoginResult> {
		const passwordHash = await PasswordHash.hashPassword(password);
		const user = await Database.First<UserEntity>('SELECT * FROM users WHERE (username = ? OR email = ?) AND passwordHash = ?', [
			identifier,
			identifier,
			passwordHash
		]);

		if (!user) {
			return { user: null, error: 'Invalid username or password' };
		}

		return { user };
	}
}
