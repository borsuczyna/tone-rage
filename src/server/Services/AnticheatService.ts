import { validateHash, generateSalt } from '@shared/Hash';
import Logger from '@shared/Logger';
import TimerService from '@shared/Services/TimerService';

export default class AnticheatService {
	private static hashHistory: Map<string, Date> = new Map();
	private static logger: Logger = Logger.getLogger(AnticheatService, true);
	private static serverSalt: string = generateSalt();
	private static playerSalts: Map<number, string> = new Map();

	public static init() {
		TimerService.setTimer(this.clearOldHashes.bind(this), 60000, 0);
	}

	public static getServerSalt(): string {
		return this.serverSalt;
	}

	public static generatePlayerSalt(playerId: number): string {
		const salt = generateSalt();
		this.playerSalts.set(playerId, salt);
		return salt;
	}

	public static getPlayerSalt(playerId: number): string | undefined {
		return this.playerSalts.get(playerId);
	}

	public static removePlayerSalt(playerId: number): void {
		this.playerSalts.delete(playerId);
	}

	public static getFullSalt(playerId: number): string {
		const playerSalt = this.playerSalts.get(playerId);
		if (!playerSalt) {
			this.logger.error(`Player salt not found for player ID: ${playerId}`);
			throw new Error(`Player salt not found for player ID: ${playerId}`);
		}
		return `${this.serverSalt}:${playerSalt}`;
	}

	public static clientInvalidHash(client: PlayerMp, eventName: string, hash: string, eventData: string) {
		this.logger.error(`Client sent invalid hash: player=${client.name}, event=${eventName}, hash=${hash}, data=${eventData}`);
		this.kick(client, 'Anticheat: A1');
	}

	public static verifyHash(eventName: string, hash: string, playerId: number): boolean {
		const lastUsed = this.hashHistory.get(hash);
		const now = new Date();
		const timeElapsed = lastUsed ? (now.getTime() - lastUsed.getTime()) / 1000 : Infinity;

		if (timeElapsed < 60) {
			return false; // Hash resent too soon
		}

		this.hashHistory.set(hash, now);
		const fullSalt = this.getFullSalt(playerId);
		return validateHash(eventName, hash, fullSalt);
	}

	private static clearOldHashes() {
		const now = new Date();
		this.hashHistory.forEach((lastUsed, hash) => {
			const timeElapsed = (now.getTime() - lastUsed.getTime()) / 1000;
			if (timeElapsed > 60) {
				this.hashHistory.delete(hash);
			}
		});
	}

	public static kick(client: PlayerMp, reason: string) {
		// client.kick(reason);
		this.logger.info(`Kicked player ${client.name} for reason: ${reason}`);
	}
}