import process from "process";
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
        process.on('exit', this.onShutdownDetected.bind(this));
    }
}