import LoginPanel from './Core/LoginPanel';
import DiscordRPCService from './Services/DiscordRPCService';
import EventService from './Services/EventService';
import FetchService from './Services/FetchService';
import InterfaceService from './Services/InterfaceService';
import NotificationService from './Services/NotificationService';
import EventServiceTest from './Tests/EventServiceTest';
import InterfaceServiceTest from './Tests/InterfaceServiceTest';
import FetchServiceTest from './Tests/FetchServiceTest';
import NotificationServiceTest from './Tests/NotificationServiceTest';

(async () => {
	await DiscordRPCService.init();
	EventService.init();

	await InterfaceService.init();
	await FetchService.init();
	await NotificationService.init();
	await LoginPanel.init();

	// Debug
	await InterfaceService.initDebug();
	await FetchService.initDebug();
	await NotificationService.initDebug();
	EventServiceTest.init();
	InterfaceServiceTest.init();
	FetchServiceTest.init();
	NotificationServiceTest.init();
})();
