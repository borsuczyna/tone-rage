import LoginPanel from './Core/LoginPanel';
import DiscordRPCService from './Services/DiscordRPCService';
import EventService from './Services/EventService';
import ElementDataService from './Services/ElementDataService';
import FetchService from './Services/FetchService';
import InterfaceService from './Services/InterfaceService';
import NotificationService from './Services/NotificationService';
import PlayerDataDisplayService from './Services/PlayerDataDisplayService';
import CredentialsStorageService from './Services/CredentialsStorageService';
import Hud from './Core/Hud';
import Scoreboard from './Core/Scoreboard';
import KeyboardService from './Services/KeyboardService';
import PlayerBlipsService from './Services/PlayerBlipsService';
import HandlingEditorService from './Services/HandlingEditorService';
import AtmInterfaceTest from './Tests/ATMInterfaceTest';
// import EventServiceTest from './Tests/EventServiceTest';
// import ElementDataServiceTest from './Tests/ElementDataServiceTest';
// import InterfaceServiceTest from './Tests/InterfaceServiceTest';
// import FetchServiceTest from './Tests/FetchServiceTest';
// import NotificationServiceTest from './Tests/NotificationServiceTest';
// import PlayerDataDisplayServiceTest from './Tests/PlayerDataDisplayServiceTest';

(async () => {
	await DiscordRPCService.init();
	await EventService.init();
	await ElementDataService.init();
	await PlayerDataDisplayService.init();
	await CredentialsStorageService.init();
    await KeyboardService.init();
	await InterfaceService.init();
    await PlayerBlipsService.init();
	await FetchService.init();
	await NotificationService.init();
	await HandlingEditorService.init();
	await LoginPanel.init();
    await Hud.init();
    await Scoreboard.init();

	// Debug
    await AtmInterfaceTest.init();
	// EventServiceTest.init();
	// ElementDataServiceTest.init();
	// InterfaceServiceTest.init();
	// FetchServiceTest.init();
	// NotificationServiceTest.init();
	// PlayerDataDisplayServiceTest.init();
})();
