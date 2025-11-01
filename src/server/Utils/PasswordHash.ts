import * as bcrypt from 'bcryptjs';

export default class PasswordHash {
	public static async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	}

	public static async comparePasswords(password: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	}
}
