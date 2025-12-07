import Marker from '../Entities/Marker';
import MarkerType from '../Models/MarkerType';
import MarkerEvent from '../Models/MarkerEvent';
import MarkerHitType from '../Models/MarkerHitType';
import isClientSide from '../isClientSide';

export default class MarkerService {
	public static markers: Set<Marker> = new Set();
	private static events: Set<MarkerEvent> = new Set();

	public static init() {
		mp.events.add('playerEnterColshape', this.onColshapeEnter.bind(this));
		mp.events.add('playerExitColshape', this.onColshapeExit.bind(this));
	}

	public static getMarkerById(id: string): Marker | null {
		return Array.from(this.markers).find((marker) => marker.id === id) || null;
	}

	public static onColshapeEnter(player: PlayerMp, colshape: ColshapeMp) {
		if (isClientSide) {
			colshape = player as any; // On client side, colshape is the first parameter
			player = mp.players.local;
		}

		const marker = Array.from(MarkerService.markers).find((m) => m.colShape === colshape);
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

		const marker = Array.from(MarkerService.markers).find((m) => m.colShape === colshape);
		if (marker) {
			marker._handleHit(MarkerHitType.Exit, player);
			this._handleMarkerHit(marker, MarkerHitType.Exit, player);
		}
	}

	public static createMarker(
		position: Vector3,
		color: RGBA,
		scale: number,
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
}
