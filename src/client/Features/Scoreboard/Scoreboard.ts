import ElementDataService from '@/Services/Infrastructure/ElementDataService';
import InterfaceService from '@/Services/Infrastructure/InterfaceService';
import KeyboardService, { KeyState } from '@/Services/Utility/KeyboardService';
import FetchService from '@/Services/Infrastructure/FetchService';
import { ScoreboardPlayerItem } from '@shared/Models/ScoreboardData';
import TimerService, { Timer } from '@shared/Services/TimerService';
import EmblemaService from '@shared-rage/Services/EmblemaService';
import Chat from '../Chat/Chat';

export default class Scoreboard {
	private static hideTimer: Timer | null = null;
	private static visible: boolean = false;

	public static async init() {
		this.setVisible(false);
		KeyboardService.registerKeyHandler('Tab', this.onTabKey.bind(this));

		// Register fetch listener for scoreboard data
		FetchService.registerFetchListener('scoreboard:getData', this.getScoreboardData.bind(this));
	}

	public static setVisible(visible: boolean) {
		if (this.visible === visible) return;

		this.visible = visible;

		if (visible) {
			if (InterfaceService.isInterfaceVisible('AtmInterface') || Chat.chatInputOpen) {
				return;
			}

			InterfaceService.setInterfaceVisible('ScoreboardInterface', true);

			if (this.hideTimer) {
				TimerService.killTimer(this.hideTimer);
				this.hideTimer = null;
			}
		} else {
			InterfaceService.callInterfaceEvent('playScoreboardHideAnimation', null);
			this.hideTimer = TimerService.setTimer(this.finalizeHide.bind(this), 500, 1);
		}
	}

	private static finalizeHide() {
		InterfaceService.setInterfaceVisible('ScoreboardInterface', false);
		this.hideTimer = null;
	}

	private static getScoreboardData(): ScoreboardPlayerItem[] {
		let result: ScoreboardPlayerItem[] = [];
		let players = mp.players.toArray();

		for (let player of players) {
			const id = player.id;
			const userId = ElementDataService.get(player, 'userId');
			const username = player.name;
			const level = ElementDataService.get(player, 'level') || 0;
			const ping = player.ping;
			const adminLevel = ElementDataService.get(player, 'adminLevel') || 0;
			const status = userId == null ? 'logging-in' : ElementDataService.get(player, 'status') || 'playing';
			const emblemas = EmblemaService.getPlayerEmblems(player, adminLevel);

			result.push({
				id,
				username,
				level,
				ping,
				adminLevel,
				status,
				emblemas
			});
		}

		return result;
	}

	private static onTabKey(state: KeyState) {
		const spawned = ElementDataService.get(mp.players.local, 'spawnPosition') !== undefined;
		if (!spawned) return;

		if (state === KeyState.Up) {
			this.setVisible(!this.visible);
		}
	}
}
