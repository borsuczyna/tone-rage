import { MoneyLogType } from "@/Database/Entities/MoneyLogEntity";
import MoneyService from "@/Features/Money/MoneyService";
import NotificationService from "@/Services/NotificationService";
import { NotificationType } from "@shared/Models/NotificationType";

export default class MoneyServiceTest {
    public static init() {
        mp.events.addCommand('addmoney', this.addMoneyCommand.bind(this));
        mp.events.addCommand('takemoney', this.takeMoneyCommand.bind(this));
        mp.events.addCommand('moneylogs', this.moneyLogsCommand.bind(this));
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
            NotificationService.addNotification(player, NotificationType.Error, 'Money Service', `Failed to take money. You may not have enough funds.`);
        }
    }

    private static async moneyLogsCommand(player: PlayerMp, _fullText: string) {
        const logs = await MoneyService.getPlayerMoneyLogs(player, 10, 0);
        if (logs && logs.length > 0) {
            let message = 'Recent Money Logs:\n';
            logs.forEach(log => {
                message += `[${log.createdAt.toISOString()}] Type: ${MoneyLogType[log.type]}, Amount: $${log.amount}, Description: ${log.description}\n`;
            });
            NotificationService.addNotification(player, NotificationType.Info, 'Money Service', message);
        } else {
            NotificationService.addNotification(player, NotificationType.Info, 'Money Service', 'No money logs found.');
        }
    }
}