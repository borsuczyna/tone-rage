import { generateHash, validateHash } from "@shared/Hash";
import InterfaceService from "./InterfaceService";
import Logger from "@shared/Logger";

interface FetchResolver {
    resolve: (data: any) => void;
    reject: (error: any) => void;
}

interface FetchListener {
    eventName: string;
    callback: (data: any) => void;
}

export default class FetchService {
    private static pendingFetches: Record<string, FetchResolver> = {};
    private static fetchListeners: FetchListener[] = [];
    public static logger: Logger = Logger.getLogger(FetchService);

    public static async init() {
        mp.events.add('interface:fetchData', this.onFetchRequest.bind(this));
        mp.events.add('fetch:receiveData', this.receiveFetchData.bind(this));
    }

    public static getFetchListener(eventName: string): FetchListener | undefined {
        return this.fetchListeners.find(listener => listener.eventName === eventName);
    }

    public static registerFetchListener(eventName: string, callback: (data: any) => void) {
        this.fetchListeners.push({ eventName, callback });
    }

    public static removeFetchListener(eventName: string, callback: (data: any) => void) {
        this.fetchListeners = this.fetchListeners.filter(
            listener => listener.eventName !== eventName || listener.callback !== callback
        );
    }

    public static async fetchData<T>(eventName: string, data: any): Promise<T> {
        const hash = generateHash(eventName);
        mp.events.callRemote('fetch:getData', eventName, hash, JSON.stringify(data));

        return new Promise<T>((resolve, reject) => {
            this.pendingFetches[hash] = { resolve, reject };
        });
    }

    private static async onFetchRequest(eventName: string, hash: string, client: boolean, dataAsJson: string) {
        if (!validateHash(eventName, hash)) {
            FetchService.logger.warn(`Invalid hash for fetch request: event=${eventName}, hash=${hash}`);
            return;
        }
        
        const data = JSON.parse(dataAsJson);

        if (client) {
            const listener = FetchService.getFetchListener(eventName);
            if (listener) {
                const response = listener.callback(data);
                InterfaceService.callInterfaceEvent('interface:fetchResponse', hash, JSON.stringify(response));
            } else {
                mp.gui.chat.push(`No fetch listener registered for event: ${eventName}`);
            }
        } else {
            const response = await FetchService.fetchData(eventName, data);
            InterfaceService.callInterfaceEvent('interface:fetchResponse', hash, JSON.stringify(response));
        }
    }

    private static receiveFetchData(hash: string, dataAsJson: string) {
        const resolver = this.pendingFetches[hash];
        
        if (resolver) {
            delete this.pendingFetches[hash];
            resolver.resolve(JSON.parse(dataAsJson));
        }
    }

    public static async initDebug() {
        FetchService.registerFetchListener('getClientInfo', ({ infoType }: { infoType: string }) => {
            if (infoType === 'version') {
                return '1.0.0-debug';
            }

            return 'unknown';
        });
    }
}