import WorldInteraction from "./WorldInteraction";
import translate from "@shared/Translation/Translation";
import { WorldInteractionHandler } from "@shared-rage/Models/WorldInteractionListener";
import EventService from "@/Services/Infrastructure/EventService";
import ElementDataService from "@/Services/Infrastructure/ElementDataService";

export default class VehicleInteraction {
	public static init() {
		WorldInteraction.registerWorldInteractionListener(this.vehicleInteractionsCallback.bind(this));
	}

    private static vehicleInteractionsCallback(): WorldInteractionHandler[] | null {
        const options: WorldInteractionHandler[] = [];

        const currentVehicle = mp.players.local.vehicle;
        if (currentVehicle && currentVehicle.getPedInSeat(-1) === mp.players.local.handle) {
            const engineState = currentVehicle.getIsEngineRunning();
            const lightsState = ElementDataService.get(currentVehicle, 'lightsState') as (number | undefined);

            options.push({
                label: engineState ? translate('interaction_wheel.vehicle.turn-off-engine') : translate('interaction_wheel.vehicle.turn-on-engine'),
                icon: 'CarFront',
                action: () => {
                    currentVehicle.setEngineOn(!engineState, true, true);
                },
                entity: currentVehicle,
                priority: 10
            });

            options.push({
                label: lightsState == 2 ? translate('interaction_wheel.vehicle.turn-off-lights') : translate('interaction_wheel.vehicle.turn-on-lights'),
                icon: 'Lightbulb',
                action: () => {
                    EventService.triggerServerEvent('vehicleService:setLightsState', lightsState == 2 ? 1 : 2);
                },
                entity: currentVehicle,
                priority: 9
            });
        }

        return options;
    }
}