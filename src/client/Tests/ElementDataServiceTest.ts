import ElementDataService from '../Services/ElementDataService';
import { ShareMode } from '@shared/Models/ElementDataModels';

export default class ElementDataServiceTest {
	/**
	 * Test element data system on client
	 */
	public static init() {
		mp.console.logInfo('ElementDataService test initialized on client');

		// Test: Set local client data
		const testLocalData = () => {
			const localPlayerId = mp.players.local.remoteId;
			// Set client-only data (doesn't sync)
			ElementDataService.set(localPlayerId, 'player', 'localSetting', 'client-value', ShareMode.Local);
			// mp.console.logInfo('Set local client data');
			mp.gui.chat.push('Set local client data');

			// Read it back
			const value = ElementDataService.get(localPlayerId, 'localSetting');
			// mp.console.logInfo(`Read local data: ${value}`);
			mp.gui.chat.push(`Read local data: ${value}`);
		};

		// Test: Set and sync to server
		const testSyncToServer = () => {
			// This should sync to server only
			ElementDataService.set(mp.players.local.remoteId, 'player', 'clientScore', 100, ShareMode.Server);
			mp.gui.chat.push('Set and synced data to server');
		};

		// Test: Set and sync to all
		const testSyncToAll = () => {
			// This should sync to all clients via server
			ElementDataService.set(mp.players.local.remoteId, 'player', 'customData', { name: 'test', value: 42 }, ShareMode.Everywhere);
			mp.gui.chat.push('Set and synced data to all clients');
		};

		// Run tests after a delay to ensure services are ready
		setTimeout(() => {
			testLocalData();
		}, 1000);

		setTimeout(() => {
			testSyncToServer();
		}, 2000);

		setTimeout(() => {
			testSyncToAll();
		}, 3000);

		mp.console.logInfo('ElementDataService tests scheduled');
	}
}
