import { Config } from '@/Config';
import Database from '@/Database/Database';
import { VehicleEntity } from '@/Database/Entities/VehicleEntity';
import PrivateVehicle from '@/Entities/PrivateVehicle';
import Logger from '@shared/Logger';
import TimerService from '@shared/Services/TimerService';

export default class VehicleService {
	private static vehicles: PrivateVehicle[] = [];
	private static logger: Logger = Logger.getLogger(VehicleService, true);

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

	private static buildSaveQuery(data: PrivateVehicle): { query: string; params: any[] } {
		const query = `
            UPDATE vehicles SET
                model = ?,
                position = ?,
                rotation = ?,
                color = ?
            WHERE uid = ?
        `;

		const model = data.model;
		const position = `${data.vehicle.position.x},${data.vehicle.position.y},${data.vehicle.position.z}`;
		const rotation = `${data.vehicle.rotation.x},${data.vehicle.rotation.y},${data.vehicle.rotation.z}`;
		const color = data.colorString;

		const params = [model, position, rotation, color, data.uid];
		return { query, params };
	}

	public static async saveVehicle(data: PrivateVehicle) {
		const { query, params } = this.buildSaveQuery(data);
		await Database.Execute(query, params);
	}

	public static async saveVehicles() {
		const batchSize = 100;

		for (let i = 0; i < this.vehicles.length; i += batchSize) {
			const batch = this.vehicles.slice(i, i + batchSize);
			const queries: string[] = [];
			const allParams: any[] = [];

			for (const vehicle of batch) {
				const { query, params } = this.buildSaveQuery(vehicle);
				queries.push(query.trim());
				allParams.push(...params);
			}

			const finalQuery = queries.join('; '); // multiple UPDATEs in one query
			await Database.Execute(finalQuery, allParams);
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
			TimerService.setTimer(this.saveVehicles.bind(this), Config.SaveInterval.Vehicles, 0); // Save every 60 seconds
			this.logger.info('VehicleService initialized successfully');
		} catch (error) {
			this.logger.error(`Failed to initialize VehicleService: ${error}`);
		}
	}
}
