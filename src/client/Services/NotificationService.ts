import { NotificationType } from "@shared/Models/NotificationType";
import InterfaceService from "./InterfaceService";

export default class NotificationService {
    public static init() {
        InterfaceService.setInterfaceVisible("NotificationsInterface", true);
    }

    public static initDebug() {
        mp.events.add('playerCommand', (command: string) => {
            const args = command.split(' ');
            const commandName = args[0].toLowerCase();

            if (commandName === 'adn') {
                const title = 'Achievement Unlocked!';
                const message = 'You have unlocked a new achievement.';
                NotificationService.addNotification(NotificationType.Info, title, message);
            }
        });
    }

    public static addNotification(type: NotificationType, title: string, message: string, icon?: string, iconFillOpacity?: number) {
        InterfaceService.callInterfaceEvent('addNotification', {
            type,
            title,
            message,
            icon,
            iconFillOpacity
        });
    }
}