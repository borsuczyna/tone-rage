import Database from './Database/Database';
import AnticheatService from './Services/AnticheatService';
import AuthService from './Services/AuthService';
import EventService from './Services/EventService';
import FetchService from './Services/FetchService';
import ShutdownService from './Services/ShutdownService';
import VehicleService from './Services/VehicleService';
import Tests from './Tests/Tests';
import EventServiceTest from './Tests/EventServiceTest';

(async () => {
	await Database.init();
	await EventService.init();
	await AnticheatService.init();
	await VehicleService.init();
	await ShutdownService.init();
	await FetchService.init();
	await AuthService.init();

	// Debug
	Tests.getPositionCommandTest();
	EventServiceTest.init();
	await FetchService.initDebug();
})();
