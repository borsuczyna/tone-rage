import ElementDataService from '../Services/ElementDataService';
import { ShareMode, ClientWritePermission } from '@shared/Models/ElementDataModels';
import Logger from '@shared/Logger';

export default class ElementDataServiceTest {
	private static logger: Logger = Logger.getLogger(ElementDataServiceTest);

	/**
	 * Test element data system
	 */
	public static init() {
		// Configure client write permissions
		ElementDataService.setClientWritePermission('health', ClientWritePermission.ServerOnly);
		ElementDataService.setClientWritePermission('score', ClientWritePermission.AllClients);
		ElementDataService.setClientWritePermission('customData', ClientWritePermission.AllClients);

		// Test command: Set element data with different share modes
		mp.events.addCommand('testdata', (player: PlayerMp, fullText: string) => {
			// Test 1: Server-only data
			ElementDataService.setElementData(player, 'secret', 'server-secret-value', ShareMode.ServerOnly);
			ElementDataServiceTest.logger.info(`Set server-only data for player ${player.name}`);

			// Test 2: Everywhere data
			ElementDataService.setElementData(player, 'level', 42, ShareMode.Everywhere);
			ElementDataServiceTest.logger.info(`Set everywhere data for player ${player.name}`);

			// Test 3: Specific client data
			ElementDataService.setElementData(player, 'private-msg', 'This is private', ShareMode.SpecificClient);
			ElementDataServiceTest.logger.info(`Set specific client data for player ${player.name}`);

			// Test 4: Read data back
			const secret = ElementDataService.getElementData(player, 'secret');
			const level = ElementDataService.getElementData(player, 'level');
			const privateMsg = ElementDataService.getElementData(player, 'private-msg');

			player.outputChatBox(`Secret: ${secret}, Level: ${level}, Private: ${privateMsg}`);
		});

		// Test command: Test vehicle data
		mp.events.addCommand('testvehicledata', (player: PlayerMp) => {
			// Get player's vehicle
			if (!player.vehicle) {
				player.outputChatBox('You must be in a vehicle!');
				return;
			}

			const vehicle = player.vehicle;

			// Set vehicle data with different share modes
			ElementDataService.setElementData(vehicle, 'owner', player.name, ShareMode.Everywhere);
			ElementDataService.setElementData(vehicle, 'fuel', 75, ShareMode.Everywhere);
			ElementDataService.setElementData(vehicle, 'engineHealth', 1000, ShareMode.ServerOnly);

			ElementDataServiceTest.logger.info(`Set vehicle data for vehicle ${vehicle.id}`);
			player.outputChatBox('Vehicle data set successfully!');

			// Read back
			const owner = ElementDataService.getElementData(vehicle, 'owner');
			const fuel = ElementDataService.getElementData(vehicle, 'fuel');
			const engineHealth = ElementDataService.getElementData(vehicle, 'engineHealth');

			player.outputChatBox(`Owner: ${owner}, Fuel: ${fuel}, Engine: ${engineHealth}`);
		});

		// Test command: Get all element data
		mp.events.addCommand('getalldata', (player: PlayerMp) => {
			const allData = ElementDataService.getAllElementData(player);
			ElementDataServiceTest.logger.info(`Player ${player.name} has ${allData.size} data entries`);

			let output = 'Your element data: ';
			allData.forEach((entry, key) => {
				output += `\n${key}: ${entry.value} (${entry.shareMode})`;
			});

			player.outputChatBox(output);
		});

		ElementDataServiceTest.logger.info('ElementDataService test initialized. Commands: /testdata, /testvehicledata, /getalldata');
	}
}
