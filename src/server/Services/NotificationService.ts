import { NotificationType } from '@shared/Models/NotificationType';
import EventService from './EventService';

export default class NotificationService {
	public static addNotification(client: PlayerMp, type: NotificationType, title: string, message: string, icon?: string, iconFillOpacity?: number) {
        EventService.triggerClientEvent(client, 'notification:addNotification', {
            type,
            title,
            message,
            icon,
            iconFillOpacity
        });
	}
}
