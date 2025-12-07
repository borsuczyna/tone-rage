import FetchService from '@/Services/Infrastructure/FetchService';
import MoneyService from '@/Services/Core/MoneyService';
import { AtmTransactionData } from '@shared/Models/MoneyLogData';
import NotificationService from '@/Services/Infrastructure/NotificationService';
import { NotificationType } from '@shared/Models/NotificationType';
import translate from '@shared/Translation/Translation';
import ElementDataService from '@/Services/Infrastructure/ElementDataService';

export default class AtmFeature {
	public static async init() {
		// Register fetch listener for getting ATM data
		FetchService.registerFetchListener('atm:getData', this.onGetAtmData.bind(this));

		// Register fetch listeners for transactions
		FetchService.registerFetchListener('atm:withdraw', this.onWithdraw.bind(this));
		FetchService.registerFetchListener('atm:deposit', this.onDeposit.bind(this));
		FetchService.registerFetchListener('atm:transfer', this.onTransfer.bind(this));
	}

	private static async onGetAtmData(player: PlayerMp, _data: any) {
		const bankMoney = MoneyService.getPlayerBankMoney(player);
		const walletMoney = MoneyService.getPlayerMoney(player);
		const userId = ElementDataService.get(player, 'userId');
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
			walletMoney,
			userId,
			transactions
		};
	}

	private static async onWithdraw(player: PlayerMp, data: { amount: number }) {
		const success = await MoneyService.withdrawFromBank(player, data.amount);

		if (success) {
			const bankMoney = MoneyService.getPlayerBankMoney(player);
			const walletMoney = MoneyService.getPlayerMoney(player);
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
				walletMoney,
				transactions
			};
		} else {
			NotificationService.addNotification(
				player,
				NotificationType.Error,
				translate('default.error'),
				translate('atm.insufficient_funds_withdraw')
			);
		}

		return { success: false };
	}

	private static async onDeposit(player: PlayerMp, data: { amount: number }) {
		const success = await MoneyService.depositToBank(player, data.amount);

		if (success) {
			const bankMoney = MoneyService.getPlayerBankMoney(player);
			const walletMoney = MoneyService.getPlayerMoney(player);
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
				walletMoney,
				transactions
			};
		} else {
			NotificationService.addNotification(
				player,
				NotificationType.Error,
				translate('default.error'),
				translate('atm.insufficient_funds_deposit')
			);
		}

		return { success: false };
	}

	private static async onTransfer(player: PlayerMp, data: { targetUserId: number; amount: number }) {
		// For now, just return not implemented
		// This would require additional MoneyService methods for bank-to-bank transfers
		NotificationService.addNotification(
			player,
			NotificationType.Error,
			translate('default.error'),
			translate('atm.transfer_not_implemented')
		);

		return { success: false };
	}
}
