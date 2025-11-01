import { AuthLoginData, AuthRegisterData, AuthResponse } from '@shared/Models/AuthData';
import FetchService from './FetchService';
import UserService from './UserService';

export default class AuthService {
	public static async init() {
		FetchService.registerFetchListener('auth:login', this.handleLogin.bind(this));
		FetchService.registerFetchListener('auth:register', this.handleRegister.bind(this));
	}

	private static async handleLogin(_client: PlayerMp, data: AuthLoginData): Promise<AuthResponse> {
		const result = await UserService.loginUser(data.username, data.password);
		if (result.error || !result.user) {
			return {
				success: false,
				message: result.error || 'auth.login.failed'
			};
		}

		return {
			success: true,
			message: 'auth.login.success'
		};
	}

	private static async handleRegister(_client: PlayerMp, data: AuthRegisterData): Promise<AuthResponse> {
		const result = await UserService.createUser(data.username, data.email, data.password);
		if (result.error || !result.userId) {
			return {
				success: false,
				message: result.error || 'auth.register.failed'
			};
		}

		return {
			success: true,
			message: 'auth.register.success'
		};
	}
}
