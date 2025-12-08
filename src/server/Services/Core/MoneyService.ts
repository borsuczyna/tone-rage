import Database from '@/Database/Database';
import { MoneyLogEntity } from '@/Database/Entities/MoneyLogEntity';
import ElementDataService from '@/Services/Infrastructure/ElementDataService';
import { ShareMode } from '@shared/Models/ElementDataModels';
import EventService from '@/Services/Infrastructure/EventService';
import UserService from '@/Services/Core/UserService';
import { MoneyLogType } from '@shared/Models/MoneyLogData';

export enum TransferTypeResult {
    Success = 0,
    InsufficientFunds = 1,
    TargetNotFound = 2,
    TargetNotActive = 3,
    TargetNotLoggedIn = 4,
}

export default class MoneyService {
	public static async getPlayerMoneyLogs(player: PlayerMp | number, limit: number = 50, skip: number = 0): Promise<MoneyLogEntity[] | null> {
		const userId = typeof player === 'number' ? player : ElementDataService.get(player, 'userId');
		if (!userId) return null;

		const logs = await Database.Select<MoneyLogEntity>(
			MoneyLogEntity,
			'SELECT * FROM moneyLogs WHERE userId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?',
			[userId, limit, skip]
		);
		return logs;
	}

	public static async addMoneyLog(
		player: PlayerMp | number,
		amount: number,
		amountBefore: number,
		type: MoneyLogType,
		description: string
	): Promise<boolean> {
		const userId = typeof player === 'number' ? player : ElementDataService.get(player, 'userId');
		if (!userId) return false;

		const log = MoneyLogEntity.create(userId, amount, amountBefore, type, description);
		const insertId = await Database.InsertEntity<MoneyLogEntity>('moneyLogs', log);

		return !!insertId;
	}

	public static getPlayerMoney(player: PlayerMp): number {
		return parseInt(ElementDataService.get(player, 'money') || '0');
	}

	public static getPlayerBankMoney(player: PlayerMp): number {
		return parseInt(ElementDataService.get(player, 'bankMoney') || '0');
	}

	public static async takePlayerMoney(player: PlayerMp, amount: number, type: MoneyLogType, description: string): Promise<boolean> {
		const userId = ElementDataService.get(player, 'userId');
		if (!userId) return false;

		const currentMoney: number = this.getPlayerMoney(player);
		if (currentMoney < amount) {
			return false;
		}

		const newAmount = currentMoney - amount;
		ElementDataService.set(player, 'money', newAmount, ShareMode.SpecificClient);
		EventService.triggerClientEvent(player, 'money:update', newAmount);

		await UserService.takeMoneyFromUserIdInternal(userId, amount);
		await this.addMoneyLog(player, -amount, currentMoney, type, description);

		return true;
	}

	public static async givePlayerMoney(player: PlayerMp, amount: number, type: MoneyLogType, description: string): Promise<boolean> {
		const userId = ElementDataService.get(player, 'userId');
		if (!userId) return false;

		const currentMoney: number = this.getPlayerMoney(player);
		const newAmount = currentMoney + amount;
		ElementDataService.set(player, 'money', newAmount, ShareMode.SpecificClient);
		EventService.triggerClientEvent(player, 'money:update', newAmount);

		await UserService.giveMoneyToUserIdInternal(userId, amount);
		await this.addMoneyLog(player, amount, currentMoney, type, description);

		return true;
	}

    public static async givePlayerBankMoney(player: PlayerMp, amount: number, type: MoneyLogType, description: string): Promise<boolean> {
        const userId = ElementDataService.get(player, 'userId');
        if (!userId) return false;

        const currentBankMoney: number = this.getPlayerBankMoney(player);
        const newAmount = currentBankMoney + amount;
        ElementDataService.set(player, 'bankMoney', newAmount, ShareMode.Server);
        EventService.triggerClientEvent(player, 'bankMoney:update', newAmount);
        await UserService.giveBankMoneyToUserIdInternal(userId, amount);
        await this.addMoneyLog(player, amount, currentBankMoney, type, description);

        return true;
    }

    public static async takePlayerBankMoney(player: PlayerMp, amount: number, type: MoneyLogType, description: string): Promise<boolean> {
        const userId = ElementDataService.get(player, 'userId');
        if (!userId) return false;

        const currentBankMoney: number = this.getPlayerBankMoney(player);
        if (currentBankMoney < amount) {
            return false;
        }

        const newAmount = currentBankMoney - amount;
        ElementDataService.set(player, 'bankMoney', newAmount, ShareMode.Server);
        EventService.triggerClientEvent(player, 'bankMoney:update', newAmount);
        await UserService.takeBankMoneyFromUserIdInternal(userId, amount);
        await this.addMoneyLog(player, -amount, currentBankMoney, type, description);

        return true;
    }

	public static async depositToBank(player: PlayerMp, amount: number): Promise<boolean> {
        const userId = ElementDataService.get(player, 'userId');
        if (!userId) return false;

		if (amount <= 0) {
			return false;
		}

		const currentMoney: number = this.getPlayerMoney(player);
		if (currentMoney < amount) {
			return false;
		}

		const currentBankMoney: number = this.getPlayerBankMoney(player);

		ElementDataService.set(player, 'money', currentMoney - amount, ShareMode.SpecificClient);
		ElementDataService.set(player, 'bankMoney', currentBankMoney + amount, ShareMode.Server);

		EventService.triggerClientEvent(player, 'money:update', currentMoney - amount);
		EventService.triggerClientEvent(player, 'bankMoney:update', currentBankMoney + amount);

		if (userId) {
			await this.addMoneyLog(player, amount, currentMoney, MoneyLogType.ATMDeposit, 'ATM Deposit');
			await UserService.takeMoneyFromUserIdInternal(userId, amount);
			await UserService.giveBankMoneyToUserIdInternal(userId, amount);
		}

		return true;
	}

	public static async withdrawFromBank(player: PlayerMp, amount: number): Promise<boolean> {
        const userId = ElementDataService.get(player, 'userId');
        if (!userId) return false;
        
		if (amount <= 0) {
			return false;
		}

		const currentBankMoney: number = this.getPlayerBankMoney(player);
		if (currentBankMoney < amount) {
			return false;
		}

		const currentMoney: number = this.getPlayerMoney(player);

		ElementDataService.set(player, 'bankMoney', currentBankMoney - amount, ShareMode.Server);
		ElementDataService.set(player, 'money', currentMoney + amount, ShareMode.SpecificClient);

		EventService.triggerClientEvent(player, 'bankMoney:update', currentBankMoney - amount);
		EventService.triggerClientEvent(player, 'money:update', currentMoney + amount);

		if (userId) {
			await this.addMoneyLog(player, -amount, currentMoney, MoneyLogType.ATMWithdraw, 'ATM Withdrawal');
			await UserService.giveMoneyToUserIdInternal(userId, amount);
			await UserService.takeBankMoneyFromUserIdInternal(userId, amount);
		}

		return true;
	}

    public static async transferMoneyToActiveUser(player: PlayerMp, targetUser: string, amount: number): Promise<TransferTypeResult> {
        const userId = ElementDataService.get(player, 'userId');
        if (!userId) return TransferTypeResult.TargetNotFound;

        let user = await UserService.getActivePlayerByUsername(targetUser);
        if (!user) {
            const targetUserId = parseInt(targetUser);
            user = await UserService.getActivePlayerByUserId(targetUserId);
        }

        if (!user) return TransferTypeResult.TargetNotFound;

        const targetUSerId = ElementDataService.get(user, 'userId');
        if (!targetUSerId) return TransferTypeResult.TargetNotLoggedIn;

        // Take money from player
        const success = await this.takePlayerBankMoney(player, amount, MoneyLogType.Transfer, `Transfer to ${user.name} (${targetUSerId})`);
        if (!success) return TransferTypeResult.InsufficientFunds;

        // Give money to target user
        await this.givePlayerBankMoney(user, amount, MoneyLogType.Transfer, `Transfer from ${player.name} (${userId})`);

        return TransferTypeResult.Success;
    }

    public static async transferMoneyToInactiveUser(player: PlayerMp, targetUser: string, amount: number): Promise<TransferTypeResult> {
        const userId = ElementDataService.get(player, 'userId');
        if (!userId) return TransferTypeResult.TargetNotFound;

        let targetUserId: number | null = null;
        let user = await UserService.getUserByUsername(targetUser);
        if (!user) {
            targetUserId = parseInt(targetUser);
            user = await UserService.getUserById(targetUserId);
        }

        if (!user) return TransferTypeResult.TargetNotFound;

        targetUserId = user.uid;

        // Take money from player
        const success = await this.takePlayerBankMoney(player, amount, MoneyLogType.Transfer, `Transfer to ${user.username} (${targetUserId})`);
        if (!success) return TransferTypeResult.InsufficientFunds;

        // Give money to target user
        await UserService.giveBankMoneyToUserIdInternal(targetUserId, amount);
        await this.addMoneyLog(targetUserId, amount, 0, MoneyLogType.Transfer, `Transfer from ${player.name} (${userId})`);

        return TransferTypeResult.Success;
    }

    public static async transferMoneyToUser(player: PlayerMp, targetUser: string, amount: number): Promise<TransferTypeResult> {
        const activeUser = await this.transferMoneyToActiveUser(player, targetUser, amount);
        if (activeUser !== TransferTypeResult.TargetNotFound) {
            return activeUser;
        }

        const inactiveUser = await this.transferMoneyToInactiveUser(player, targetUser, amount);
        return inactiveUser;
    }
}
