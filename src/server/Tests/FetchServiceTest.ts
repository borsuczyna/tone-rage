import FetchService from '../Services/FetchService';

export default class FetchServiceTest {
	public static init() {
		FetchService.registerFetchListener('getClientInfo', (client, { infoType }: { infoType: string }) => {
			if (infoType === 'version') {
				return client.name + ' - 1.0.0-debug';
			}

			return 'unknown';
		});
	}
}
