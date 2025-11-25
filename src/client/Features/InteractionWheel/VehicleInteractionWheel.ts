import KeyboardService, { KeyState } from "@/Services/KeyboardService";
import InteractionWheelFeature, { InteractionWheelItem } from "./InteractionWheelFeature";
import translate from "@shared/Translation/Translation";
import EventService from "@/Services/EventService";
import NotificationService from "@/Services/NotificationService";
import { NotificationType } from "@shared/Models/NotificationType";

export default class VehicleInteractionWheel {
    public static init() {
        KeyboardService.registerKeyHandler('Shift', this.toggleVehicleInteractionWheel.bind(this));
    }

    private static toggleVehicleInteractionWheel(state: KeyState, _holdTime?: number) {
        const vehicle = mp.players.local.vehicle;
        if (!vehicle) return;

        const isDriver = vehicle.getPedInSeat(0) === mp.players.local.id;

        if (state === KeyState.Down) {
            const trunkOpen = vehicle.getDoorAngleRatio(5) > 0.1;
            const hoodOpen = vehicle.getDoorAngleRatio(4) > 0.1;
            const doorsLocked = vehicle.getDoorLockStatus() >= 2;
            const options: InteractionWheelItem[] = [];

            if (isDriver) {
                options.push({
                    name: !trunkOpen ? translate('interaction_wheel.vehicle.open-trunk') : translate('interaction_wheel.vehicle.close-trunk'),
                    icon: 'DoorOpen',
                    callback: () => {
                        if (trunkOpen) {
                            vehicle.setDoorShut(5, false);
                        } else {
                            vehicle.setDoorOpen(5, false, false);
                        }

                        NotificationService.addNotification(NotificationType.Info, translate('vehicle.trunk.title'), trunkOpen ? translate('vehicle.trunk.unlocked') : translate('vehicle.trunk.locked'), 'DoorOpen');

                    },
                    color: trunkOpen ? '#a200ffaa' : '#a6ff00aa'
                });

                options.push({
                    name: !hoodOpen ? translate('interaction_wheel.vehicle.open-hood') : translate('interaction_wheel.vehicle.close-hood'),
                    icon: 'CarFront',
                    callback: () => {
                        if (hoodOpen) {
                            vehicle.setDoorShut(4, false);
                        } else {
                            vehicle.setDoorOpen(4, false, false);
                        }

                        NotificationService.addNotification(NotificationType.Info, translate('vehicle.hood.title'), hoodOpen ? translate('vehicle.hood.unlocked') : translate('vehicle.hood.locked'), 'CarFront');
                    },
                    color: hoodOpen ? '#a200ffaa' : '#a6ff00aa'
                });

                options.push({
                    name: doorsLocked ? translate('interaction_wheel.vehicle.unlock-doors') : translate('interaction_wheel.vehicle.lock-doors'),
                    icon: 'Lock',
                    callback: () => {
                        EventService.triggerServerEvent('interaction:vehicle:toggleLocks', doorsLocked);
                    },
                    color: doorsLocked ? '#a200ffaa' : '#a6ff00aa'
                });
            }

            if (options.length === 0) {
                return;
            }

            InteractionWheelFeature.showInteractionWheel(options, {
                title: translate('interaction_wheel.vehicle.title'),
                subtitle: translate('interaction_wheel.vehicle.subtitle')
            });
        } else {
            InteractionWheelFeature.hideInteractionWheel();
        }
    }
}