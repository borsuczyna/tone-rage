import { validateHash } from "@shared/Hash";
import Logger from "@shared/Logger";
import TimerService from "@shared/Services/TimerService";

export default class AnticheatService {
    private static hashHistory: Map<string, Date> = new Map();
    private static logger: Logger = Logger.getLogger(AnticheatService, true);

    public static init() {
        TimerService.setTimer(this.clearOldHashes.bind(this), 60000, 0);
    }

    public static clientInvalidHash(client: PlayerMp, eventName: string, hash: string, eventData: string) {
        this.logger.warn(`Client sent invalid hash: player=${client.name}, event=${eventName}, hash=${hash}`);
        client.kick('Anticheat: A1');
    }

    public static verifyHash(eventName: string, hash: string): boolean {
        const lastUsed = this.hashHistory.get(hash);
        const now = new Date();
        const timeElapsed = lastUsed ? (now.getTime() - lastUsed.getTime()) / 1000 : Infinity;

        if (timeElapsed < 60) {
            return false; // Hash resent too soon
        }

        this.hashHistory.set(hash, now);
        return validateHash(eventName, hash);
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
}