import { WorldInteractionHandler } from "@shared/Models/WorldInteraction";
import WorldInteraction from "./WorldInteraction";
import translate from "@shared/Translation/Translation";
import NotificationService from "@/Services/Infrastructure/NotificationService";
import { NotificationType } from "@shared/Models/NotificationType";
import EventService from "@/Services/Infrastructure/EventService";

export default class VehicleInteraction {
	public static init() {
		WorldInteraction.registerWorldInteractionListener(this.vehicleInteractionsCallback.bind(this));
	}

    private static getClosestVehicle(): VehicleMp | null {
        const player = mp.players.local;
        const playerPos = player.position;
        let closestVehicle: VehicleMp | null = null;
        let closestDistance = 5.0; // Interaction range

        mp.vehicles.forEachInStreamRange((vehicle) => {
            const length = playerPos.subtract(vehicle.position).length();
            if (length < closestDistance) {
                closestDistance = length;
                closestVehicle = vehicle;
            }
        });

        return closestVehicle;
    }

    private static vehicleInteractionsCallback(): WorldInteractionHandler[] | null {
        let vehicle: VehicleMp | null = mp.players.local.vehicle;
        const options: WorldInteractionHandler[] = [];

        if (!vehicle) {
            vehicle = this.getClosestVehicle();
        }

        if (!vehicle) {
            return null;
        }
        // const isDriver = vehicle.getPedInSeat(0) === mp.players.local.id;
        const isDriver = true;

        const trunkOpen = vehicle.getDoorAngleRatio(5) > 0.1;
        const hoodOpen = vehicle.getDoorAngleRatio(4) > 0.1;
        const doorsLocked = vehicle.getDoorLockStatus() >= 2;

        if (isDriver) {
            options.push({
                label: !trunkOpen ? translate('interaction_wheel.vehicle.open-trunk') : translate('interaction_wheel.vehicle.close-trunk'),
                icon: 'DoorOpen',
                action: () => {
                    if (trunkOpen) {
                        vehicle.setDoorShut(5, false);
                    } else {
                        vehicle.setDoorOpen(5, false, false);
                    }

                    NotificationService.addNotification(
                        NotificationType.Info,
                        translate('vehicle.trunk.title'),
                        trunkOpen ? translate('vehicle.trunk.unlocked') : translate('vehicle.trunk.locked'),
                        'DoorOpen'
                    );
                }
            });

            options.push({
                label: !hoodOpen ? translate('interaction_wheel.vehicle.open-hood') : translate('interaction_wheel.vehicle.close-hood'),
                icon: 'CarFront',
                action: () => {
                    if (hoodOpen) {
                        vehicle.setDoorShut(4, false);
                    } else {
                        vehicle.setDoorOpen(4, false, false);
                    }

                    NotificationService.addNotification(
                        NotificationType.Info,
                        translate('vehicle.hood.title'),
                        hoodOpen ? translate('vehicle.hood.unlocked') : translate('vehicle.hood.locked'),
                        'CarFront'
                    );
                }
            });

            options.push({
                label: doorsLocked ? translate('interaction_wheel.vehicle.unlock-doors') : translate('interaction_wheel.vehicle.lock-doors'),
                icon: 'Lock',
                action: () => {
                    EventService.triggerServerEvent('interaction:vehicle:toggleLocks', doorsLocked);
                }
            });
        }

        return options;
    }
}