import { encodeData, decodeData } from '@shared/DataEncoder';
import { generateHash } from '@shared/Hash';
import { chunkData, ChunkAssembler, DataChunk } from '@shared/ChunkingUtils';

interface EventListener {
	eventName: string;
	callback: (...args: any[]) => void;
}

export default class EventService {
	private static listeners: EventListener[] = [];
	private static chunkAssembler: ChunkAssembler = new ChunkAssembler();
	private static initialized: boolean = false;
	private static salt: string = '';

	/**
	 * Initialize the event service
	 */
	public static init() {
		if (this.initialized) return;

		mp.events.add('event:receive', this.onEventReceived.bind(this));
		mp.events.add('event:receive:chunk', this.onChunkReceived.bind(this));
		mp.events.add('event:setSalt', this.onSetSalt.bind(this));
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
	 * Trigger a server event with support for large data
	 */
	public static triggerServerEvent(eventName: string, ...args: any[]) {
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
