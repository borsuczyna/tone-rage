import NotificationService from '../Services/NotificationService';
import { NotificationType } from '../../shared/Models/NotificationType';

export default class NotificationServiceTest {
	public static init() {
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
}