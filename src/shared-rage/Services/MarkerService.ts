import Marker from '../Entities/Marker';
import MarkerType from '../Models/MarkerType';
import MarkerEvent from '../Models/MarkerEvent';
import MarkerHitType from '../Models/MarkerHitType';
import isClientSide from '../isClientSide';
import DrawingService from '../../client/Services/DrawingService';

export default class MarkerService {
    private static markers: Set<Marker> = new Set();
    private static events: Set<MarkerEvent> = new Set();

    public static init() {
        mp.events.add('playerEnterColshape', this.onColshapeEnter.bind(this));
        mp.events.add('playerExitColshape', this.onColshapeExit.bind(this));
        mp.events.add('render', this.render.bind(this));
    }

    public static onColshapeEnter(player: PlayerMp, colshape: ColshapeMp) {
        if (isClientSide) {
            colshape = player as any; // On client side, colshape is the first parameter
            player = mp.players.local;
        }
        
        const marker = Array.from(MarkerService.markers).find(m => m.colShape === colshape);
        if (marker) {
            marker._handleHit(MarkerHitType.Enter, player);
            this._handleMarkerHit(marker, MarkerHitType.Enter, player);
        }
    }

    public static onColshapeExit(player: PlayerMp, colshape: ColshapeMp) {
        if (isClientSide) {
            colshape = player as any; // On client side, colshape is the first parameter
            player = mp.players.local;
        }
        
        const marker = Array.from(MarkerService.markers).find(m => m.colShape === colshape);
        if (marker) {
            marker._handleHit(MarkerHitType.Exit, player);
            this._handleMarkerHit(marker, MarkerHitType.Exit, player);
        }
    }

    public static createMarker(position: Vector3, color: RGBA, scale: number, type: MarkerType = MarkerType.Cylinder, dimension: number = 0, hitDistance?: number): Marker {
        const marker = new Marker(position, color, scale, type, dimension, hitDistance);
        this.markers.add(marker);
        return marker;
    }

    public static _destroyInternal(marker: Marker) {
        this.markers.delete(marker);
    }

    public static registerEventHandler(marker: Marker | null, callback: (hitType: MarkerHitType, player: PlayerMp, marker?: Marker) => void) {
        this.events.add({ marker, callback });
    }

    public static unregisterEventHandler(marker: Marker | null, callback: (hitType: MarkerHitType, player: PlayerMp, marker?: Marker) => void) {
        for (let event of this.events) {
            if (event.marker === marker && event.callback === callback) {
                this.events.delete(event);
                break;
            }
        }
    }

    public static _handleMarkerHit(marker: Marker, hitType: MarkerHitType, player: PlayerMp) {
        for (let event of this.events) {
            if (event.marker === marker || event.marker === null) {
                event.callback(hitType, player, marker);
            }
        }
    }

    public static render() {
        if (!isClientSide) {
            return;
        }
        
        const position = mp.players.local.position;
        const markersInRange = Array.from(this.markers).filter(marker => {
            const dist = this.distanceToMarker(position, marker);
            return dist <= (marker.renderDistance || 50);
        });

        for (let marker of markersInRange) {
            this.renderMarker(marker);
        }
    }

    private static renderMarkerRing(marker: Marker, sides: number = 12) {
        const step = (2 * Math.PI) / sides;
        const halfStep = step / 2;
        const uvStep = 1 / sides;
        const position = new mp.Vector3(marker.position.x, marker.position.y, marker.position.z - 0.6);
        const uvAdd = new Date().getTime() / 13000 % 1;
        let lastPoint: Vector3 | null = null;

        for (let angle = 0; angle <= 2 * Math.PI; angle += step) {
            const uv = (angle / (2 * Math.PI)) + uvAdd;
            const point = new mp.Vector3(
                position.x + marker.scale / 2 * Math.cos(angle),
                position.y + marker.scale / 2 * Math.sin(angle),
                position.z,
            );

            if (lastPoint) {
                const faceTowards = new mp.Vector3(
                    position.x + marker.scale / 2 * Math.cos(angle - halfStep),
                    position.y + marker.scale / 2 * Math.sin(angle - halfStep),
                    position.z,
                );

                DrawingService.drawPlane3D(
                    lastPoint,
                    point,
                    faceTowards,
                    0.5,
                    '/markers/glow.png',
                    marker.getLighterColor(0.5),
                    true,
                    256, 256,
                    [0, uv, 1, uv + uvStep]
                );

                DrawingService.drawPlane3D(
                    lastPoint,
                    point,
                    faceTowards,
                    0.5,
                    '/markers/texture.png',
                    marker.color,
                    true,
                    256, 256,
                    [0, uv, 1, uv + uvStep]
                );
            }

            lastPoint = point;
        }
    }

    private static renderMarker(marker: Marker) {
        const alpha = Math.floor(155 + 100 * (Math.sin(Date.now() / 500) + 1) / 2);
        const start = new mp.Vector3(marker.position.x + marker.scale / 2, marker.position.y, marker.position.z - 1);
        const end = new mp.Vector3(marker.position.x - marker.scale / 2, marker.position.y, marker.position.z - 1);

        DrawingService.drawPlane3D(
            start,
            end,
            marker.position,
            marker.scale,
            '/markers/ground.png',
            [marker.color[0], marker.color[1], marker.color[2], alpha],
        );

        this.renderMarkerRing(marker, 10);
    }

    private static distanceToMarker(position: Vector3, marker: Marker): number {
        const markerPos = marker.position;
        const length = position.subtract(markerPos).length();
        return length;
    }
}