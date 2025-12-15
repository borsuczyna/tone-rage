import { ElementDataEntity } from "@shared-rage/Models/ElementDataType";
import ElementDataService from "../Infrastructure/ElementDataService";

export default class VehicleService {
    public static init() {
        mp.events.add('entityStreamIn', this.onEntityStreamIn.bind(this));
        ElementDataService.registerListener('lightsState', this.onLightsStateChange.bind(this));
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
}