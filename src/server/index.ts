import Database from './Database/Database';
import AnticheatService from './Services/Security/AnticheatService';
import AuthService from './Services/Core/AuthService';
import EventService from './Services/Infrastructure/EventService';
import ElementDataService from './Services/Infrastructure/ElementDataService';
import FetchService from './Services/Infrastructure/FetchService';
import ShutdownService from './Services/Infrastructure/ShutdownService';
import VehicleService from './Services/Core/VehicleService';
import Tests from './Tests/Tests';
import SpawnService from './Services/Core/SpawnService';
import UserService from './Services/Core/UserService';
import MoneyServiceTest from './Tests/MoneyServiceTest';
import AtmFeature from './Features/Atm/AtmFeature';
import MarkerTest from './Tests/MarkerTest';
import MarkerService from '@shared-rage/Services/MarkerService';
import VehicleInteractionFeature from './Features/Interaction/VehicleInteractionFeature';
import MarkerServerService from './Services/Infrastructure/MarkerServerService';
import Chat from './Features/Chat/Chat';
import CommandService from './Services/Infrastructure/CommandService';
import RealTime from './Features/Core/RealTime';
import InitMessage from './InitMessage';

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
	await MarkerServerService.init();
	await Chat.init();
	await CommandService.init();
	await RealTime.init();

	// Features
	await AtmFeature.init();
	await VehicleInteractionFeature.init();

	// Debug
	Tests.getPositionCommandTest();
	Tests.createVehicleCommandTest();
	Tests.createTimeCommandTest();
	MoneyServiceTest.init();
	MarkerTest.init();

    InitMessage.print();
})();
