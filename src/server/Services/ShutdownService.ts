import VehicleService from "./VehicleService";
import Logger from "@shared/Logger";

export default class ShutdownService {
    private static logger = Logger.getLogger(ShutdownService);

    public static async shutdown() {
        await VehicleService.saveVehicles();
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