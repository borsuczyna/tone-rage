import { decodeData } from "@shared/DataEncoder";
import AnticheatService from "./AnticheatService";

interface EventListener {
    eventName: string;
    callback: (client: PlayerMp, ...args: any[]) => void;
}

export default class EventService {
    private static listeners: EventListener[] = [];

    public static init() {
        mp.events.add('event:trigger', this.onEventTriggered.bind(this));
    }

    public static registerListener(eventName: string, callback: (...args: any[]) => void) {
        this.listeners.push({ eventName, callback });
    }

    public static removeListener(eventName: string, callback: (...args: any[]) => void) {
        this.listeners = this.listeners.filter(
            listener => listener.eventName !== eventName || listener.callback !== callback
        );
    }

    private static onEventTriggered(client: PlayerMp, hash: string, eventName: string, encodedData: string) {
        if (!AnticheatService.verifyHash(eventName, hash)) {
            AnticheatService.clientInvalidHash(client, eventName, hash, encodedData);
            return;
        }

        const decodedData = decodeData<any[]>(encodedData);
        const listeners = this.listeners.filter(listener => listener.eventName === eventName);
        listeners.forEach(listener => listener.callback(client, ...decodedData));
    }
}