import { encodeData, decodeData } from '@shared/DataEncoder';
import { generateHash } from '@shared/Hash';
import { chunkData, ChunkAssembler, DataChunk } from '@shared/ChunkingUtils';
import Logger from '@shared/Logger';

interface EventListener {
	eventName: string;
	callback: (...args: any[]) => void;
}

export default class EventService {
	private static listeners: EventListener[] = [];
	private static chunkAssembler: ChunkAssembler = new ChunkAssembler();
	private static initialized: boolean = false;
	private static salt: string = '';
	private static logger: Logger = Logger.getLogger(EventService);

	/**
	 * Initialize the event service
	 */
	public static init() {
		if (this.initialized) return;

		mp.events.add('event:receive', this.onEventReceived.bind(this));
		mp.events.add('event:receive:chunk', this.onChunkReceived.bind(this));
		mp.events.add('event:setSalt', this.onSetSalt.bind(this));
		mp.events.add('interface:triggerEvent', this.onInterfaceEventReceived.bind(this));
		this.initialized = true;
	}

	private static onSetSalt(salt: string) {
		this.salt = salt;
	}

	/**
	 * Register an event handler (new API as requested)
	 */
	public static registerEventHandler(eventName: string, callback: (...args: any[]) => void) {
		this.listeners.push({ eventName, callback });
	}

    /**
     * Remove an event handler
     */
	public static removeEventHandler(eventName: string, callback: (...args: any[]) => void) {
		this.listeners = this.listeners.filter(
			(listener) => listener.eventName !== eventName || listener.callback !== callback
		);
	}

	/**
	 * Trigger a server event with support for large data
	 */
	public static triggerServerEvent(eventName: string, ...args: any[]) {
		if (!this.salt) {
			this.logger.error('Cannot trigger server event: waiting for salt from server. Ensure client is properly connected.');
			return;
		}

		const encodedData = encodeData(args);
		const hash = generateHash(eventName, this.salt);

		// Check if data needs to be chunked
		if (encodedData.length <= 32000) {
			// Send directly without chunking
			mp.events.callRemote('event:trigger', hash, eventName, encodedData);
		} else {
			// Send in chunks
			const chunks = chunkData(encodedData);
			chunks.forEach((chunk) => {
				mp.events.callRemote('event:trigger:chunk', hash, eventName, JSON.stringify(chunk));
			});
		}
	}

	private static onEventReceived(eventName: string, encodedData: string) {
		const decodedData = decodeData<any[]>(encodedData);

		const listeners = this.listeners.filter((listener) => listener.eventName === eventName);
		listeners.forEach((listener) => listener.callback(...decodedData));
	}

	private static onInterfaceEventReceived(eventName: string, jsonData: string) {
        const data = JSON.parse(jsonData);

		const listeners = this.listeners.filter((listener) => listener.eventName === eventName);
		listeners.forEach((listener) => listener.callback(data));
	}

	private static onChunkReceived(eventName: string, chunk: DataChunk) {
		const completeData = this.chunkAssembler.addChunk(chunk);

		if (completeData) {
			// All chunks received, process the event
			const decodedData = decodeData<any[]>(completeData);

			const listeners = this.listeners.filter((listener) => listener.eventName === eventName);
			listeners.forEach((listener) => listener.callback(...decodedData));
		}
	}
}
