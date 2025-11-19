import Logger from '@shared/Logger';
import MarkerType from '../Models/MarkerType';
import MarkerService from '../Services/MarkerService';
import MarkerHitType from '../Models/MarkerHitType';

export default class Marker {
    marker: MarkerMp;
    private colorValue: RGBA;
    private scaleValue: number;
    private typeValue: MarkerType;
    private colShape: ColshapeMp;
    private insideMarker: Set<EntityMp> = new Set();

    private logger: Logger = Logger.getLogger(Marker, false);

    constructor(position: Vector3, color: RGBA, scale: number, type: MarkerType = MarkerType.Cylinder, dimension: number = 0) {
        const newPosition = this.toTargetPosition(position, type);

        const markerMp = mp.markers.new(type, newPosition, scale, {
            color: color,
            dimension: dimension,
        });

        this.colShape = mp.colshapes.newSphere(position.x, position.y, position.z, scale, dimension);
        mp.events.add('playerEnterColshape', this.onColshapeEnter.bind(this));
        mp.events.add('playerExitColshape', this.onColshapeExit.bind(this));

        this.marker = markerMp;
        this.colorValue = color;
        this.scaleValue = scale;
        this.typeValue = type;
    }

    private onColshapeEnter(entity: EntityMp, colshape: ColshapeMp) {
        if (colshape === this.colShape) {
            MarkerService._handleMarkerHit(this, MarkerHitType.Enter, entity);
            this.insideMarker.add(entity);
            this.logger.debug(`Entity ${entity.id} entered marker at ${this.position.x}, ${this.position.y}, ${this.position.z}`);
        }
    }

    private onColshapeExit(entity: EntityMp, colshape: ColshapeMp) {
        if (colshape === this.colShape) {
            MarkerService._handleMarkerHit(this, MarkerHitType.Exit, entity);
            this.insideMarker.delete(entity);
            this.logger.debug(`Entity ${entity.id} exited marker at ${this.position.x}, ${this.position.y}, ${this.position.z}`);
        }
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