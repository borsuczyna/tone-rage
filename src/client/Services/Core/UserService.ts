import Logger from "@shared/Logger";
import ElementDataService from "../Infrastructure/ElementDataService";
import { ElementDataEntity } from "@shared-rage/Models/ElementDataType";

export default class UserService {
    private static logger = Logger.getLogger(UserService);

    public static init() {
        ElementDataService.registerListener('isFrozen', this.onFrozenStatusChange.bind(this));
    }

    private static onFrozenStatusChange(element: ElementDataEntity, _key: string, _oldValue: any, newValue: any) {
        if (element.type !== 'player' && element.type !== 'vehicle') return;

        element.freezePosition(!!newValue);
        this.logger.info(`Entity ${element.type} ${element.id} frozen status changed to: ${newValue}`);
    }
}