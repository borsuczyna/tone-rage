import Database from "@/Database/Database";
import { VehicleEntity } from "@/Database/Entities/VehicleEntity";
import Logger from "@shared/Logger";

export default class VehicleService {
    private static vehicles: VehicleMp[] = [];
    private static logger: Logger = Logger.getLogger(VehicleService);

    private static destroyAllVehicles() {
        for (let vehicle of this.vehicles) {
            vehicle.destroy();
        }
    }

    private static loadVehicle(data: VehicleEntity) {
        try {
            let model = mp.joaat(data.model);
            let position = data.positionVector;
            let vehicle = mp.vehicles.new(model, position, {
                color: data.colorArray
            });

            vehicle.rotation = data.rotationVector;
            
            this.vehicles.push(vehicle);
        } catch (error) {
            this.logger.error(`Failed to load vehicle`, error);
        }
    }

    private static saveVehicle(data: VehicleEntity) {
        let query = `UPDATE vehicles SET 
            model = ?, 
            position = ?,
            rotation = ?, 
            color = ? 
            WHERE uid = ?`;

        let params = [
            data.model,
            data.position,
            data.rotation,
            data.color,
            data.uid
        ];

        Database.Execute(query, params);
    }

    public static async reloadVehiclesFromDatabase() {
        try {
            this.destroyAllVehicles();
            
            let vehicles = await Database.Select(VehicleEntity, 'SELECT * FROM vehicles');
            for (let vehicleData of vehicles) {
                this.loadVehicle(vehicleData);
            }
            
            this.logger.info(`Loaded ${vehicles.length} vehicles from database`);
        } catch (error) {
            this.logger.error(`Failed to reload vehicles from database: ${error}`);
        }
    }

    public static async init() {
        try {
            await this.reloadVehiclesFromDatabase();
            this.logger.info('VehicleService initialized successfully');
        } catch (error) {
            this.logger.error(`Failed to initialize VehicleService: ${error}`);
        }
    }
}