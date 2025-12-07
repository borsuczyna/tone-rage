import { NotificationType } from '@shared/Models/NotificationType';
import InterfaceService from './InterfaceService';
import EventService from './EventService';

export default class NotificationService {
	public static init() {
		InterfaceService.setInterfaceVisible('NotificationsInterface', true);
		EventService.registerEventHandler('notification:addNotification', this.addNotificationEventHandler.bind(this));
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

	private static addNotificationEventHandler(data: {
		type: NotificationType;
		title: string;
		message: string;
		icon?: string;
		iconFillOpacity?: number;
	}) {
		NotificationService.addNotification(data.type, data.title, data.message, data.icon, data.iconFillOpacity);
	}
}
