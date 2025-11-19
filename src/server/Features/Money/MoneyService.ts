import Database from "@/Database/Database";
import { MoneyLogEntity, MoneyLogType } from "@/Database/Entities/MoneyLogEntity";
import ElementDataService from "@/Services/ElementDataService";
import { ShareMode } from "@shared/Models/ElementDataModels";
import EventService from "@/Services/EventService";
import UserService from "@/Features/User/UserService";

export default class MoneyService {
    public static async getPlayerMoneyLogs(player: PlayerMp | number, limit: number = 50, skip: number = 0): Promise<MoneyLogEntity[] | null> {
        const userId = typeof player === 'number' ? player : ElementDataService.get(player, 'userId');
        if (!userId) return null;

        const logs = await Database.Select<MoneyLogEntity>(MoneyLogEntity, 'SELECT * FROM moneyLogs WHERE userId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?', [userId, limit, skip]);
        return logs;
    }

    public static async addMoneyLog(player: PlayerMp | number, amount: number, amountBefore: number, type: MoneyLogType, description: string): Promise<boolean> {
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

    public static async depositToBank(player: PlayerMp, amount: number): Promise<boolean> {
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

        const userId = ElementDataService.get(player, 'userId');
        if (userId) {
            await this.addMoneyLog(player, amount, currentMoney, MoneyLogType.ATMDeposit, 'ATM Deposit');
            await UserService.takeMoneyFromUserIdInternal(userId, amount);
            await UserService.giveBankMoneyToUserIdInternal(userId, amount);
        }

        return true;
    }

    public static async withdrawFromBank(player: PlayerMp, amount: number): Promise<boolean> {
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

        const userId = ElementDataService.get(player, 'userId');
        if (userId) {
            await this.addMoneyLog(player, -amount, currentMoney, MoneyLogType.ATMWithdraw, 'ATM Withdrawal');
            await UserService.giveMoneyToUserIdInternal(userId, amount);
            await UserService.takeBankMoneyFromUserIdInternal(userId, amount);
        }

        return true;
    }
}