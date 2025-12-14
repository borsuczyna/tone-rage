import ColShapeService from "../../Services/ColShapeService";

export enum ColShapeType {
    Sphere = 'sphere',
    Box = 'box',
}

export enum ColShapeHitType {
    Enter = 'enter',
    Exit = 'exit',
}

export type ColShapeEventCallback = (entity: EntityMp, colshape: ColShape, hitType: ColShapeHitType) => void;

export interface ColShapeHandler {
    colshape?: ColShape;
    hitType?: ColShapeHitType;
    callback: ColShapeEventCallback;
}

export abstract class ColShape {
    public type: ColShapeType = ColShapeType.Sphere;
    public dimension: number = 0;
    public elementsInside: Set<EntityMp> = new Set();

    constructor() {
        ColShapeService.addColShape(this);
    }

    public isEntityInside(entity: EntityMp): boolean {
        return this.elementsInside.has(entity);
    }

    public update() {
        const entitiesToCheck = this.getEntitiesToCheck();
        entitiesToCheck.forEach((entity) => {
            const isInside = this.checkEntityInside(entity);
            const wasInside = this.elementsInside.has(entity);

            if (isInside && !wasInside) {
                this.elementsInside.add(entity);
                ColShapeService.triggerEvent(entity, this, ColShapeHitType.Enter);
            } else if (!isInside && wasInside) {
                this.elementsInside.delete(entity);
                ColShapeService.triggerEvent(entity, this, ColShapeHitType.Exit);
            }
        });
    }

    public destroy() {
        ColShapeService.destroyColShape(this);
    }

    public abstract renderDebug(): void;
    protected abstract checkEntityInside(_entity: EntityMp): boolean;

    public getEntitiesToCheck(): EntityMp[] {
        const entities: EntityMp[] = [];
        
        const playersForeachFunction = (mp.players as any).forEachInStreamRange || mp.players.forEach;
        playersForeachFunction.call(mp.players, (player: PlayerMp) => {
            if (player.dimension !== this.dimension) return;
            entities.push(player);
        });

        const vehiclesForeachFunction = (mp.vehicles as any).forEachInStreamRange || mp.vehicles.forEach;
        vehiclesForeachFunction.call(mp.vehicles, (vehicle: VehicleMp) => {
            if (vehicle.dimension !== this.dimension) return;
            entities.push(vehicle);
        });

        return entities;
    }
}