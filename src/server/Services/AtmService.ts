import FetchService from "./FetchService";
import MoneyService from "./MoneyService";
import EventService from "./EventService";
import { AtmTransactionData } from "@shared/Models/MoneyLogData";

export default class AtmService {
    public static async init() {
        // Register the command to open ATM interface
        mp.events.addCommand('atm', this.onAtmCommand.bind(this));
        
        // Register fetch listener for getting ATM data
        FetchService.registerFetchListener('atm:getData', this.onGetAtmData.bind(this));
        
        // Register fetch listeners for transactions
        FetchService.registerFetchListener('atm:withdraw', this.onWithdraw.bind(this));
        FetchService.registerFetchListener('atm:deposit', this.onDeposit.bind(this));
    }

    private static onAtmCommand(player: PlayerMp) {
        // Toggle the ATM interface visibility
        EventService.triggerClientEvent(player, 'atm:toggle');
    }

    private static async onGetAtmData(player: PlayerMp, data: any) {
        const bankMoney = MoneyService.getPlayerBankMoney(player);
        const logs = await MoneyService.getPlayerMoneyLogs(player, 50, 0);
        
        // Convert logs to AtmTransactionData format
        const transactions: AtmTransactionData[] = (logs || []).map((log, index) => ({
            id: log.id || index,
            amount: Math.abs(log.amount),
            type: log.amount > 0 ? 'deposit' : 'withdraw',
            description: log.description,
            date: log.createdAt,
            balanceAfter: log.amountBefore + log.amount
        }));

        return {
            bankMoney,
            transactions
        };
    }

    private static async onWithdraw(player: PlayerMp, data: { amount: number }) {
        const success = await MoneyService.withdrawFromBank(player, data.amount);
        
        if (success) {
            const bankMoney = MoneyService.getPlayerBankMoney(player);
            const logs = await MoneyService.getPlayerMoneyLogs(player, 50, 0);
            
            const transactions: AtmTransactionData[] = (logs || []).map((log, index) => ({
                id: log.id || index,
                amount: Math.abs(log.amount),
                type: log.amount > 0 ? 'deposit' : 'withdraw',
                description: log.description,
                date: log.createdAt,
                balanceAfter: log.amountBefore + log.amount
            }));

            return {
                success: true,
                bankMoney,
                transactions
            };
        }
        
        return { success: false };
    }

    private static async onDeposit(player: PlayerMp, data: { amount: number }) {
        const success = await MoneyService.depositToBank(player, data.amount);
        
        if (success) {
            const bankMoney = MoneyService.getPlayerBankMoney(player);
            const logs = await MoneyService.getPlayerMoneyLogs(player, 50, 0);
            
            const transactions: AtmTransactionData[] = (logs || []).map((log, index) => ({
                id: log.id || index,
                amount: Math.abs(log.amount),
                type: log.amount > 0 ? 'deposit' : 'withdraw',
                description: log.description,
                date: log.createdAt,
                balanceAfter: log.amountBefore + log.amount
            }));

            return {
                success: true,
                bankMoney,
                transactions
            };
        }
        
        return { success: false };
    }
}
