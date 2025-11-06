import { ShareMode, ElementDataEntry, BulkSyncData } from '@shared/Models/ElementDataModels';
import EventService from './EventService';
import { canSyncElementDataKey } from '@/Utils/ElementDataKeys';
import Logger from '@shared/Logger';

/**
 * ElementDataService - Manages element data with flexible sharing modes
 * Supports data synchronization between server and clients
 */
export default class ElementDataService {
	/** Storage for element data: elementId -> key -> ElementDataEntry */
	private static elementData: Map<string, Map<string, ElementDataEntry>> = new Map();
	private static logger = Logger.getLogger(ElementDataService);

	/**
	 * Initialize the service and register event handlers
	 */
	public static init() {
		// Handle client requests to set element data
		EventService.registerEventHandler('elementData:set', this.onClientSetElementData.bind(this));

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
	public static set(
		element: PlayerMp | VehicleMp,
		key: string,
		value: any,
		shareMode: ShareMode = ShareMode.Local,
		ignoreClient: PlayerMp | null = null
	) {
		const elementId = this.getElementInfo(element);

		// Get or create element data map
		if (!this.elementData.has(elementId)) {
			this.elementData.set(elementId, new Map());
		}

		let dataMap = this.elementData.get(elementId);
		if (!dataMap) {
			dataMap = new Map<string, ElementDataEntry>();
			this.elementData.set(elementId, dataMap);
		}

		const entry: ElementDataEntry = { key, value, shareMode };
		dataMap.set(key, entry);

		this.syncElementData(ignoreClient, element, entry);
	}

	/**
	 * Get element data
	 * @param element The element (player or vehicle)
	 * @param key The data key
	 * @returns The data value or undefined if not found
	 */
	public static get(element: PlayerMp | VehicleMp, key: string): any {
		const elementId = this.getElementInfo(element);
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
	public static getAll(element: PlayerMp | VehicleMp): Map<string, ElementDataEntry> {
		const elementId = this.getElementInfo(element);
		return this.elementData.get(elementId) || new Map();
	}

	/**
	 * Sync element data based on share mode
	 */
	private static syncElementData(ignoreClient: PlayerMp | null, element: PlayerMp | VehicleMp, entry: ElementDataEntry) {
		const elementId = element.id;

		switch (entry.shareMode) {
			case ShareMode.Server:
			case ShareMode.Local:
				// No sync needed - data stays on server
				break;

			case ShareMode.Everywhere:
				// Sync to all clients
				mp.players.forEach((player) => {
					if (ignoreClient !== null && player.id === ignoreClient.id) {
						return;
					}
					
					EventService.triggerClientEvent(player, 'elementData:sync', elementId, entry.key, entry.value);
				});
				break;

			case ShareMode.SpecificClient:
				// Sync to specific client (only if element is a player)
				if (element.type === 'player') {
					if (ignoreClient !== null && (element as PlayerMp).id === ignoreClient.id) {
						return;
					}

					EventService.triggerClientEvent(element as PlayerMp, 'elementData:sync', elementId, entry.key, entry.value);
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
	private static onClientSetElementData(client: PlayerMp, elementId: string, shareMode: ShareMode, key: string, value: any) {
		// Check if client has permission to write this key
		if (!canSyncElementDataKey(key, shareMode)) {
			this.logger.warn(`Client ${client.name} attempted to set element data key '${key}' with invalid share mode`);
			return;
		}

		// Get the element
		const element = this.getElementByIdAndType(elementId);
		if (!element) {
			this.logger.warn(`Client ${client.name} attempted to set element data for non-existent element ${elementId}`);
			return;
		}

		// Set the data
		this.set(element, key, value, shareMode, client);
	}

	/**
	 * When a player joins, sync all relevant element data to them
	 */
	private static onPlayerJoin(player: PlayerMp) {
		// Sync all element data that should be visible to this player in one go
		const syncData: BulkSyncData = [];
		this.elementData.forEach((dataMap, elementId) => {
			dataMap.forEach((entry) => {
				// Only sync data that should be shared with clients
				if (entry.shareMode !== ShareMode.Everywhere) {
					return;
				}

				syncData.push({ elementId, key: entry.key, value: entry.value });
			});
		});

		if (syncData.length > 0) {
			EventService.triggerClientEvent(player, 'elementData:bulkSync', syncData);
		}
	}

	/**
	 * Clean up element data when player quits
	 */
	private static onPlayerQuit(player: PlayerMp) {
		const elementId = this.getElementInfo(player);
		this.elementData.delete(elementId);
	}

	/**
	 * Get element by ID and type
	 */
	private static getElementByIdAndType(elementId: string): PlayerMp | VehicleMp | undefined {
		// split elementId to get id and type
		const [idStr, elementType] = elementId.split(':');
		const elementIdNum = parseInt(idStr, 10);

		if (elementType === 'player') {
			return mp.players.at(elementIdNum);
		} else if (elementType === 'vehicle') {
			return mp.vehicles.at(elementIdNum);
		}
		return undefined;
	}

	/**
	 * Get element type and ID from an element
	 */
	private static getElementInfo(element: PlayerMp | VehicleMp): string {
		const elementId = element.id;
		const elementType = element.type === 'player' ? 'player' : 'vehicle';
		return `${elementId}:${elementType}`;
	}
}