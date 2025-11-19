// import TimerService from '@shared/Services/TimerService';
import Marker from '../Entities/Marker';
import MarkerType from '../Models/MarkerType';
import MarkerEvent from '../Models/MarkerEvent';
import MarkerHitType from '../Models/MarkerHitType';

export default class MarkerService {
    private static markers: Set<Marker> = new Set();
    private static events: Set<MarkerEvent> = new Set();

    public static init() {
        // TimerService.setTimer(this.update.bind(this), 100, 0);
    }

    public static createMarker(position: Vector3, color: RGBA, scale: number, type: MarkerType = MarkerType.Cylinder, dimension: number = 0): Marker {
        const marker = new Marker(position, color, scale, type, dimension);
        this.markers.add(marker);
        return marker;
    }

    public static _destroyInternal(marker: Marker) {
        this.markers.delete(marker);
    }

    public static registerEventHandler(marker: Marker | null, callback: (hitType: MarkerHitType, entity: EntityMp, marker?: Marker) => void) {
        this.events.add({ marker, callback });
    }

    public static unregisterEventHandler(marker: Marker | null, callback: (hitType: MarkerHitType, entity: EntityMp, marker?: Marker) => void) {
        for (let event of this.events) {
            if (event.marker === marker && event.callback === callback) {
                this.events.delete(event);
                break;
            }
        }
    }

    public static _handleMarkerHit(marker: Marker, hitType: MarkerHitType, entity: EntityMp) {
        for (let event of this.events) {
            if (event.marker === marker) {
                event.callback(hitType, entity, marker);
            }
        }
    }
}