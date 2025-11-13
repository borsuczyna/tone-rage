import Logger from '@shared/Logger';
import InterfaceService from '@/Services/InterfaceService';
import EventService from '@/Services/EventService';

interface SavedCredentials {
	username: string;
	password: string;
	rememberMe: boolean;
}

export default class CredentialsStorageService {
	private static logger: Logger = Logger.getLogger(CredentialsStorageService);
	private static readonly STORAGE_KEY = 'auth_credentials.json';
	private static credentials: SavedCredentials | null = null;

	public static init() {
		EventService.registerEventHandler('credentials:save', this.saveCredentials.bind(this));
		EventService.registerEventHandler('credentials:load', this.loadCredentials.bind(this));
		EventService.registerEventHandler('credentials:clear', this.clearCredentials.bind(this));

		// Load credentials on init
		this.loadFromFile();
	}

	private static saveCredentials(data: SavedCredentials) {
		if (!data.rememberMe) {
			this.clearCredentials();
			return;
		}

		this.credentials = {
			username: data.username,
			password: data.password,
			rememberMe: data.rememberMe
		};
		this.saveToFile();
		this.logger.info('Credentials saved');
	}

	private static loadCredentials() {
		this.loadFromFile();
		InterfaceService.callInterfaceEvent('credentials:loaded', this.credentials);
	}

	private static clearCredentials() {
		this.credentials = null;
		this.saveToFile();
		this.logger.info('Credentials cleared');
		InterfaceService.callInterfaceEvent('credentials:loaded', null);
	}

	private static saveToFile() {
		try {
			const data = this.credentials ? JSON.stringify(this.credentials) : '';
			mp.storage.data[this.STORAGE_KEY] = data;
			mp.storage.flush();
		} catch (error) {
			this.logger.error('Failed to save credentials to file:', error);
		}
	}

	private static loadFromFile() {
		try {
			const data = mp.storage.data[this.STORAGE_KEY];
			if (data && data.trim() !== '') {
				this.credentials = JSON.parse(data);
				this.logger.info('Credentials loaded from file');
			} else {
				this.credentials = null;
			}
		} catch (error) {
			this.logger.error('Failed to load credentials from file:', error);
			this.credentials = null;
		}
	}
}
