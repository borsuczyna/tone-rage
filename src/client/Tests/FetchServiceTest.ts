import FetchService from '../Services/Infrastructure/FetchService';

export default class FetchServiceTest {
	public static init() {
		FetchService.registerFetchListener('getClientInfo', ({ infoType }: { infoType: string }) => {
			if (infoType === 'version') {
				return '1.0.0-debug';
			}

			return 'unknown';
		});
	}
}
