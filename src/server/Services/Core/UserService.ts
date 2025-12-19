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
import { Op } from 'sequelize';

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

		try {
			const newUser = await UserEntity.createUser(username, email, password);
			return { userId: newUser.uid };
		} catch (error) {
			this.logger.error(`Failed to create user: ${error}`);
			return { userId: null, error: 'auth.register.failed' };
		}
	}

	public static async getUserById(uid: number): Promise<UserEntity | null> {
		return await UserEntity.findOne({ where: { uid } });
	}

	public static async getUserByUsername(username: string): Promise<UserEntity | null> {
		return await UserEntity.findOne({ where: { username } });
	}

	public static async getUserByEmail(email: string): Promise<UserEntity | null> {
		return await UserEntity.findOne({ where: { email } });
	}

	public static async getUserByUsernameOrEmail(identifier: string): Promise<UserEntity | null> {
		return await UserEntity.findOne({
			where: {
				[Op.or]: [{ username: identifier }, { email: identifier }]
			}
		});
	}

	public static async loginUser(identifier: string, password: string): Promise<LoginResult> {
		const user = await UserEntity.findOne({
			where: {
				[Op.or]: [{ username: identifier }, { email: identifier }]
			}
		});

		if (!user) {
			return { user: null, error: 'auth.login.failed' };
		}

		const passwordMatch = await PasswordHash.comparePasswords(password, user.passwordHash);
		if (!passwordMatch) {
			return { user: null, error: 'auth.login.failed' };
		}

		await user.update({ lastLogin: new Date() });

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
		client.name = user.username;

        if (user.characterVisuals.length === 0) {
            this.goToCharacterCreation(client);
            return;
        }
	}

	public static async savePlayerData(client: PlayerMp) {
		const userId = ElementDataService.get(client, 'userId') as number | null;
		if (!userId) return;

		const money = ElementDataService.get(client, 'money') as number | null;
		const bankMoney = ElementDataService.get(client, 'bankMoney') as number | null;
		const level = ElementDataService.get(client, 'level') as number | null;
		const exp = ElementDataService.get(client, 'exp') as number | null;

		try {
			await UserEntity.update(
				{
					money: money ?? 0,
					bankMoney: bankMoney ?? 0,
					level: level ?? 0,
					exp: exp ?? 0
				},
				{
					where: { uid: userId }
				}
			);
		} catch (error) {
			this.logger.error(`Failed to save player data: ${error}`);
		}
	}

	public static async savePlayers(): Promise<void> {
		const players = mp.players.toArray();

		// Save all players in parallel for better performance
		await Promise.allSettled(players.map((player) => this.savePlayerData(player)));

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
    }

	private static onPlayerQuit(client: PlayerMp) {
		this.savePlayerData(client);
		this.logger.info(`Saved data for player ${client.name} (ID: ${client.id}) on quit`);
	}

	public static spawnPlayerAtLocation(client: PlayerMp, spawn: SpawnLocation) {
		client.position = new mp.Vector3(spawn.position[0], spawn.position[1], spawn.position[2]);
		client.heading = spawn.position[3] || 0;
		client.alpha = 255;
		ElementDataService.set(client, 'spawnPosition', spawn.position, ShareMode.SpecificClient);
        this.setPlayerFrozen(client, false);
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
		try {
			const user = await UserEntity.findOne({ where: { uid: userId } });
			if (!user || user.money < amount) return false;

			await user.update({ money: user.money - amount });
			return true;
		} catch (error) {
			this.logger.error(`Failed to take money from user: ${error}`);
			return false;
		}
	}

	/**
	 * @internal Direct database access - bypasses business logic
	 */
	public static async giveMoneyToUserIdInternal(userId: number, amount: number): Promise<boolean> {
		try {
			const user = await UserEntity.findOne({ where: { uid: userId } });
			if (!user) return false;

			await user.update({ money: user.money + amount });
			return true;
		} catch (error) {
			this.logger.error(`Failed to give money to user: ${error}`);
			return false;
		}
	}

	/**
	 * @internal Direct database access - bypasses business logic
	 */
	public static async takeBankMoneyFromUserIdInternal(userId: number, amount: number): Promise<boolean> {
		try {
			const user = await UserEntity.findOne({ where: { uid: userId } });
			if (!user || user.bankMoney < amount) return false;

			await user.update({ bankMoney: user.bankMoney - amount });
			return true;
		} catch (error) {
			this.logger.error(`Failed to take bank money from user: ${error}`);
			return false;
		}
	}

	/**
	 * @internal Direct database access - bypasses business logic
	 */
	public static async giveBankMoneyToUserIdInternal(userId: number, amount: number): Promise<boolean> {
		try {
			const user = await UserEntity.findOne({ where: { uid: userId } });
			if (!user) return false;

			await user.update({ bankMoney: user.bankMoney + amount });
			return true;
		} catch (error) {
			this.logger.error(`Failed to give bank money to user: ${error}`);
			return false;
		}
	}
}
