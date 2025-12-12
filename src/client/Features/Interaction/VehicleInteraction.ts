import WorldInteraction from "./WorldInteraction";
import translate from "@shared/Translation/Translation";
import NotificationService from "@/Services/Infrastructure/NotificationService";
import { NotificationType } from "@shared/Models/NotificationType";
import EventService from "@/Services/Infrastructure/EventService";
import { WorldInteractionHandler } from "@shared-rage/Models/WorldInteractionListener";

export default class VehicleInteraction {
	public static init() {
		WorldInteraction.registerWorldInteractionListener(this.vehicleInteractionsCallback.bind(this));
	}

    private static vehicleInteractionsCallback(): WorldInteractionHandler[] | null {
        const options: WorldInteractionHandler[] = [];

        mp.vehicles.forEachInRange(mp.players.local.position, 15, (vehicle) => {
            const trunkOpen = vehicle.getDoorAngleRatio(5) > 0.1;
            const hoodOpen = vehicle.getDoorAngleRatio(4) > 0.1;
            const doorsLocked = vehicle.getDoorLockStatus() >= 2;

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
                },
                entity: vehicle
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
                },
                entity: vehicle
            });

            options.push({
                label: doorsLocked ? translate('interaction_wheel.vehicle.unlock-doors') : translate('interaction_wheel.vehicle.lock-doors'),
                icon: 'Lock',
                action: () => {
                    EventService.triggerServerEvent('interaction:vehicle:toggleLocks', doorsLocked);
                },
                entity: vehicle
            });
        });

        return options;
    }
}