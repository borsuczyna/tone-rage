import { NotificationType } from "@shared/Models/NotificationType";
import EventService from "../Infrastructure/EventService";
import NotificationService from "../Infrastructure/NotificationService";
import translate from "@shared/Translation/Translation";
import ElementDataService from "../Infrastructure/ElementDataService";
import { ShareMode } from "@shared/Models/ElementDataModels";

export default class VehicleService {
    public static init() {
        EventService.registerEventHandler('vehicleService:setEngineState', this.setEngineStateHandler.bind(this));
        EventService.registerEventHandler('vehicleService:setLightsState', this.setLightsStateHandler.bind(this));
    }

    public static setEngineState(vehicle: VehicleMp, state: boolean) {
        vehicle.engine = state;
    }

    public static setLightsState(vehicle: VehicleMp, state: number) {
        ElementDataService.set(vehicle, 'lightsState', state, ShareMode.Everywhere);
    }

    private static setEngineStateHandler(client: PlayerMp, state: boolean) {
        try {
            state = Boolean(state);

            const vehicle = client.vehicle;
            if (!vehicle || vehicle.getOccupant(0) !== client || vehicle.engine == state) {
                return;
            }

            this.setEngineState(vehicle, state);

            NotificationService.addNotification(client, NotificationType.Info, translate('vehicle.engine.title'),
                state ? translate('vehicle.engine.on') : translate('vehicle.engine.off'), 'Engine');
        } catch (e) {}
    }

    private static setLightsStateHandler(client: PlayerMp, state: number) {
        try {
            state = Number(state);

            const vehicle = client.vehicle;
            if (!vehicle || vehicle.getOccupant(0) !== client) {
                return;
            }
            
            const lightsState = ElementDataService.get(vehicle, 'lightsState');
            if (lightsState === state || typeof state !== 'number' || state < 0 || state > 2) {
                return;
            }

            this.setLightsState(vehicle, state);
        } catch (e) {}
    }
}