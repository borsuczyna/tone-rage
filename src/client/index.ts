import FetchService from './Services/FetchService';
import InterfaceService from './Services/InterfaceService';

(async () => {
	await InterfaceService.init();
	await FetchService.init();

	// Debug
	await InterfaceService.initDebug();
	await FetchService.initDebug();
})();
