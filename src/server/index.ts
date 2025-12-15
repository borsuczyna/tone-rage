import Database from './Database/Database';
import AnticheatService from './Services/Security/AnticheatService';
import AuthService from './Services/Core/AuthService';
import EventService from './Services/Infrastructure/EventService';
import ElementDataService from './Services/Infrastructure/ElementDataService';
import FetchService from './Services/Infrastructure/FetchService';
import ShutdownService from './Services/Infrastructure/ShutdownService';
import PrivateVehicleService from './Services/Core/PrivateVehicleService';
import SpawnService from './Services/Core/SpawnService';
import UserService from './Services/Core/UserService';
import Atm from './Features/Atm/Atm';
import MarkerService from '@shared-rage/Services/MarkerService';
import MarkerServerService from './Services/Infrastructure/MarkerServerService';
import Chat from './Features/Chat/Chat';
import CommandService from './Services/Infrastructure/CommandService';
import RealTime from './Features/Core/RealTime';
import InitMessage from './InitMessage';
import ColShapeService from '@shared-rage/Services/ColShapeService';
import VehicleService from './Services/Core/VehicleService';
import WinterSeason from './Features/Core/WinterSeason';
import Tests from './Tests/Tests';

(async () => {
	await Database.init();
	await EventService.init();
	await ElementDataService.init();
	await AnticheatService.init();
	await PrivateVehicleService.init();
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
    await ColShapeService.init();
    await VehicleService.init();

	// Features
	await Atm.init();
    await WinterSeason.init();

    // Tests
    await Tests.getPositionCommandTest();
    await Tests.createVehicleCommandTest();
    await Tests.createTimeCommandTest();

    InitMessage.print();
})();
