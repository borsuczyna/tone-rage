import UserService from '@/Services/Core/UserService';
import VehicleService from '@/Services/Core/VehicleService';
import Logger from '@shared/Logger';

export default class ShutdownService {
	private static logger = Logger.getLogger(ShutdownService, true);

	public static async shutdown() {
		await VehicleService.saveVehicles();
		await UserService.savePlayers();
	}

	public static async onShutdownDetected() {
		this.logger.info('Server shutdown initiated. Saving data...');
		await this.shutdown();
	}

	public static async init() {
		mp.events.add('serverShutdown', async () => {
			mp.events.delayShutdown = true;
			await this.onShutdownDetected();
			mp.events.delayShutdown = false;
		});
	}
}
