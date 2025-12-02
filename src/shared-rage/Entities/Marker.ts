import MarkerType from '../Models/MarkerType';
import MarkerService from '../Services/MarkerService';
import MarkerHitType from '../Models/MarkerHitType';
import SharedConfig from "@shared/SharedConfig";

export default class Marker {
    // marker: MarkerMp;
    public position: Vector3;
    private colorValue: RGBA = [255, 255, 255, 255];
    private colorLighterCache: Map<number, RGBA> = new Map();
    public scale: number;
    public type: MarkerType;
    public dimension: number;
    public renderDistance: number = SharedConfig.MarkerRenderDistance;
    public colShape: ColshapeMp;
    private insideMarker: Set<PlayerMp> = new Set();

    constructor(position: Vector3, color: RGBA, scale: number, type: MarkerType = MarkerType.Cylinder, dimension: number = 0, hitDistance?: number) {
        hitDistance = hitDistance || scale;

        this.colShape = mp.colshapes.newSphere(position.x, position.y, position.z, hitDistance, dimension);
        this.position = position;
        this.color = color;
        this.scale = scale;
        this.type = type;
        this.dimension = dimension;
    }

    public _handleHit(hitType: MarkerHitType, player: PlayerMp) {
        if (hitType === MarkerHitType.Enter) {
            this.insideMarker.add(player);
        } else {
            this.insideMarker.delete(player);
        }
    }

    public get color(): RGBA {
        return this.colorValue;
    }

    public set color(value: RGBA) {
        this.colorValue = value;
        this.colorLighterCache.clear();
    }

    public getLighterColor(factor: number): RGBA {
        if (this.colorLighterCache.has(factor)) {
            return this.colorLighterCache.get(factor)!;
        }

        const lighterColor: RGBA = [
            Math.min(255, Math.floor(this.color[0] + (255 - this.color[0]) * factor)),
            Math.min(255, Math.floor(this.color[1] + (255 - this.color[1]) * factor)),
            Math.min(255, Math.floor(this.color[2] + (255 - this.color[2]) * factor)),
            this.color[3],
        ];

        this.colorLighterCache.set(factor, lighterColor);
        return lighterColor;
    }

    public destroy() {
        this.colShape.destroy();
        MarkerService._destroyInternal(this);
    }

    public registerEventHandler(callback: (hitType: MarkerHitType, player: PlayerMp, marker?: Marker) => void) {
        MarkerService.registerEventHandler(this, callback);
    }

    public unregisterEventHandler(callback: (hitType: MarkerHitType, player: PlayerMp, marker?: Marker) => void) {
        MarkerService.unregisterEventHandler(this, callback);
    }
}