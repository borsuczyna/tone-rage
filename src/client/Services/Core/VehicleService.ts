import { ElementDataEntity } from "@shared-rage/Models/ElementDataType";
import ElementDataService from "../Infrastructure/ElementDataService";
import EventService from "../Infrastructure/EventService";

export default class VehicleService {
    public static init() {
        mp.events.add('entityStreamIn', this.onEntityStreamIn.bind(this));
        ElementDataService.registerListener('lightsState', this.onLightsStateChange.bind(this));
        EventService.registerEventHandler('spawn:onSpawned', this.onSpawned.bind(this));

        // Disable engine auto start
        mp.events.add('playerReady', this.disableVehicleEngineAutoStart.bind(this));
    }

    private static onEntityStreamIn(entity: EntityMp) {
        if (entity.type !== 'vehicle') {
            return;
        }

        const lightsState = ElementDataService.get(entity as VehicleMp, 'lightsState') as (number | undefined);
        this.setLightsState(entity as VehicleMp, lightsState ?? 1);
    }

    private static onLightsStateChange(element: ElementDataEntity, _key: string, _oldValue: any, newValue: any) {
        if (element.type !== 'vehicle') {
            return;
        }

        this.setLightsState(element as VehicleMp, newValue);
    }

    private static setLightsState(vehicle: VehicleMp, state: number) {
        // @ts-ignore
        vehicle.setLights(state);
    }

    private static disableVehicleEngineAutoStart() {
        mp.game.vehicle.defaultEngineBehaviour = false;
        mp.game.controls.useDefaultVehicleEntering = false;
        mp.players.local.setConfigFlag(429, true);
    }

    private static onSpawned() {
        this.disableVehicleEngineAutoStart();
        mp.game.audio.freezeRadioStation('OFF');
    }
}