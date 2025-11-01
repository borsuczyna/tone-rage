import Database from './Database/Database';
import AnticheatService from './Services/AnticheatService';
import AuthService from './Services/AuthService';
import EventService from './Services/EventService';
import ElementDataService from './Services/ElementDataService';
import FetchService from './Services/FetchService';
import ShutdownService from './Services/ShutdownService';
import VehicleService from './Services/VehicleService';
import Tests from './Tests/Tests';
import EventServiceTest from './Tests/EventServiceTest';
import ElementDataServiceTest from './Tests/ElementDataServiceTest';
import FetchServiceTest from './Tests/FetchServiceTest';

(async () => {
	await Database.init();
	await EventService.init();
	await ElementDataService.init();
	await AnticheatService.init();
	await VehicleService.init();
	await ShutdownService.init();
	await FetchService.init();
	await AuthService.init();

	// Debug
	Tests.getPositionCommandTest();
	EventServiceTest.init();
	ElementDataServiceTest.init();
	FetchServiceTest.init();
})();
