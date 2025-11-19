import Logger from '@shared/Logger';
import AnticheatService from '@/Features/Anticheat/AnticheatService';
import EventService from './EventService';

interface FetchListener {
	eventName: string;
	callback: (client: PlayerMp, data: any) => void;
}

export default class FetchService {
	private static fetchListeners: FetchListener[] = [];
	public static logger: Logger = Logger.getLogger(FetchService, true);

	public static async init() {
		EventService.registerListener('fetch:getData', this.onFetchRequest.bind(this));
	}

	public static getFetchListener(eventName: string): FetchListener | undefined {
		return this.fetchListeners.find((listener) => listener.eventName === eventName);
	}

	public static registerFetchListener(eventName: string, callback: (client: PlayerMp, data: any) => void) {
		this.fetchListeners.push({ eventName, callback });
	}

	public static removeFetchListener(eventName: string, callback: (client: PlayerMp, data: any) => void) {
		this.fetchListeners = this.fetchListeners.filter((listener) => listener.eventName !== eventName || listener.callback !== callback);
	}

	private static async onFetchRequest(client: PlayerMp, eventName: string, hash: string, dataAsJson: string) {
		if (!AnticheatService.verifyHash(eventName, hash, client.id)) {
			AnticheatService.clientInvalidHash(client, eventName, hash, dataAsJson);
			return;
		}

		const listener = FetchService.getFetchListener(eventName);
		if (listener) {
			const data = JSON.parse(dataAsJson);
			const response = await listener.callback(client, data);
			EventService.triggerClientEvent(client, 'fetch:receiveData', hash, JSON.stringify(response));
		}
	}
}
