import Database from '@/Database/Database';
import { UserEntity } from '@/Database/Entities/UserEntity';
import PasswordHash from '@/Utils/PasswordHash';
import EmailValidator from '@shared/EmailValidator';
import PasswordValidator from '@shared/PasswordValidator';
import ElementDataService from '@/Services/Infrastructure/ElementDataService';
import { ShareMode } from '@shared/Models/ElementDataModels';
import { characterCreationPosition, SpawnLocation } from '@shared/SpawnsData';
import Logger from '@shared/Logger';
import TimerService from '@shared/Services/TimerService';
import { Config } from '@/Config';
import Dimensions from '@shared-rage/Models/Dimensions';
import { CharacterAppearance, encodeCharacterAppearance } from '@shared/Models/Character/Character';
import CharacterCreator from '@/Features/CharacterCreator/CharacterCreator';
import EventService from '../Infrastructure/EventService';
import RealTime from '@/Features/Core/RealTime';

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
        mp.events.add('playerJoin', this.onPlayerJoin.bind(this));
		mp.events.add('playerQuit', this.onPlayerQuit.bind(this));

        // Save all players periodically
		TimerService.setTimer(this.savePlayers.bind(this), Config.SaveInterval.Users, 0);

        // Update frozen players
        TimerService.setTimer(this.updateFrozenPlayers.bind(this), 500, 0);
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
		ElementDataService.set(client, 'avatar', user.avatar, ShareMode.Everywhere);
		ElementDataService.set(client, 'characterVisuals', user.characterVisuals, ShareMode.SpecificClient);
		client.name = user.username;

        if (user.characterVisuals.length === 0) {
            this.goToCharacterCreation(client);
            return;
        }
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

		const params = [money ?? 0, bankMoney ?? 0, level ?? 0, exp ?? 0, userId];
		return { query, params };
	}

	public static savePlayerData(client: PlayerMp) {
		const saveData = this.buildSaveQuery(client);
		if (!saveData) return;

		const { query, params } = saveData;
		Database.Execute(query, params);
	}

	public static async savePlayers(): Promise<void> {
        const players = mp.players.toArray();
        
        for (const player of players) {
            await this.savePlayerData(player);
        }

		this.logger.info(`Saved ${players.length} players to database`);
	}

    private static onPlayerJoin(client: PlayerMp) {
        this.setPlayerFrozen(client, true);
        client.dimension = Dimensions.LoginRoom;
    }

    public static goToCharacterCreation(client: PlayerMp) {
        const userId = ElementDataService.get(client, 'userId') as number | null;
        if (!userId) {
            this.logger.error(`Cannot send player ${client.name} to character creation: userId is null`);
            return;
        }

        client.dimension = Dimensions.CharacterCreation + userId;
        client.position = new mp.Vector3(characterCreationPosition[0], characterCreationPosition[1], characterCreationPosition[2]);
        client.heading = characterCreationPosition[3] || 0;
        client.alpha = 255;
        this.updatePlayerFreezePosition(client);

        ElementDataService.set(client, 'inCharacterCreation', true, ShareMode.SpecificClient);
    }

	public static async updateCharacterAppearance(client: PlayerMp, appearance: CharacterAppearance): Promise<boolean> {
		const userId = ElementDataService.get(client, 'userId') as number | null;
		if (!userId) {
			this.logger.error(`Cannot update character appearance for player ${client.name}: userId is null`);
			return false;
		}

		const appearanceString = encodeCharacterAppearance(appearance);
		const result = await Database.Execute('UPDATE users SET characterVisuals = ? WHERE uid = ?', [appearanceString, userId]);
        if (result === null || result.affectedRows === 0) {
            return false;
        }

        ElementDataService.set(client, 'characterVisuals', appearanceString, ShareMode.SpecificClient);
        ElementDataService.set(client, 'inCharacterCreation', false, ShareMode.SpecificClient);
        return true;
	}

	private static onPlayerQuit(client: PlayerMp) {
		this.savePlayerData(client);
		this.logger.info(`Saved data for player ${client.name} (ID: ${client.id}) on quit`);
	}

	public static spawnPlayerAtLocation(client: PlayerMp, spawn: SpawnLocation) {
		client.position = new mp.Vector3(spawn.position[0], spawn.position[1], spawn.position[2]);
		client.heading = spawn.position[3] || 0;
		client.alpha = 255;
        client.dimension = 0;
		ElementDataService.set(client, 'spawnPosition', spawn.position, ShareMode.SpecificClient);
        EventService.triggerClientEvent(client, 'spawn:onSpawned');
        this.setPlayerFrozen(client, false);
        CharacterCreator.loadCharacterAppearance(client);
        RealTime.updateTime();
	}

    public static setPlayerFrozen(client: PlayerMp, frozen: boolean) {
        ElementDataService.set(client, 'isFrozen', frozen, ShareMode.Everywhere);

        if (frozen) {
            ElementDataService.set(client, 'freezePosition', client.position, ShareMode.Local);
        } else {
            ElementDataService.delete(client, 'freezePosition');
        }
    }

    public static updatePlayerFreezePosition(client: PlayerMp) {
        if (!this.isPlayerFrozen(client)) return;

        ElementDataService.set(client, 'freezePosition', client.position, ShareMode.Local);
    }

    public static isPlayerFrozen(client: PlayerMp): boolean {
        return ElementDataService.get(client, 'isFrozen') as boolean || false;
    }

    public static getPlayerFrozenPosition(client: PlayerMp): Vector3 | null {
        return ElementDataService.get(client, 'freezePosition') as Vector3 || null;
    }

    private static updateFrozenPlayers(): void {
        const players = mp.players.toArray();
        for (const player of players) {
            if (this.isPlayerFrozen(player)) {
                const freezePos = this.getPlayerFrozenPosition(player);
                if (!freezePos) continue;

                const length = player.position.subtract(freezePos!).length();
                if (length > 0.1) {
                    player.position = freezePos;
                }
            }
        }
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

    public static getActivePlayerByUsername(username: string): PlayerMp | null {
        const players = mp.players.toArray();
        for (const player of players) {
            const name = player.name;
            if (name === username) {
                return player;
            }
        }
        return null;
    }

	/**
	 * @internal Direct database access - bypasses business logic
	 */
	public static async takeMoneyFromUserIdInternal(userId: number, amount: number): Promise<boolean> {
		const result = await Database.Execute('UPDATE users SET money = money - ? WHERE uid = ? AND money >= ?', [amount, userId, amount]);
		return result !== null && result.affectedRows > 0;
	}

	/**
	 * @internal Direct database access - bypasses business logic
	 */
	public static async giveMoneyToUserIdInternal(userId: number, amount: number): Promise<boolean> {
		const result = await Database.Execute('UPDATE users SET money = money + ? WHERE uid = ?', [amount, userId]);
		return result !== null && result.affectedRows > 0;
	}

	/**
	 * @internal Direct database access - bypasses business logic
	 */
	public static async takeBankMoneyFromUserIdInternal(userId: number, amount: number): Promise<boolean> {
		const result = await Database.Execute('UPDATE users SET bankMoney = bankMoney - ? WHERE uid = ? AND bankMoney >= ?', [
			amount,
			userId,
			amount
		]);
		return result !== null && result.affectedRows > 0;
	}

	/**
	 * @internal Direct database access - bypasses business logic
	 */
	public static async giveBankMoneyToUserIdInternal(userId: number, amount: number): Promise<boolean> {
		const result = await Database.Execute('UPDATE users SET bankMoney = bankMoney + ? WHERE uid = ?', [amount, userId]);
		return result !== null && result.affectedRows > 0;
	}
}
