import { BulkSyncData, ShareMode } from '@shared/Models/ElementDataModels';
import { ElementDataEntity, ElementDataListenerCallback } from '@shared-rage/Models/ElementDataType';
import EventService from './EventService';

/**
 * Client-side ElementDataService - Manages element data on the client
 * Communicates with server for data synchronization
 */
export default class ElementDataService {
	/** Storage for element data: elementId -> key -> value */
	private static elementData: Map<string, Map<string, any>> = new Map();
    private static elementListeners: Map<string, ElementDataListenerCallback[]> = new Map();

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
	public static set(element: ElementDataEntity, key: string, value: any, shareMode: ShareMode = ShareMode.Local) {
		// Store locally
		// let { elementId, elementType } = this.getElementInfo(element);
		// if (!this.elementData.has(elementId)) {
		// 	this.elementData.set(elementId, new Map());
		// }
		const elementId = this.getElementInfo(element);

		let dataMap = this.elementData.get(elementId);
        let oldValue: any = null;
		if (!dataMap) {
			dataMap = new Map<string, any>();
			this.elementData.set(elementId, dataMap);
		}

        oldValue = dataMap.get(key);
		dataMap.set(key, value);
        this.triggerListeners(element, key, oldValue, value);

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
	public static get(element: ElementDataEntity, key: string): any {
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
        let oldValue: any = null;
		if (!this.elementData.has(elementId)) {
			this.elementData.set(elementId, new Map());
		}

		const dataMap = this.elementData.get(elementId)!;
        oldValue = dataMap.get(key);
		dataMap.set(key, value);

        this.triggerListeners(this.getElementByIdAndType(elementId), key, oldValue, value);
	}

	/**
	 * Handle bulk element data sync from server
	 */
	private static onBulkElementDataSync(data: BulkSyncData) {
		data.forEach(({ elementId, key, value }) => {
			// Store locally
            let oldValue: any = null;
			if (!this.elementData.has(elementId)) {
				this.elementData.set(elementId, new Map());
			}

			const dataMap = this.elementData.get(elementId)!;
            oldValue = dataMap.get(key);
			dataMap.set(key, value);

            this.triggerListeners(this.getElementByIdAndType(elementId), key, oldValue, value);
		});
	}

	/**
	 * Get all element data for an element
	 */
	public static getAll(element: ElementDataEntity): Map<string, any> {
		const elementId = this.getElementInfo(element);
		return this.elementData.get(elementId) || new Map();
	}

    /**
     * Add a listener for element data changes
     */
    public static registerListener(key: string, callback: ElementDataListenerCallback) {
        if (!this.elementListeners.has(key)) {
            this.elementListeners.set(key, []);
        }
        this.elementListeners.get(key)!.push(callback);
    }

    /**
     * Remove a listener for element data changes
     */
    public static removeListener(key: string, callback: ElementDataListenerCallback) {
        const listeners = this.elementListeners.get(key);
        if (listeners) {
            this.elementListeners.set(key, listeners.filter(cb => cb !== callback));
        }
    }

    /** * Notify listeners of a data change
     */
    private static triggerListeners(element: ElementDataEntity | undefined, key: string, oldValue: any, newValue: any) {
        if (!element) return;

        const listeners = this.elementListeners.get(key);
        if (listeners) {
            listeners.forEach(callback => {
                callback(element, key, oldValue, newValue);
            });
        }
    }

    /**
	 * Get element type and ID from an element
	 */
	private static getElementInfo(element: ElementDataEntity): string {
		const elementId = element.remoteId;
		const elementType = element.type === 'player' ? 'player' : 'vehicle';
		return `${elementId}:${elementType}`;
	}

    /**
	 * Get element by ID and type
	 */
	private static getElementByIdAndType(elementId: string): ElementDataEntity | undefined {
		// split elementId to get id and type
		const [idStr, elementType] = elementId.split(':');
		const elementIdNum = parseInt(idStr, 10);

		if (elementType === 'player') {
			return mp.players.atRemoteId(elementIdNum);
		} else if (elementType === 'vehicle') {
			return mp.vehicles.atRemoteId(elementIdNum);
		}
		return undefined;
	}
}
