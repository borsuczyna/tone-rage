import ElementDataService from '@/Services/Infrastructure/ElementDataService';
import EventService from '@/Services/Infrastructure/EventService';
import NotificationService from '@/Services/Infrastructure/NotificationService';
import Logger from '@shared/Logger';
import { Emblema } from '@shared/Models/Emblema';
import { NotificationType } from '@shared/Models/NotificationType';
import SharedConfig from '@shared/SharedConfig';
import translate from '@shared/Translation/Translation';

export default class Chat {
	private static logger = Logger.getLogger(Chat, true);
	private static timeoutData: Map<number, number> = new Map();

	public static async init() {
		EventService.registerEventHandler('chat:sendMessage', this.onChatMessageSend.bind(this));
	}

	public static isPlayerInTimeout(playerId: number): boolean {
		const timeoutEnd = this.timeoutData.get(playerId);
		if (timeoutEnd && timeoutEnd > new Date().getTime()) {
			return true;
		}

		this.timeoutData.set(playerId, new Date().getTime() + SharedConfig.ChatMessageTimeout * 1000);
		return false;
	}

	private static onChatMessageSend(client: PlayerMp, message: string) {
		message = message.trim();
		if (message.length === 0) {
			return;
		}

		if (this.isPlayerInTimeout(client.id)) {
			NotificationService.addNotification(client, NotificationType.Error, translate('default.error'), translate('chat.messageTimeout'));
			return;
		}

		const userId = ElementDataService.get(client, 'userId');
		if (!userId) {
			this.logger.warn(`Player ${client.name} tried to send a message without being authenticated.`);
			return;
		}

		if (message.length > SharedConfig.MaxChatMessageLength) {
			this.logger.warn(`Player ${client.name} tried to send a message exceeding max length.`);
			NotificationService.addNotification(client, NotificationType.Error, translate('default.error'), translate('chat.messageTooLong'));
			return;
		}

		const playersInRange = this.getPlayersInRange(client.position, SharedConfig.LocalChatRange);
		for (const player of playersInRange) {
			this.outputChatMessage(player, client, message);
		}
	}

	public static outputChatMessage(player: PlayerMp, owner: PlayerMp | string, message: string, emblemas: Emblema[] = [], overrideName?: string) {
		EventService.triggerClientEvent(player, 'chat:receiveMessage', typeof owner === 'string' ? owner : owner.id, message, emblemas, overrideName);
	}

	private static getPlayersInRange(position: Vector3, range: number): PlayerMp[] {
		return mp.players.toArray().filter((player) => {
			const length = player.position.subtract(position).length();
			return length <= range;
		});
	}
}
