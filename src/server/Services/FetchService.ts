import Logger from '@shared/Logger';
import AnticheatService from './AnticheatService';
import EventService from './EventService';
import crypto from 'crypto';

interface FetchListener {
	eventName: string;
	callback: (client: PlayerMp, data: any) => void;
}

interface ResponseEnvelope {
	payload: any;
	signature: string;
}

export default class FetchService {
	private static fetchListeners: FetchListener[] = [];
	public static logger: Logger = Logger.getLogger(FetchService, true);
	private static readonly SECRET_KEY = process.env.SESSION_SECRET || 'dev_secret';

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

	/**
	 * Generate HMAC-SHA256 signature for the response
	 * @param hash - The request hash
	 * @param payload - The response payload as JSON string
	 * @returns HMAC signature as hex string
	 */
	private static generateSignature(hash: string, payload: string): string {
		const message = hash + ':' + payload;
		const hmac = crypto.createHmac('sha256', this.SECRET_KEY);
		hmac.update(message);
		return hmac.digest('hex');
	}

	private static async onFetchRequest(client: PlayerMp, eventName: string, hash: string, dataAsJson: string) {
		if (!AnticheatService.verifyHash(eventName, hash)) {
			AnticheatService.clientInvalidHash(client, eventName, hash, dataAsJson);
			return;
		}

		const listener = FetchService.getFetchListener(eventName);
		if (listener) {
			const data = JSON.parse(dataAsJson);
			const response = await listener.callback(client, data);
			const payloadStr = JSON.stringify(response);
			const signature = this.generateSignature(hash, payloadStr);

			// Create envelope with payload and signature
			const envelope: ResponseEnvelope = {
				payload: response,
				signature: signature
			};

			client.call('fetch:receiveData', [hash, JSON.stringify(envelope)]);
		}
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
