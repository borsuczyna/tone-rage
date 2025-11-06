/**
 * Defines where element data should be shared
 */
export enum ShareMode {
	/** Server only - data stays on server (not synced to clients) */
	Local = 'local',
	/** Synced to all clients and server */
	Everywhere = 'everywhere',
	/** Synced to specific client only (only valid when element is PlayerMp) */
	SpecificClient = 'specific_client',
	/** Client only - data stays on client (not synced to server) */
	Server = 'server'
}

/**
 * Element data entry structure
 */
export interface ElementDataEntry {
	key: string;
	value: any;
	shareMode: ShareMode;
}
