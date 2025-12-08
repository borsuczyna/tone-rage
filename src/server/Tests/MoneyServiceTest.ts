import MoneyService from '@/Services/Core/MoneyService';
import NotificationService from '@/Services/Infrastructure/NotificationService';
import { MoneyLogType } from '@shared/Models/MoneyLogData';
import { NotificationType } from '@shared/Models/NotificationType';

export default class MoneyServiceTest {
	public static init() {
		mp.events.addCommand('addmoney', this.addMoneyCommand.bind(this));
		mp.events.addCommand('takemoney', this.takeMoneyCommand.bind(this));
	}

	private static async addMoneyCommand(player: PlayerMp, _fullText: string, amountStr: string) {
		if (!amountStr) {
			NotificationService.addNotification(player, NotificationType.Error, 'Money Service', 'Usage: /addmoney [amount]');
			return;
		}

		const amount = parseInt(amountStr);
		const success = await MoneyService.givePlayerMoney(player, amount, MoneyLogType.Salary, 'Test add money');
		if (success) {
			NotificationService.addNotification(player, NotificationType.Success, 'Money Service', `Added $${amount} to your account.`);
		} else {
			NotificationService.addNotification(player, NotificationType.Error, 'Money Service', `Failed to add money.`);
		}
	}

	private static async takeMoneyCommand(player: PlayerMp, _fullText: string, amountStr: string) {
		if (!amountStr) {
			NotificationService.addNotification(player, NotificationType.Error, 'Money Service', 'Usage: /takemoney [amount]');
			return;
		}

		const amount = parseInt(amountStr);
		const success = await MoneyService.takePlayerMoney(player, amount, MoneyLogType.Purchase, 'Test take money');
		if (success) {
			NotificationService.addNotification(player, NotificationType.Success, 'Money Service', `Took $${amount} from your account.`);
		} else {
			NotificationService.addNotification(
				player,
				NotificationType.Error,
				'Money Service',
				`Failed to take money. You may not have enough funds.`
			);
		}
	}
}
