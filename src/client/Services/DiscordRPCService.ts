import TimerService from '@shared/Services/TimerService';

interface PresenceData {
	details?: string;
	state?: string;
}

export default class DiscordRPCService {
	private static isConnected: boolean = false;
	private static presence: PresenceData = {};
	private static readonly updateInterval = 15000;

	public static init() {
		if (!mp.discord) return;

		this.isConnected = true;
		this.updatePresence({
			details: 'Loading into the game',
			state: mp.players.local?.name
		});

		TimerService.setTimer(this.refreshPresence.bind(this), this.updateInterval, 0);
	}

	public static updatePresence(data: PresenceData) {
		if (!this.isConnected || !mp.discord) return;

		const newPresence = { ...this.presence, ...data };
		if (newPresence.details === this.presence.details && newPresence.state === this.presence.state) return;

		this.presence = newPresence;
		mp.discord.update(this.presence.details || '', this.presence.state || '');
	}

	private static refreshPresence() {
		if (!this.isConnected || !mp.discord || !mp.players.local || !mp.players.local.handle) return;

		const streetHash = mp.game.ui.getCurrentStreetNameHash();
		const streetName = mp.game.ui.getStreetNameFromHashKey(streetHash) || 'Unknown street';

		const details = mp.players.local.isInAnyVehicle(false)
			? mp.players.local.vehicle
				? `Driving ${mp.game.vehicle.getDisplayNameFromVehicleModel(mp.players.local.vehicle.model)} at ${streetName}`
				: `Driving at ${streetName}`
			: `Walking at ${streetName}`;

		this.updatePresence({ details });
	}
}
