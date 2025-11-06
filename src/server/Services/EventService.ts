import { decodeData, encodeData } from '@shared/DataEncoder';
import { chunkData, ChunkAssembler, DataChunk } from '@shared/ChunkingUtils';
import AnticheatService from './AnticheatService';

interface EventListener {
	eventName: string;
	callback: (client: PlayerMp, ...args: any[]) => void;
}

export default class EventService {
	private static listeners: EventListener[] = [];
	private static chunkAssemblers: Map<number, ChunkAssembler> = new Map();

	public static init() {
		mp.events.add('event:trigger', this.onEventTriggered.bind(this));
		mp.events.add('event:trigger:chunk', this.onChunkReceived.bind(this));
		mp.events.add('playerJoin', this.onPlayerJoin.bind(this));
		mp.events.add('playerQuit', this.onPlayerQuit.bind(this));
	}

	private static onPlayerJoin(player: PlayerMp) {
		// Generate and send salt to the player
		AnticheatService.generatePlayerSalt(player.id);
		const fullSalt = AnticheatService.getFullSalt(player.id);

		// Send the full salt to the client
		player.call('event:setSalt', [fullSalt]);
	}

	private static onPlayerQuit(player: PlayerMp) {
		// Clean up player salt and chunk assembler
		AnticheatService.removePlayerSalt(player.id);
		this.chunkAssemblers.delete(player.id);
	}

	/**
	 * Register an event handler (new API as requested)
	 */
	public static registerEventHandler(eventName: string, callback: (client: PlayerMp, ...args: any[]) => void) {
		this.listeners.push({ eventName, callback });
	}

	/**
	 * Legacy method - kept for backward compatibility
	 */
	public static registerListener(eventName: string, callback: (...args: any[]) => void) {
		this.listeners.push({ eventName, callback });
	}

	public static removeListener(eventName: string, callback: (...args: any[]) => void) {
		this.listeners = this.listeners.filter((listener) => listener.eventName !== eventName || listener.callback !== callback);
	}

	/**
	 * Trigger an event on the client with support for large data
	 */
	public static triggerClientEvent(client: PlayerMp, eventName: string, ...args: any[]) {
		const encodedData = encodeData(args);

		// Check if data needs to be chunked
		if (encodedData.length <= 32000) {
			// Send directly without chunking
			client.call('event:receive', [eventName, encodedData]);
		} else {
			// Send in chunks
			const chunks = chunkData(encodedData);
			chunks.forEach((chunk) => {
				client.call('event:receive:chunk', [eventName, chunk]);
			});
		}
	}

	private static onEventTriggered(client: PlayerMp, hash: string, eventName: string, encodedData: string) {
		const decodedData = decodeData<any[]>(encodedData);

		if (!AnticheatService.verifyHash(eventName, hash, client.id)) {
			AnticheatService.clientInvalidHash(client, eventName, hash, JSON.stringify(decodedData));
			return;
		}

		const listeners = this.listeners.filter((listener) => listener.eventName === eventName);
		listeners.forEach((listener) => listener.callback(client, ...decodedData));
	}

	private static onChunkReceived(client: PlayerMp, hash: string, eventName: string, chunkDataJson: string) {
		// Get or create chunk assembler for this client
		if (!this.chunkAssemblers.has(client.id)) {
			this.chunkAssemblers.set(client.id, new ChunkAssembler());
		}

		// Parse the JSON string back to DataChunk object
		let chunkData: DataChunk;
		try {
			chunkData = JSON.parse(chunkDataJson);
		} catch (error) {
			console.error(`Failed to parse chunk data for client ${client.id}:`, chunkDataJson);
			return;
		}

		const assembler = this.chunkAssemblers.get(client.id)!;
		const completeData = assembler.addChunk(chunkData);

		if (completeData) {
			// All chunks received, process the event
			const decodedData = decodeData<any[]>(completeData);

			if (!AnticheatService.verifyHash(eventName, hash, client.id)) {
				AnticheatService.clientInvalidHash(client, eventName, hash, JSON.stringify(decodedData));
				return;
			}

			const listeners = this.listeners.filter((listener) => listener.eventName === eventName);
			listeners.forEach((listener) => listener.callback(client, ...decodedData));
		}
	}
}
