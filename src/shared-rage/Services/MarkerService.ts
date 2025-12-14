import Marker from '../Entities/Marker';
import MarkerType from '../Models/MarkerType';
import MarkerEvent from '../Models/MarkerEvent';
import MarkerHitType from '../Models/MarkerHitType';
import ColShapeService from './ColShapeService';
import { ColShape, ColShapeHitType } from '../Entities/ColShape/ColShape';

export default class MarkerService {
	public static markers: Set<Marker> = new Set();
	private static events: Set<MarkerEvent> = new Set();

	public static init() {
        ColShapeService.registerHandler(this.onColshapeEnter.bind(this), undefined, ColShapeHitType.Enter);
        ColShapeService.registerHandler(this.onColshapeExit.bind(this), undefined, ColShapeHitType.Exit);
	}

	public static getMarkerById(id: string): Marker | null {
		return Array.from(this.markers).find((marker) => marker.id === id) || null;
	}

	public static onColshapeEnter(entity: EntityMp, colshape: ColShape) {
		const marker = Array.from(MarkerService.markers).find((m) => m.colShape === colshape);
		if (marker) {
			marker._handleHit(MarkerHitType.Enter, entity);
			this._handleMarkerHit(marker, MarkerHitType.Enter, entity);
		}
	}

	public static onColshapeExit(entity: EntityMp, colshape: ColShape) {
		const marker = Array.from(MarkerService.markers).find((m) => m.colShape === colshape);
		if (marker) {
			marker._handleHit(MarkerHitType.Exit, entity);
			this._handleMarkerHit(marker, MarkerHitType.Exit, entity);
		}
	}

	public static createMarker(
		position: Vector3,
		color: RGBA,
		scale: number | [number, number] | [number, number, number],
		type: MarkerType = MarkerType.Cylinder,
		dimension: number = 0,
		hitDistance?: number
	): Marker {
		const marker = new Marker(position, color, scale, type, dimension, hitDistance);
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
			if (event.marker === marker || event.marker === null) {
				event.callback(hitType, entity, marker);
			}
		}
	}
}
