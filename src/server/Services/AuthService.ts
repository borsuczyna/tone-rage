import { AuthLoginData, AuthRegisterData, AuthResponse } from '@shared/Models/AuthData';
import FetchService from './FetchService';
import UserService from './UserService';
import Logger from '@shared/Logger';

export default class AuthService {
	private static logger: Logger = Logger.getLogger(AuthService);

	public static async init() {
		FetchService.registerFetchListener('auth:login', this.handleLogin.bind(this));
		FetchService.registerFetchListener('auth:register', this.handleRegister.bind(this));
	}

	private static async handleLogin(client: PlayerMp, data: AuthLoginData): Promise<AuthResponse> {
		this.logger.info(`Login attempt for username: ${data.username}`);

		const result = await UserService.loginUser(data.username, data.password);
		if (result.error || !result.user) {
			this.logger.warn(`Login failed for username: ${data.username}, error: ${result.error}`);
			return {
				success: false,
				message: result.error || 'auth.login.failed'
			};
		}

		this.logger.info(`Login successful for username: ${data.username}`);
		UserService.assignUserData(client, result.user);
		
		return {
			success: true,
			message: 'auth.login.success'
		};
	}

	private static async handleRegister(_client: PlayerMp, data: AuthRegisterData): Promise<AuthResponse> {
		this.logger.info(`Registration attempt for username: ${data.username}, email: ${data.email}`);

		const result = await UserService.createUser(data.username, data.email, data.password);
		if (result.error || !result.userId) {
			this.logger.warn(`Registration failed for username: ${data.username}, error: ${result.error}`);
			return {
				success: false,
				message: result.error || 'auth.register.failed'
			};
		}

		this.logger.info(`Registration successful for username: ${data.username}, userId: ${result.userId}`);
		return {
			success: true,
			message: 'auth.register.success'
		};
	}
}
