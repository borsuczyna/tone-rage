import Logger from "@shared/Logger";

export default class AnticheatService {
    private static logger: Logger = Logger.getLogger(AnticheatService, true);

    public static clientInvalidHash(client: PlayerMp, eventName: string, hash: string, eventData: string) {
        this.logger.warn(`Client sent invalid hash: player=${client.name}, event=${eventName}, hash=${hash}`);
        client.kick('Anticheat: A1');
    }
}