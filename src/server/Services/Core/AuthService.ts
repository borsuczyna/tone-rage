import { AuthLoginData, AuthRegisterData, AuthResponse } from '@shared/Models/AuthData';
import FetchService from '@/Services/Infrastructure/FetchService';
import UserService from '@/Services/Core/UserService';
import Logger from '@shared/Logger';

export default class AuthService {
	private static logger: Logger = Logger.getLogger(AuthService);

	public static async init() {
		mp.events.add('playerJoin', this.handlePlayerJoin.bind(this));
		FetchService.registerFetchListener('auth:login', this.handleLogin.bind(this));
		FetchService.registerFetchListener('auth:register', this.handleRegister.bind(this));

		// gdy gracz zdechnie to go odrodz
		mp.events.add('playerDeath', (player: PlayerMp) => {
			const pos = player.position;
			player.spawn(new mp.Vector3(pos.x, pos.y, pos.z + 1));
		});
	}

	private static handlePlayerJoin(client: PlayerMp) {
		client.alpha = 0;
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

		const userId = result.user.uid;
		const player = UserService.getActivePlayerByUserId(userId);
		if (player) {
			this.logger.warn(`Login failed for username: ${data.username}, reason: already logged in`);
			return {
				success: false,
				message: 'auth.login.alreadyLoggedIn'
			};
		}

		this.logger.info(`Login successful for username: ${data.username}`);
		await UserService.assignUserData(client, result.user);

		return {
			success: true,
			message: 'auth.login.success',
            hasCharacter: result.user.characterVisuals.length > 0
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
