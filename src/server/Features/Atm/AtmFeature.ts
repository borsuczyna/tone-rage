import FetchService from '@/Services/Infrastructure/FetchService';
import MoneyService from '@/Services/Core/MoneyService';
import { AtmTransactionData } from '@shared/Models/MoneyLogData';
import NotificationService from '@/Services/Infrastructure/NotificationService';
import { NotificationType } from '@shared/Models/NotificationType';
import translate from '@shared/Translation/Translation';

export default class AtmFeature {
	public static async init() {
		// Register fetch listener for getting ATM data
		FetchService.registerFetchListener('atm:getData', this.onGetAtmData.bind(this));

		// Register fetch listeners for transactions
		FetchService.registerFetchListener('atm:withdraw', this.onWithdraw.bind(this));
		FetchService.registerFetchListener('atm:deposit', this.onDeposit.bind(this));
		FetchService.registerFetchListener('atm:transfer', this.onTransfer.bind(this));

		// Register listener for closing ATM
		mp.events.add('atm:close', (player: PlayerMp) => {
			// Handle ATM close if needed
		});
	}

	private static async onGetAtmData(player: PlayerMp, _data: any) {
		const bankMoney = MoneyService.getPlayerBankMoney(player);
		const walletMoney = MoneyService.getPlayerMoney(player);
		const logs = await MoneyService.getPlayerMoneyLogs(player, 50, 0);

		// Convert logs to AtmTransactionData format
		const transactions: AtmTransactionData[] = (logs || []).map((log, index) => ({
			id: log.uid || index,
			amount: log.amount, // Keep original amount with sign
			action: log.description || (log.amount > 0 ? 'Bank Account Deposit' : 'Bank Account Withdraw'),
			timestamp: log.createdAt ? new Date(log.createdAt).getTime() : Date.now(),
			type: log.amount > 0 ? 'deposit' : 'withdraw',
			description: log.description,
			date: log.createdAt,
			balanceAfter: log.amountBefore + log.amount
		}));

		return {
			bankMoney,
			walletMoney,
			transactions,
			username: player.name || 'Unknown Player',
			userId: player.id || 1
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
				amount: log.amount,
				action: log.description || (log.amount > 0 ? 'Bank Account Deposit' : 'Bank Account Withdraw'),
				timestamp: log.createdAt ? new Date(log.createdAt).getTime() : Date.now(),
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
				amount: log.amount,
				action: log.description || (log.amount > 0 ? 'Bank Account Deposit' : 'Bank Account Withdraw'),
				timestamp: log.createdAt ? new Date(log.createdAt).getTime() : Date.now(),
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

	private static async onTransfer(player: PlayerMp, data: { amount: number; target: string }) {
		// Find target player by name or account number
		let targetPlayer: PlayerMp | null = null;
		
		// Try to find by name first
		targetPlayer = mp.players.toArray().find(p => p.name === data.target) || null;
		
		// If not found by name, try by account number (WSB-USERNAME format)
		if (!targetPlayer && data.target.startsWith('WSB-')) {
			const username = data.target.replace('WSB-', '').toLowerCase();
			targetPlayer = mp.players.toArray().find(p => p.name.toLowerCase().replace(' ', '') === username) || null;
		}

		if (!targetPlayer) {
			NotificationService.addNotification(
				player,
				NotificationType.Error,
				translate('default.error'),
				'Player not found or not online'
			);
			return { success: false };
		}

		if (targetPlayer === player) {
			NotificationService.addNotification(
				player,
				NotificationType.Error,
				translate('default.error'),
				'Cannot transfer money to yourself'
			);
			return { success: false };
		}

		// Withdraw from sender
		const withdrawSuccess = await MoneyService.withdrawFromBank(player, data.amount);
		if (!withdrawSuccess) {
			NotificationService.addNotification(
				player,
				NotificationType.Error,
				translate('default.error'),
				'Insufficient funds for transfer'
			);
			return { success: false };
		}

		// Deposit to receiver
		const depositSuccess = await MoneyService.depositToBank(targetPlayer, data.amount);
		if (!depositSuccess) {
			// Refund if deposit fails
			await MoneyService.depositToBank(player, data.amount);
			NotificationService.addNotification(
				player,
				NotificationType.Error,
				translate('default.error'),
				'Transfer failed'
			);
			return { success: false };
		}

		// Notify both players
		NotificationService.addNotification(
			player,
			NotificationType.Success,
			translate('default.success'),
			`Transfer of ${data.amount}€ to ${targetPlayer.name} successful`
		);

		NotificationService.addNotification(
			targetPlayer,
			NotificationType.Success,
			translate('default.success'),
			`Received ${data.amount}€ from ${player.name}`
		);

		// Return updated data
		const bankMoney = MoneyService.getPlayerBankMoney(player);
		const walletMoney = MoneyService.getPlayerMoney(player);
		const logs = await MoneyService.getPlayerMoneyLogs(player, 50, 0);

		const transactions: AtmTransactionData[] = (logs || []).map((log, index) => ({
			id: log.uid || index,
			amount: log.amount,
			action: log.description || (log.amount > 0 ? 'Bank Account Deposit' : 'Bank Transfer To ' + targetPlayer.name),
			timestamp: log.createdAt ? new Date(log.createdAt).getTime() : Date.now(),
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
	}
}
