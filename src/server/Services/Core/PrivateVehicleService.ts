import { Config } from '@/Config';
import Database from '@/Database/Database';
import { VehicleEntity } from '@/Database/Entities/VehicleEntity';
import PrivateVehicle from '@/Entities/PrivateVehicle';
import Logger from '@shared/Logger';
import TimerService from '@shared/Services/TimerService';

export default class PrivateVehicleService {
	private static vehicles: PrivateVehicle[] = [];
	private static logger: Logger = Logger.getLogger(PrivateVehicleService, true);

	public static async init() {
		try {
			await this.reloadVehiclesFromDatabase();
			TimerService.setTimer(this.saveVehicles.bind(this), Config.SaveInterval.Vehicles, 0); // Save every 60 seconds
			this.logger.info('VehicleService initialized successfully');
		} catch (error) {
			this.logger.error(`Failed to initialize VehicleService: ${error}`);
		}
	}

	private static destroyAllVehicles() {
		for (let vehicle of this.vehicles) {
			vehicle.destroy();
		}
	}

	private static loadVehicle(data: VehicleEntity) {
		try {
			let privateVehicle = new PrivateVehicle(data);
			this.vehicles.push(privateVehicle);
		} catch (error) {
			this.logger.error(`Failed to load vehicle`, error);
		}
	}

	public static async saveVehicle(data: PrivateVehicle) {
		try {
			const model = data.model;
			const position = `${data.vehicle.position.x},${data.vehicle.position.y},${data.vehicle.position.z}`;
			const rotation = `${data.vehicle.rotation.x},${data.vehicle.rotation.y},${data.vehicle.rotation.z}`;
			const color = data.colorString;

			await VehicleEntity.update(
				{
					model,
					position,
					rotation,
					color
				},
				{
					where: { uid: data.uid }
				}
			);
		} catch (error) {
			this.logger.error(`Failed to save vehicle: ${error}`);
		}
	}

	public static async saveVehicles() {
        for (const vehicle of this.vehicles) {
            await this.saveVehicle(vehicle);
        }

		this.logger.info(`Saved ${this.vehicles.length} vehicles to database`);
	}

	public static getVehicleByUid(uid: number): PrivateVehicle | undefined {
		return this.vehicles.find((v) => v.uid === uid);
	}

	public static getVehicleByEntity(vehicle: VehicleMp): PrivateVehicle | undefined {
		return this.vehicles.find((v) => v.vehicle === vehicle);
	}

	public static async reloadVehiclesFromDatabase() {
		try {
			this.destroyAllVehicles();

			let vehicles = await VehicleEntity.findAll();
			for (let vehicleData of vehicles) {
				this.loadVehicle(vehicleData);
			}

			this.logger.info(`Loaded ${vehicles.length} vehicles from database`);
		} catch (error) {
			this.logger.error(`Failed to reload vehicles from database: ${error}`);
		}
	}
}
