import Logger from '@shared/Logger';
import MarkerType from '../Models/MarkerType';
import MarkerService from '../Services/MarkerService';
import MarkerHitType from '../Models/MarkerHitType';

export default class Marker {
    marker: MarkerMp;
    private colorValue: RGBA;
    private scaleValue: number;
    private typeValue: MarkerType;
    private insideMarker: Set<EntityMp> = new Set();

    private logger: Logger = Logger.getLogger(Marker, false);

    constructor(position: Vector3, color: RGBA, scale: number, type: MarkerType = MarkerType.Cylinder, dimension: number = 0) {
        const newPosition = this.toTargetPosition(position, type);

        const markerMp = mp.markers.new(type, newPosition, scale, {
            color: color,
            dimension: dimension,
        });

        this.marker = markerMp;
        this.colorValue = color;
        this.scaleValue = scale;
        this.typeValue = type;
    }

    get position(): Vector3 {
        return this.fromTargetPosition(this.marker.position, this.type);
    }

    set position(value: Vector3) {
        this.marker.position = this.toTargetPosition(value, this.type);
    }

    get color(): RGBA {
        return this.colorValue;
    }

    set color(value: RGBA) {
        this.colorValue = value;
        this.marker.setColor(...value);
    }

    get scale(): number {
        return this.scaleValue;
    }

    set scale(value: number) {
        this.scaleValue = value;
        this.marker.scale = value;
    }

    get type(): MarkerType {
        return this.typeValue;
    }

    // can't change type after creation

    get dimension(): number {
        return this.marker.dimension;
    }

    set dimension(value: number) {
        this.marker.dimension = value;
    }

    public update() {
        const playersPool = mp.players as any;
        const playersList = ('streamed' in playersPool && Array.isArray(playersPool.streamed) 
            ? playersPool.streamed 
            : mp.players.toArray()) as PlayerMp[];

        this.updateForEntities(playersList);
    }

    private updateForEntities(entities: EntityMp[]) {
        const filteredEntities = entities.filter(e => e.dimension === this.dimension);
        const markerPos = this.fromTargetPosition(this.marker.position, this.type);
        const markerScale = this.marker.scale;

        const entitiesDistanceToMarker = Object.fromEntries(
            filteredEntities.map(entity => {
                const position = entity.position;
                const distance = position.subtract(markerPos).length();
                return [entity.id, { entity, distance }];
            })
        );

        // Check for entities entering the marker
        const entitiesOutsideMarker = filteredEntities.filter(e => !this.insideMarker.has(e));
        for (let entity of entitiesOutsideMarker) {
            const { distance } = entitiesDistanceToMarker[entity.id];
            if (distance <= markerScale) {
                this.insideMarker.add(entity);
                this.logger.debug(`Entity ${entity.id} entered marker at ${markerPos.x}, ${markerPos.y}, ${markerPos.z}`);
                MarkerService._handleMarkerHit(this, MarkerHitType.Enter, entity);
            }
        }

        // Check for entities exiting the marker
        const entitiesInsideMarker = Array.from(this.insideMarker);
        for (let entity of entitiesInsideMarker) {
            const { distance } = entitiesDistanceToMarker[entity.id] || { distance: Infinity };
            if (distance > markerScale) {
                this.insideMarker.delete(entity);
                this.logger.debug(`Entity ${entity.id} exited marker at ${markerPos.x}, ${markerPos.y}, ${markerPos.z}`);
                MarkerService._handleMarkerHit(this, MarkerHitType.Exit, entity);    
            }
        }
    }

    public destroy() {
        this.marker.destroy();
        MarkerService._destroyInternal(this);
    }

    public registerEventHandler(callback: (hitType: MarkerHitType, entity: EntityMp, marker?: Marker) => void) {
        MarkerService.registerEventHandler(this, callback);
    }

    public unregisterEventHandler(callback: (hitType: MarkerHitType, entity: EntityMp, marker?: Marker) => void) {
        MarkerService.unregisterEventHandler(this, callback);
    }

    private toTargetPosition(position: Vector3, type: MarkerType): Vector3 {
        if (type === MarkerType.Cylinder) {
            return new mp.Vector3(position.x, position.y, position.z - 1.0);
        }

        return position;
    }

    private fromTargetPosition(position: Vector3, type: MarkerType): Vector3 {
        if (type === MarkerType.Cylinder) {
            return new mp.Vector3(position.x, position.y, position.z + 1.0);
        }

        return position;
    }
}