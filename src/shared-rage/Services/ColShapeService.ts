import TimerService from "@shared/Services/TimerService";
import SharedConfig from "@shared/SharedConfig";
import { ColShape, ColShapeEventCallback, ColShapeHandler, ColShapeHitType } from "Entities/ColShape/ColShape";

const isClientSide = typeof mp !== 'undefined' && typeof mp.game !== 'undefined';

export default class ColShapeService {
    private static colShapes: ColShape[] = [];
    private static handlers: ColShapeHandler[] = [];

    public static init() {
        TimerService.setTimer(this.update.bind(this), 100, 0);

        if (isClientSide) {
            mp.events.add('render', this.drawDebug.bind(this));
        }
    }
    
    public static addColShape(colShape: ColShape) {
        this.colShapes.push(colShape);
    }

    public static destroyColShape(colShape: ColShape) {
        this.handlers = this.handlers.filter((handler) => handler.colshape !== colShape);
        this.colShapes = this.colShapes.filter((cs) => cs !== colShape);
    }

    public static update() {
        this.colShapes.forEach((colShape) => {
            colShape.update();
        });
    }

    public static drawDebug() {
        if (!isClientSide || !SharedConfig.ColShapeDebug) return;

        this.colShapes.forEach((colShape) => {
            colShape.renderDebug();
        });
    }

    public static registerHandler(callback: ColShapeEventCallback, colshape?: ColShape, hitType?: ColShapeHitType) {
        this.handlers.push({ colshape, hitType, callback });
    }

    public static removeHandler(callback: ColShapeEventCallback) {
        this.handlers = this.handlers.filter((handler) => handler.callback !== callback);
    }

    public static triggerEvent(entity: EntityMp, colshape: ColShape, hitType: ColShapeHitType) {
        this.handlers.forEach((handler) => {
            if ((handler.colshape === undefined || handler.colshape === colshape) &&
                (handler.hitType === undefined || handler.hitType === hitType)) {
                handler.callback(entity, colshape, hitType);
            }
        });
    }
}