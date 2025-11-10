import LoginPanel from './Core/LoginPanel';
import DiscordRPCService from './Services/DiscordRPCService';
import EventService from './Services/EventService';
import ElementDataService from './Services/ElementDataService';
import FetchService from './Services/FetchService';
import InterfaceService from './Services/InterfaceService';
import NotificationService from './Services/NotificationService';
import PlayerDataDisplayService from './Services/PlayerDataDisplayService';
import CredentialsStorageService from './Services/CredentialsStorageService';
// import EventServiceTest from './Tests/EventServiceTest';
// import ElementDataServiceTest from './Tests/ElementDataServiceTest';
// import InterfaceServiceTest from './Tests/InterfaceServiceTest';
// import FetchServiceTest from './Tests/FetchServiceTest';
// import NotificationServiceTest from './Tests/NotificationServiceTest';
// import PlayerDataDisplayServiceTest from './Tests/PlayerDataDisplayServiceTest';

(async () => {
	await DiscordRPCService.init();
	EventService.init();
	ElementDataService.init();
	PlayerDataDisplayService.init();
	CredentialsStorageService.init();

	await InterfaceService.init();
	await FetchService.init();
	await NotificationService.init();
	await LoginPanel.init();

	// Debug
	// EventServiceTest.init();
	// ElementDataServiceTest.init();
	// InterfaceServiceTest.init();
	// FetchServiceTest.init();
	// NotificationServiceTest.init();
	// PlayerDataDisplayServiceTest.init();
})();
