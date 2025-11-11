import Database from '@/Database/Database';
import { UserEntity } from '@/Database/Entities/UserEntity';
import PasswordHash from '@/Utils/PasswordHash';
import EmailValidator from '@shared/EmailValidator';
import PasswordValidator from '@shared/PasswordValidator';
import ElementDataService from './ElementDataService';
import { ShareMode } from '@shared/Models/ElementDataModels';
import { SpawnLocation } from '@shared/SpawnsData';
import Logger from '@shared/Logger';

interface CreateUserResult {
	userId: number | null;
	error?: string;
}

interface LoginResult {
	user: UserEntity | null;
	error?: string;
}

export default class UserService {
    private static logger = Logger.getLogger(UserService, true);

    public static init() {
        mp.events.add('playerQuit', this.onPlayerQuit.bind(this));
    }
    
	public static async createUser(username: string, email: string, password: string): Promise<CreateUserResult> {
		if (username.length < 3 || username.length > 20) {
			return { userId: null, error: 'auth.register.usernameLength' };
		}

		if (!EmailValidator.validate(email)) {
			return { userId: null, error: 'auth.register.invalidEmail' };
		}

		if (!PasswordValidator.validate(password)) {
			return { userId: null, error: 'auth.register.weakPassword' };
		}

		let existingUser = await UserService.getUserByUsernameOrEmail(username);
		if (existingUser) {
			return {
				userId: null,
				error: existingUser.username === username ? 'auth.register.usernameTaken' : 'auth.register.emailTaken'
			};
		}

		const newUser = await UserEntity.create(username, email, password);
		const userId = await Database.InsertEntity('users', newUser);
		if (!userId) {
			return { userId: null, error: 'auth.register.failed' };
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
		const user = await Database.First<UserEntity>('SELECT * FROM users WHERE username = ? OR email = ?', [identifier, identifier]);

		if (!user) {
			return { user: null, error: 'auth.login.failed' };
		}

		const passwordMatch = await PasswordHash.comparePasswords(password, user.passwordHash);
		if (!passwordMatch) {
			return { user: null, error: 'auth.login.failed' };
		}

        await Database.Execute('UPDATE users SET lastLogin = NOW() WHERE uid = ?', [user.uid]);

		return { user };
	}

	public static async assignUserData(client: PlayerMp, user: UserEntity): Promise<void> {
		ElementDataService.set(client, 'userId', user.uid, ShareMode.Everywhere);
        ElementDataService.set(client, 'money', user.money, ShareMode.SpecificClient);
        ElementDataService.set(client, 'bankMoney', user.bankMoney, ShareMode.Server);
        ElementDataService.set(client, 'level', user.level, ShareMode.SpecificClient);
        ElementDataService.set(client, 'exp', user.exp, ShareMode.SpecificClient);
        ElementDataService.set(client, 'adminLevel', user.adminLevel, ShareMode.Everywhere);
	}

    private static buildSaveQuery(client: PlayerMp): { query: string; params: any[] } | null {
        const userId = ElementDataService.get(client, 'userId') as number | null;
        if (!userId) return null;

        const money = ElementDataService.get(client, 'money') as number | null;
        const bankMoney = ElementDataService.get(client, 'bankMoney') as number | null;
        const level = ElementDataService.get(client, 'level') as number | null;
        const exp = ElementDataService.get(client, 'exp') as number | null;

        const query = `
            UPDATE users SET
                money = ?,
                bankMoney = ?,
                level = ?,
                exp = ?
            WHERE uid = ?
        `;

        const params = [
            money ?? 0,
            bankMoney ?? 0,
            level ?? 0,
            exp ?? 0,
            userId
        ];

        return { query, params };
    }

    public static async savePlayerData(client: PlayerMp): Promise<void> {
        const saveData = this.buildSaveQuery(client);
        if (!saveData) return;

        const { query, params } = saveData;
        await Database.Execute(query, params);
    }

    public static async savePlayers(): Promise<void> {
        const batchSize = 100;
        const players = mp.players.toArray();

        for (let i = 0; i < players.length; i += batchSize) {
            const batch = players.slice(i, i + batchSize);
            const queries: string[] = [];
            const allParams: any[] = [];

            for (const player of batch) {
                const saveData = this.buildSaveQuery(player);
                if (!saveData) continue;

                const { query, params } = saveData;
                queries.push(query.trim());
                allParams.push(...params);
            }

            if (queries.length === 0) continue;

            const finalQuery = queries.join('; '); // multiple UPDATEs in one query
            await Database.Execute(finalQuery, allParams);
        }

        this.logger.info(`Saved ${players.length} players to database`);
    }

    private static async onPlayerQuit(client: PlayerMp): Promise<void> {
        await this.savePlayerData(client);
        this.logger.info(`Saved data for player ${client.name} (ID: ${client.id}) on quit`);
    }

    public static async spawnPlayerAtLocation(client: PlayerMp, spawn: SpawnLocation): Promise<void> {
        client.position = new mp.Vector3(spawn.position[0], spawn.position[1], spawn.position[2]);
        client.heading = spawn.position[3] || 0;
        client.alpha = 255;
        ElementDataService.set(client, 'spawnPosition', spawn.position, ShareMode.SpecificClient);
    }

    public static getActivePlayerByUserId(userId: number): PlayerMp | null {
        const players = mp.players.toArray();
        for (const player of players) {
            const pid = ElementDataService.get(player, 'userId') as number | null;
            if (pid === userId) {
                return player;
            }
        }
        return null;
    }
}