import { validateHash } from "@shared/Hash";
import Logger from "@shared/Logger";
import TimerService from "@shared/Services/TimerService";
import AnticheatService from "./AnticheatService";

interface FetchListener {
    eventName: string;
    callback: (client: PlayerMp, data: any) => void;
}

export default class FetchService {
    private static fetchListeners: FetchListener[] = [];
    private static hashHistory: Map<string, Date> = new Map();
    public static logger: Logger = Logger.getLogger(FetchService, true);

    public static async init() {
        mp.events.add('fetch:getData', this.onFetchRequest.bind(this));
        TimerService.setTimer(this.clearOldHashes.bind(this), 60000, 0);
    }

    public static getFetchListener(eventName: string): FetchListener | undefined {
        return this.fetchListeners.find(listener => listener.eventName === eventName);
    }

    public static registerFetchListener(eventName: string, callback: (client: PlayerMp, data: any) => void) {
        this.fetchListeners.push({ eventName, callback });
    }

    public static removeFetchListener(eventName: string, callback: (client: PlayerMp, data: any) => void) {
        this.fetchListeners = this.fetchListeners.filter(
            listener => listener.eventName !== eventName || listener.callback !== callback
        );
    }
    
    private static async onFetchRequest(client: PlayerMp, eventName: string, hash: string, dataAsJson: string) {
        if (!this.verifyHash(eventName, hash)) {
            AnticheatService.clientInvalidHash(client, eventName, hash, dataAsJson);
            return;
        }
        
        const listener = FetchService.getFetchListener(eventName);
        if (listener) {
            const data = JSON.parse(dataAsJson);
            const response = await listener.callback(client, data);
            client.call('fetch:receiveData', [hash, JSON.stringify(response)]);
        }
    }

    private static verifyHash(eventName: string, hash: string): boolean {
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

    public static async initDebug() {
        FetchService.registerFetchListener('getClientInfo', (client, { infoType }: { infoType: string }) => {
            if (infoType === 'version') {
                return client.name + ' - 1.0.0-debug';
            }

            return 'unknown';
        });
    }
}