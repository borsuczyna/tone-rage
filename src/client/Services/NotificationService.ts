import { NotificationType } from '@shared/Models/NotificationType';
import InterfaceService from './InterfaceService';

export default class NotificationService {
	public static init() {
		InterfaceService.setInterfaceVisible('NotificationsInterface', true);
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
