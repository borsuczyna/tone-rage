import EventService from '../Services/Infrastructure/EventService';

export default class EventServiceTest {
	public static init() {
		// Register handler for receiving large data from server
		EventService.registerEventHandler('test:receiveData', (data: any) => {
			const dataSize = JSON.stringify(data).length;
			mp.gui.chat.push(`Received large data from server. Size: ${dataSize} bytes, Items: ${data.items?.length || 0}`);

			// Send a response back with large data
			const responseData = {
				status: 'received',
				originalItemCount: data.items?.length || 0,
				clientData: Array.from({ length: 3000 }, (_, i) => ({
					id: i,
					type: 'client-item',
					data: `Client data ${i} with some additional information to increase payload size`
				}))
			};

			EventService.triggerServerEvent('test:largeData', responseData);
		});

		// Register handler for server response
		EventService.registerEventHandler('test:largeDataResponse', (data: any) => {
			const dataSize = JSON.stringify(data).length;
			mp.gui.chat.push(`Received server response. Size: ${dataSize} bytes, Server items: ${data.serverData?.length || 0}`);
		});

		mp.gui.chat.push('EventService test initialized on client. Use /testlarge command to test.');
	}
}
