import TimerService from '@shared/Services/TimerService';

export default class PlayerBlipsService {
	private static blips: Map<number, BlipMp> = new Map();

	public static init() {
		TimerService.setTimer(this.updateBlipPositions.bind(this), 100, 0);
		mp.events.add('playerQuit', this.onPlayerQuit.bind(this));
	}

	public static destroyPlayerBlip(playerId: number) {
		const blip = this.blips.get(playerId);
		if (blip) {
			blip.destroy();
			this.blips.delete(playerId);
		}
	}

	public static createPlayerBlip(player: PlayerMp) {
		if (this.blips.has(player.id)) return;

		const blip = mp.blips.new(1, player.position, {
			name: player.name,
			color: 4,
			scale: 0.7,
			shortRange: true,
			dimension: 0
		});

		this.blips.set(player.id, blip);
	}

	private static updateBlipPositions() {
		const updated: number[] = [];
		mp.players.forEach((player) => {
			const position = player.position;
			const blip = this.blips.get(player.id);
			if (blip) {
				blip.position = position;
			} else {
				this.createPlayerBlip(player);
			}

			updated.push(player.id);
		});

		// Remove blips for players no longer in range
		this.blips.forEach((_, playerId) => {
			if (!updated.includes(playerId)) {
				this.destroyPlayerBlip(playerId);
			}
		});
	}

	private static onPlayerQuit(player: PlayerMp) {
		this.destroyPlayerBlip(player.id);
	}
}
