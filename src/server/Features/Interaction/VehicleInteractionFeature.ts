import EventService from '@/Services/Infrastructure/EventService';
import NotificationService from '@/Services/Infrastructure/NotificationService';
import { NotificationType } from '@shared/Models/NotificationType';
import translate from '@shared/Translation/Translation';

export default class VehicleInteractionFeature {
	public static init() {
		EventService.registerEventHandler('interaction:vehicle:toggleLocks', this.toggleLocks.bind(this));

		// Prevent vehicle locking when driver exits or loggs out
		mp.events.add('playerExitVehicle', this.onPlayerExitVehicle.bind(this));
		mp.events.add('playerQuit', this.onPlayerLeave.bind(this));
	}

	private static toggleLocks(client: PlayerMp, open: boolean) {
		const vehicle = client.vehicle;
		if (!vehicle) return;

		const driver = vehicle.getOccupant(0);
		if (driver !== client) return;

		vehicle.locked = !open;
		NotificationService.addNotification(
			client,
			NotificationType.Info,
			translate('vehicle.doors.title'),
			open ? translate('vehicle.doors.unlocked') : translate('vehicle.doors.locked'),
			'Lock'
		);
	}

	private static onPlayerExitVehicle(_client: PlayerMp, vehicle: VehicleMp) {
		const vehicleDriver = vehicle.getOccupant(0);
		if (vehicleDriver == null && vehicle.locked) {
			vehicle.locked = false;
		}
	}

	private static onPlayerLeave(client: PlayerMp) {
		const vehicle = client.vehicle;
		if (!vehicle) return;

		const vehicleDriver = vehicle.getOccupant(0);
		if (vehicleDriver == null && vehicle.locked) {
			vehicle.locked = false;
		}
	}
}
