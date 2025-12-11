import FetchService from '@/Services/Infrastructure/FetchService';
import MoneyService, { TransferTypeResult } from '@/Services/Core/MoneyService';
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

	private static async buildAtmData(player: PlayerMp) {
		const bankMoney = MoneyService.getPlayerBankMoney(player);
		const walletMoney = MoneyService.getPlayerMoney(player);
		const userId = ElementDataService.get(player, 'userId');
		const logs = await MoneyService.getPlayerMoneyLogs(player, 50, 0);

		return {
			bankMoney,
			walletMoney,
			userId,
			logs
		};
	}

	private static async onGetAtmData(player: PlayerMp, _data: any) {
		return await this.buildAtmData(player);
	}

	private static async onWithdraw(player: PlayerMp, data: { amount: number }) {
		const success = await MoneyService.withdrawFromBank(player, data.amount);

		if (success) {
			const atmData = await this.buildAtmData(player);
            NotificationService.addNotification(
                player,
                NotificationType.Success,
                translate('default.success'),
                translate('atm.withdraw.success')
            );

			return {
				success: true,
				...atmData
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
			const atmData = await this.buildAtmData(player);
            NotificationService.addNotification(
                player,
                NotificationType.Success,
                translate('default.success'),
                translate('atm.deposit.success')
            );

			return {
				success: true,
				...atmData
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

	private static async onTransfer(player: PlayerMp, _data: { targetUser: string; amount: number }) {
		const result = await MoneyService.transferMoneyToUser(player, _data.targetUser, _data.amount);

		if (result == TransferTypeResult.Success) {
            const atmData = await this.buildAtmData(player);
            NotificationService.addNotification(
                player,
                NotificationType.Success,
                translate('default.success'),
                translate('atm.transfer.success')
            );
            return {
                success: true,
                ...atmData
            };
        } else if (result == TransferTypeResult.TargetNotFound) {
            NotificationService.addNotification(
                player,
                NotificationType.Error,
                translate('default.error'),
                translate('atm.transfer.target_not_found')
            );
        } else if (result == TransferTypeResult.TargetNotLoggedIn) {
            NotificationService.addNotification(
                player,
                NotificationType.Error,
                translate('default.error'),
                translate('atm.transfer.target_not_logged_in')
            );
        } else if (result == TransferTypeResult.InsufficientFunds) {
            NotificationService.addNotification(
                player,
                NotificationType.Error,
                translate('default.error'),
                translate('atm.transfer.insufficient_funds')
            );
        } else {
            NotificationService.addNotification(
                player,
                NotificationType.Error,
                translate('default.error'),
                translate('atm.transfer.failed')
            );
        }

        return { success: false };
    }
}
