import EventService from '../Services/EventService';
import Logger from '@shared/Logger';

export default class EventServiceTest {
	private static logger: Logger = Logger.getLogger(EventServiceTest);

	/**
	 * Test registering event handlers and sending large data
	 */
	public static init() {
		// Register a handler for a test event
		EventService.registerEventHandler('test:largeData', (client: PlayerMp, data: any) => {
			EventServiceTest.logger.info(`Received large data from client ${client.name}:`, {
				dataSize: JSON.stringify(data).length,
				itemCount: data.items?.length || 0
			});

			// Echo back with even larger data
			const responseData = {
				status: 'success',
				receivedItems: data.items?.length || 0,
				serverData: Array.from({ length: 5000 }, (_, i) => ({
					id: i,
					name: `Server Item ${i}`,
					description: `This is a test item with index ${i}`,
					properties: {
						weight: Math.random() * 100,
						value: Math.random() * 1000,
						rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'][Math.floor(Math.random() * 5)]
					}
				}))
			};

			EventService.triggerClientEvent(client, 'test:largeDataResponse', responseData);
		});

		// Register a test command
		mp.events.addCommand('testlarge', (player: PlayerMp) => {
			const testData = {
				message: 'This is a large data transfer test',
				items: Array.from({ length: 10000 }, (_, i) => ({
					id: i,
					name: `Item ${i}`,
					description: `Description for item ${i}`,
					properties: {
						weight: Math.random() * 100,
						value: Math.random() * 1000
					}
				}))
			};

			const dataSize = JSON.stringify(testData).length;
			EventServiceTest.logger.info(`Sending large data to client ${player.name}. Size: ${dataSize} bytes`);

			EventService.triggerClientEvent(player, 'test:receiveData', testData);
		});

		EventServiceTest.logger.info('EventService test initialized. Use /testlarge command to test large data transfer.');
	}
}
