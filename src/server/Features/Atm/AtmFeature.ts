import FetchService from "@/Services/FetchService";
import MoneyService from "@/Features/Money/MoneyService";
import { AtmTransactionData } from "@shared/Models/MoneyLogData";
import NotificationService from "@/Services/NotificationService";
import { NotificationType } from "@shared/Models/NotificationType";
import translate from "@shared/Translation/Translation";

export default class AtmFeature {
    public static async init() {
        // Register fetch listener for getting ATM data
        FetchService.registerFetchListener('atm:getData', this.onGetAtmData.bind(this));
        
        // Register fetch listeners for transactions
        FetchService.registerFetchListener('atm:withdraw', this.onWithdraw.bind(this));
        FetchService.registerFetchListener('atm:deposit', this.onDeposit.bind(this));
    }

    private static async onGetAtmData(player: PlayerMp, _data: any) {
        const bankMoney = MoneyService.getPlayerBankMoney(player);
        const logs = await MoneyService.getPlayerMoneyLogs(player, 50, 0);
        
        // Convert logs to AtmTransactionData format
        const transactions: AtmTransactionData[] = (logs || []).map((log, index) => ({
            id: log.uid || index,
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
                id: log.uid || index,
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
        } else {
            NotificationService.addNotification(player, NotificationType.Error, translate('default.error'), translate('atm.insufficient_funds_withdraw'));
        }
        
        return { success: false };
    }

    private static async onDeposit(player: PlayerMp, data: { amount: number }) {
        const success = await MoneyService.depositToBank(player, data.amount);
        
        if (success) {
            const bankMoney = MoneyService.getPlayerBankMoney(player);
            const logs = await MoneyService.getPlayerMoneyLogs(player, 50, 0);
            
            const transactions: AtmTransactionData[] = (logs || []).map((log, index) => ({
                id: log.uid || index,
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
        } else {
            NotificationService.addNotification(player, NotificationType.Error, translate('default.error'), translate('atm.insufficient_funds_deposit'));
        }
        
        return { success: false };
    }
}
