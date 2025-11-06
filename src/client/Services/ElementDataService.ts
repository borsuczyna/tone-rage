import { BulkSyncData, ShareMode } from '@shared/Models/ElementDataModels';
import EventService from './EventService';

/**
 * Client-side ElementDataService - Manages element data on the client
 * Communicates with server for data synchronization
 */
export default class ElementDataService {
	/** Storage for element data: elementId -> key -> value */
	private static elementData: Map<string, Map<string, any>> = new Map();

	/**
	 * Initialize the service and register event handlers
	 */
	public static init() {
		// Handle element data sync from server
		EventService.registerEventHandler('elementData:sync', this.onElementDataSync.bind(this));

		// Handle bulk sync
		EventService.registerEventHandler('elementData:bulkSync', this.onBulkElementDataSync.bind(this));
	}

	/**
	 * Set element data on the client
	 * @param elementId The element ID
	 * @param key The data key
	 * @param value The data value
	 * @param shareMode How the data should be shared
	 */
	public static set(element: PlayerMp | VehicleMp, key: string, value: any, shareMode: ShareMode = ShareMode.Local) {
		// Store locally
		// let { elementId, elementType } = this.getElementInfo(element);
		// if (!this.elementData.has(elementId)) {
		// 	this.elementData.set(elementId, new Map());
		// }
		const elementId = this.getElementInfo(element);

		let dataMap = this.elementData.get(elementId);
		if (!dataMap) {
			dataMap = new Map<string, any>();
			this.elementData.set(elementId, dataMap);
		}

		dataMap.set(key, value);

		// Sync based on share mode
		switch (shareMode) {
			case ShareMode.Local:
			case ShareMode.SpecificClient:
				// No sync - stays local
				break;

			case ShareMode.Server:
				// Send to server only
				EventService.triggerServerEvent('elementData:set', elementId, ShareMode.Server, key, value);
				break;

			case ShareMode.Everywhere:
				// Send to server to broadcast to all clients
				EventService.triggerServerEvent('elementData:set', elementId, ShareMode.Everywhere, key, value);
				break;

			default:
				break;
		}
	}

	/**
	 * Get element data from local storage
	 * @param elementId The element ID
	 * @param key The data key
	 * @returns The data value or undefined if not found
	 */
	public static get(element: PlayerMp | VehicleMp, key: string): any {
		const elementId = this.getElementInfo(element);
		const dataMap = this.elementData.get(elementId);
		if (!dataMap) return undefined;

		return dataMap.get(key);
	}

	/**
	 * Handle element data sync from server
	 */
	private static onElementDataSync(elementId: string, key: string, value: any) {
		// Store locally
		mp.gui.chat.push(`ElementDataService: Syncing data for ${elementId} - ${key} = ${value} from server`);
		if (!this.elementData.has(elementId)) {
			this.elementData.set(elementId, new Map());
		}

		const dataMap = this.elementData.get(elementId)!;
		dataMap.set(key, value);
	}

	/**
	 * Handle bulk element data sync from server
	 */
	private static onBulkElementDataSync(data: BulkSyncData) {
		data.forEach(({ elementId, key, value }) => {
			// Store locally
			if (!this.elementData.has(elementId)) {
				this.elementData.set(elementId, new Map());
			}

			const dataMap = this.elementData.get(elementId)!;
			dataMap.set(key, value);
		});
	}

	/**
	 * Get all element data for an element
	 */
	public static getAll(element: PlayerMp | VehicleMp): Map<string, any> {
		const elementId = this.getElementInfo(element);
		return this.elementData.get(elementId) || new Map();
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
