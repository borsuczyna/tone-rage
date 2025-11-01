import { ShareMode, ClientWritePermission, ElementDataEntry, ClientWriteConfig } from '@shared/Models/ElementDataModels';
import EventService from './EventService';

/**
 * ElementDataService - Manages element data with flexible sharing modes
 * Supports data synchronization between server and clients
 */
export default class ElementDataService {
	/** Storage for element data: elementId -> key -> ElementDataEntry */
	private static elementData: Map<number, Map<string, ElementDataEntry>> = new Map();

	/** Configuration for which keys clients can write to */
	private static clientWritePermissions: ClientWriteConfig = {};

	/**
	 * Initialize the service and register event handlers
	 */
	public static init() {
		// Handle client requests to set element data
		EventService.registerEventHandler('elementData:set', this.onClientSetElementData.bind(this));

		// Handle client requests to get element data
		EventService.registerEventHandler('elementData:get', this.onClientGetElementData.bind(this));

		// Handle player join - sync all relevant element data
		mp.events.add('playerJoin', this.onPlayerJoin.bind(this));

		// Handle player quit - cleanup
		mp.events.add('playerQuit', this.onPlayerQuit.bind(this));
	}

	/**
	 * Set element data with specified share mode
	 * @param element The element (player or vehicle)
	 * @param key The data key
	 * @param value The data value
	 * @param shareMode How the data should be shared
	 */
	public static setElementData(element: PlayerMp | VehicleMp, key: string, value: any, shareMode: ShareMode = ShareMode.ServerOnly) {
		const elementId = element.id;

		// Get or create element data map
		if (!this.elementData.has(elementId)) {
			this.elementData.set(elementId, new Map());
		}

		const dataMap = this.elementData.get(elementId)!;
		const entry: ElementDataEntry = { key, value, shareMode };
		dataMap.set(key, entry);

		// Sync based on share mode
		this.syncElementData(element, entry);
	}

	/**
	 * Get element data
	 * @param element The element (player or vehicle)
	 * @param key The data key
	 * @returns The data value or undefined if not found
	 */
	public static getElementData(element: PlayerMp | VehicleMp, key: string): any {
		const elementId = element.id;
		const dataMap = this.elementData.get(elementId);
		if (!dataMap) return undefined;

		const entry = dataMap.get(key);
		return entry ? entry.value : undefined;
	}

	/**
	 * Get all element data for an element
	 * @param element The element (player or vehicle)
	 * @returns Map of all element data entries
	 */
	public static getAllElementData(element: PlayerMp | VehicleMp): Map<string, ElementDataEntry> {
		const elementId = element.id;
		return this.elementData.get(elementId) || new Map();
	}

	/**
	 * Configure which element data keys clients can write to and how
	 * @param key The data key
	 * @param permission The write permission level
	 */
	public static setClientWritePermission(key: string, permission: ClientWritePermission) {
		this.clientWritePermissions[key] = permission;
	}

	/**
	 * Sync element data based on share mode
	 */
	private static syncElementData(element: PlayerMp | VehicleMp, entry: ElementDataEntry) {
		const elementId = element.id;
		const elementType = this.getElementType(element);

		switch (entry.shareMode) {
			case ShareMode.ServerOnly:
				// No sync needed - data stays on server
				break;

			case ShareMode.Everywhere:
				// Sync to all clients
				mp.players.forEach((player) => {
					EventService.triggerClientEvent(player, 'elementData:sync', elementId, elementType, entry.key, entry.value);
				});
				break;

			case ShareMode.SpecificClient:
				// Sync to specific client (only if element is a player)
				if (element.type === 'player') {
					EventService.triggerClientEvent(element as PlayerMp, 'elementData:sync', elementId, elementType, entry.key, entry.value);
				}
				break;

			default:
				break;
		}
	}

	/**
	 * Handle client request to set element data
	 * Note: The server determines the final ShareMode based on configured permissions,
	 * not based on what the client requests. This is a security feature to prevent
	 * clients from bypassing permission restrictions.
	 */
	private static onClientSetElementData(client: PlayerMp, elementId: number, elementType: string, key: string, value: any) {
		// Check if client has permission to write this key
		const permission = this.clientWritePermissions[key];
		if (!permission || permission === ClientWritePermission.None) {
			console.warn(`Client ${client.name} attempted to set element data key '${key}' without permission`);
			return;
		}

		// Get the element
		const element = this.getElementByIdAndType(elementId, elementType);
		if (!element) {
			console.warn(`Client ${client.name} attempted to set element data for non-existent element ${elementId}`);
			return;
		}

		// Determine share mode based on permission (server controls the final ShareMode for security)
		const shareMode = permission === ClientWritePermission.AllClients ? ShareMode.Everywhere : ShareMode.ServerOnly;

		// Set the data
		this.setElementData(element, key, value, shareMode);
	}

	/**
	 * Handle client request to get element data
	 */
	private static onClientGetElementData(client: PlayerMp, elementId: number, elementType: string, key: string) {
		const element = this.getElementByIdAndType(elementId, elementType);
		if (!element) {
			EventService.triggerClientEvent(client, 'elementData:response', elementId, key, undefined);
			return;
		}

		const value = this.getElementData(element, key);
		EventService.triggerClientEvent(client, 'elementData:response', elementId, key, value);
	}

	/**
	 * When a player joins, sync all relevant element data to them
	 */
	private static onPlayerJoin(player: PlayerMp) {
		// Sync all element data that should be visible to this player
		this.elementData.forEach((dataMap, elementId) => {
			dataMap.forEach((entry) => {
				// Only sync data that should be shared with clients
				if (entry.shareMode === ShareMode.Everywhere) {
					const element = this.getElementById(elementId);
					if (element) {
						const elementType = this.getElementType(element);
						EventService.triggerClientEvent(player, 'elementData:sync', elementId, elementType, entry.key, entry.value);
					}
				} else if (entry.shareMode === ShareMode.SpecificClient) {
					// Only sync SpecificClient data if this player is the element itself
					if (elementId === player.id) {
						const element = this.getElementById(elementId);
						if (element) {
							const elementType = this.getElementType(element);
							EventService.triggerClientEvent(player, 'elementData:sync', elementId, elementType, entry.key, entry.value);
						}
					}
				}
			});
		});
	}

	/**
	 * Clean up element data when player quits
	 */
	private static onPlayerQuit(player: PlayerMp) {
		this.elementData.delete(player.id);
	}

	/**
	 * Get element by ID (searches both players and vehicles)
	 */
	private static getElementById(elementId: number): PlayerMp | VehicleMp | undefined {
		// Try to find player
		const player = mp.players.at(elementId);
		if (player) return player;

		// Try to find vehicle
		const vehicle = mp.vehicles.at(elementId);
		if (vehicle) return vehicle;

		return undefined;
	}

	/**
	 * Get element by ID and type
	 */
	private static getElementByIdAndType(elementId: number, elementType: string): PlayerMp | VehicleMp | undefined {
		if (elementType === 'player') {
			return mp.players.at(elementId);
		} else if (elementType === 'vehicle') {
			return mp.vehicles.at(elementId);
		}
		return undefined;
	}

	/**
	 * Get element type as string
	 */
	private static getElementType(element: PlayerMp | VehicleMp): string {
		return element.type === 'player' ? 'player' : 'vehicle';
	}
}
