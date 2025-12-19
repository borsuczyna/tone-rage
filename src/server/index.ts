import 'reflect-metadata';
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
import Logger from '@shared/Logger';
import { MoneyLogEntity } from './Database/Entities/MoneyLogEntity';
import { UserEntity } from './Database/Entities/UserEntity';

const logger = Logger.getLogger('ServerInit');

(async () => {
	await Database.init();

	// Test Sequelize entity creation to verify it works
	try {
		logger.info('Testing Sequelize entity creation...');
		
		// Test creating a MoneyLogEntity instance
		const testLog = new MoneyLogEntity();
		testLog.userId = 1;
		testLog.amount = 100;
		testLog.amountBefore = 0;
		testLog.type = 0;
		testLog.description = 'Test log';
		testLog.createdAt = new Date();
		logger.info('MoneyLogEntity instance created successfully');
		
		// Test creating a UserEntity instance
		const testUser = new UserEntity();
		testUser.username = 'test';
		testUser.email = 'test@test.com';
		logger.info('UserEntity instance created successfully');
		
		logger.info('Sequelize entity tests passed!');
	} catch (error) {
		logger.error(`Sequelize entity test failed: ${error}`);
	}
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
    // await WinterSeason.init();

    // Tests
    await Tests.getPositionCommandTest();
    await Tests.createVehicleCommandTest();
    await Tests.createTimeCommandTest();

    InitMessage.print();
})();
