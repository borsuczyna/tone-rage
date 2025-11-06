import { ShareMode } from '@shared/Models/ElementDataModels';
import EventService from './EventService';

/**
 * Client-side ElementDataService - Manages element data on the client
 * Communicates with server for data synchronization
 */
export default class ElementDataService {
	/** Storage for element data: elementId -> key -> value */
	private static elementData: Map<number, Map<string, any>> = new Map();

	/**
	 * Initialize the service and register event handlers
	 */
	public static init() {
		// Handle element data sync from server
		EventService.registerEventHandler('elementData:sync', this.onElementDataSync.bind(this));
	}

	/**
	 * Set element data on the client
	 * @param elementId The element ID
	 * @param key The data key
	 * @param value The data value
	 * @param shareMode How the data should be shared
	 */
	public static setElementData(elementId: number, elementType: string, key: string, value: any, shareMode: ShareMode = ShareMode.Local) {
		// Store locally
		if (!this.elementData.has(elementId)) {
			this.elementData.set(elementId, new Map());
		}

		const dataMap = this.elementData.get(elementId)!;
		dataMap.set(key, value);

		// Sync based on share mode
		switch (shareMode) {
			case ShareMode.Local:
			case ShareMode.SpecificClient:
				// No sync - stays local
				break;

			case ShareMode.Server:
				// Send to server only
				EventService.triggerServerEvent('elementData:set', elementId, elementType, ShareMode.Server, key, value);
				break;

			case ShareMode.Everywhere:
				// Send to server to broadcast to all clients
				EventService.triggerServerEvent('elementData:set', elementId, elementType, ShareMode.Everywhere, key, value);
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
	public static getElementData(elementId: number, key: string): any {
		const dataMap = this.elementData.get(elementId);
		if (!dataMap) return undefined;

		return dataMap.get(key);
	}

	/**
	 * Handle element data sync from server
	 */
	private static onElementDataSync(elementId: number, _elementType: string, key: string, value: any) {
		// Store locally
		if (!this.elementData.has(elementId)) {
			this.elementData.set(elementId, new Map());
		}

		const dataMap = this.elementData.get(elementId)!;
		dataMap.set(key, value);
	}

	/**
	 * Get all element data for an element
	 */
	public static getAllElementData(elementId: number): Map<string, any> {
		return this.elementData.get(elementId) || new Map();
	}
}
