import { ShareMode, ElementDataEntry } from '@shared/Models/ElementDataModels';
import EventService from './EventService';

/**
 * Client-side ElementDataService - Manages element data on the client
 * Communicates with server for data synchronization
 */
export default class ElementDataService {
	/** Storage for element data: elementId -> key -> value */
	private static elementData: Map<number, Map<string, any>> = new Map();

	/** Pending get requests: composite key (elementId_key) -> callbacks array */
	private static pendingRequests: Map<string, Array<(value: any) => void>> = new Map();

	/**
	 * Initialize the service and register event handlers
	 */
	public static init() {
		// Handle element data sync from server
		EventService.registerEventHandler('elementData:sync', this.onElementDataSync.bind(this));

		// Handle element data response from server
		EventService.registerEventHandler('elementData:response', this.onElementDataResponse.bind(this));
	}

	/**
	 * Set element data on the client
	 * @param elementId The element ID
	 * @param key The data key
	 * @param value The data value
	 * @param shareMode How the data should be shared
	 */
	public static setElementData(elementId: number, elementType: string, key: string, value: any, shareMode: ShareMode = ShareMode.ClientOnly) {
		// Store locally
		if (!this.elementData.has(elementId)) {
			this.elementData.set(elementId, new Map());
		}

		const dataMap = this.elementData.get(elementId)!;
		dataMap.set(key, value);

		// Sync based on share mode
		switch (shareMode) {
			case ShareMode.ClientOnly:
				// No sync - stays local
				break;

			case ShareMode.ClientToServer:
				// Send to server only
				EventService.triggerServerEvent('elementData:set', elementId, elementType, key, value);
				break;

			case ShareMode.ClientToAll:
				// Send to server to broadcast to all clients
				EventService.triggerServerEvent('elementData:set', elementId, elementType, key, value);
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
	 * Get element data from server (async via callback)
	 * @param elementId The element ID
	 * @param elementType The element type
	 * @param key The data key
	 * @param callback Callback function to receive the value
	 */
	public static getElementDataFromServer(elementId: number, elementType: string, key: string, callback: (value: any) => void) {
		const requestKey = `${elementId}_${key}`;

		// Add callback to the list for this request key
		if (!this.pendingRequests.has(requestKey)) {
			this.pendingRequests.set(requestKey, []);
		}
		this.pendingRequests.get(requestKey)!.push(callback);

		// Request from server (only send request if this is the first callback for this key)
		if (this.pendingRequests.get(requestKey)!.length === 1) {
			EventService.triggerServerEvent('elementData:get', elementId, elementType, key);
		}
	}

	/**
	 * Handle element data sync from server
	 */
	private static onElementDataSync(elementId: number, elementType: string, key: string, value: any) {
		// Store locally
		if (!this.elementData.has(elementId)) {
			this.elementData.set(elementId, new Map());
		}

		const dataMap = this.elementData.get(elementId)!;
		dataMap.set(key, value);
	}

	/**
	 * Handle element data response from server
	 */
	private static onElementDataResponse(elementId: number, key: string, value: any) {
		// Find matching pending requests using O(1) lookup
		const requestKey = `${elementId}_${key}`;
		const callbacks = this.pendingRequests.get(requestKey);

		if (callbacks) {
			// Call all pending callbacks for this request
			callbacks.forEach((callback) => callback(value));
			this.pendingRequests.delete(requestKey);
		}

		// Also store locally
		if (!this.elementData.has(elementId)) {
			this.elementData.set(elementId, new Map());
		}

		const dataMap = this.elementData.get(elementId)!;
		dataMap.set(key, value);
	}

	/**
	 * Clear element data (useful when element is destroyed)
	 */
	public static clearElementData(elementId: number) {
		this.elementData.delete(elementId);
	}

	/**
	 * Get all element data for an element
	 */
	public static getAllElementData(elementId: number): Map<string, any> {
		return this.elementData.get(elementId) || new Map();
	}
}
