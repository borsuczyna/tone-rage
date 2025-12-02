import Database from './Database/Database';
import AnticheatService from './Features/Anticheat/AnticheatService';
import AuthService from './Features/Auth/AuthService';
import EventService from './Services/EventService';
import ElementDataService from './Services/ElementDataService';
import FetchService from './Services/FetchService';
import ShutdownService from './Services/ShutdownService';
import VehicleService from './Features/Vehicle/VehicleService';
import Tests from './Tests/Tests';
import SpawnService from './Features/Spawn/SpawnService';
import UserService from './Features/User/UserService';
import MoneyServiceTest from './Tests/MoneyServiceTest';
import AtmFeature from './Features/Atm/AtmFeature';
import MarkerTest from './Tests/MarkerTest';
import MarkerService from '@shared-rage/Services/MarkerService';
import VehicleInteractionWheel from './Features/InteractionWheel/VehicleInteractionWheel';
// import EventServiceTest from './Tests/EventServiceTest';
// import ElementDataServiceTest from './Tests/ElementDataServiceTest';
// import FetchServiceTest from './Tests/FetchServiceTest';

(async () => {
	await Database.init();
	await EventService.init();
	await ElementDataService.init();
	await AnticheatService.init();
	await VehicleService.init();
	await ShutdownService.init();
	await FetchService.init();
	await AuthService.init();
    await SpawnService.init();
    await UserService.init();
    await MarkerService.init();
	
	// Features
	await AtmFeature.init();
    await VehicleInteractionWheel.init();

	// Debug
	Tests.getPositionCommandTest();
    Tests.createVehicleCommandTest();
    Tests.createTimeCommandTest();
    MoneyServiceTest.init();
    MarkerTest.init();
	// EventServiceTest.init();
	// ElementDataServiceTest.init();
	// FetchServiceTest.init();
})();
