/**
 * Defines where element data should be shared
 */
export enum ShareMode {
	/** Server only - data stays on server (not synced to clients) */
	ServerOnly = 'server_only',
	/** Synced to all clients and server */
	Everywhere = 'everywhere',
	/** Synced to specific client only (only valid when element is PlayerMp) */
	SpecificClient = 'specific_client',
	/** Client only - data stays on client (not synced to server) */
	ClientOnly = 'client_only',
	/** Client to server - data synced from client to server */
	ClientToServer = 'client_to_server',
	/** Client to all - data synced from client to all clients via server */
	ClientToAll = 'client_to_all'
}

/**
 * Defines which element data keys clients can write to
 */
export enum ClientWritePermission {
	/** Clients can write to server only */
	ServerOnly = 'server_only',
	/** Clients can write and sync to all clients */
	AllClients = 'all_clients',
	/** No permission - clients cannot write this key */
	None = 'none'
}

/**
 * Element data entry structure
 */
export interface ElementDataEntry {
	key: string;
	value: any;
	shareMode: ShareMode;
}

/**
 * Configuration for client write permissions
 */
export interface ClientWriteConfig {
	[key: string]: ClientWritePermission;
}
