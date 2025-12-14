import MarkerType from '../Models/MarkerType';
import MarkerService from '../Services/MarkerService';
import MarkerHitType from '../Models/MarkerHitType';
import SharedConfig from '@shared/SharedConfig';
import { generateGuid } from '@shared/Hash';

export interface SerializedMarker {
	id: string;
	position: Vector3;
	color: RGBA;
	scale: [number, number, number];
	type: MarkerType;
	dimension: number;
	icon: string;
	upperText: string;
	lowerText: string;
	renderDistance: number;
}

export default class Marker {
	private positionValue: Vector3 = new mp.Vector3(0, 0, 0);
	private colorValue: RGBA = [255, 255, 255, 255];
	private colorLighterCache: Map<number, RGBA> = new Map();
	public id: string = generateGuid();
	private scaleValue: [number, number, number] = [0, 0, 0];
	private typeValue: MarkerType = MarkerType.Cylinder;
	private dimensionValue: number = 0;
	private renderDistanceValue: number = SharedConfig.MarkerRenderDistance;
	private iconValue: string = 'cart';
	private upperTextValue: string = 'Marker';
	private lowerTextValue: string = '';
	public colShape: ColshapeMp = null!;
	public resyncToPlayers = false;
	public insideMarker: Set<PlayerMp> = new Set();

	constructor(position: Vector3, color: RGBA, scale: number | [number, number] | [number, number, number], type: MarkerType = MarkerType.Cylinder, dimension: number = 0, hitDistance?: number) {
		hitDistance = hitDistance || (Array.isArray(scale) ? scale[0] : scale);

		this.position = position;
		this.color = color;
		this.scale = scale;
		this.type = type;
		this.dimension = dimension;
		this.createColshape();
	}

	public _handleHit(hitType: MarkerHitType, player: PlayerMp) {
		if (hitType === MarkerHitType.Enter) {
			this.insideMarker.add(player);
		} else {
			this.insideMarker.delete(player);
		}
	}

	public get color(): RGBA {
		return [...this.colorValue];
	}

	public set color(value: RGBA) {
		this.colorValue = [...value];
		this.colorLighterCache.clear();
		this.resyncToPlayers = true;
	}

	public get position(): Vector3 {
		return this.positionValue;
	}

	public set position(value: Vector3) {
		this.positionValue = value;
		this.createColshape();
		this.resyncToPlayers = true;
	}

	public get scale(): number | [number, number, number] {
        if (this.typeValue === MarkerType.Box) {
            return this.scaleValue;
        }

        return this.scaleValue[0];
	}

	public set scale(value: number | [number, number] | [number, number, number]) {
		this.scaleValue = Array.isArray(value) ? (
            value.length === 2 ? [value[0], value[1], 0] : value
        ) : [value, value, 0];
		this.createColshape();
		this.resyncToPlayers = true;
	}

	public get type(): MarkerType {
		return this.typeValue;
	}

	public set type(value: MarkerType) {
		this.typeValue = value;
		this.resyncToPlayers = true;
	}

	public get dimension(): number {
		return this.dimensionValue;
	}

	public set dimension(value: number) {
		this.dimensionValue = value;
		this.createColshape();
		this.resyncToPlayers = true;
	}

	public get renderDistance(): number {
		return this.renderDistanceValue;
	}

	public set renderDistance(value: number) {
		this.renderDistanceValue = value;
		this.resyncToPlayers = true;
	}

	public get icon(): string {
		return this.iconValue;
	}

	public set icon(value: string) {
		this.iconValue = value;
		this.resyncToPlayers = true;
	}

	public get upperText(): string {
		return this.upperTextValue;
	}

	public set upperText(value: string) {
		this.upperTextValue = value;
		this.resyncToPlayers = true;
	}

	public get lowerText(): string {
		return this.lowerTextValue;
	}

	public set lowerText(value: string) {
		this.lowerTextValue = value;
		this.resyncToPlayers = true;
	}

	public getLighterColor(factor: number): RGBA {
		if (this.colorLighterCache.has(factor)) {
			return this.colorLighterCache.get(factor)!;
		}

		const lighterColor: RGBA = [
			Math.min(255, Math.floor(this.color[0] + (255 - this.color[0]) * factor)),
			Math.min(255, Math.floor(this.color[1] + (255 - this.color[1]) * factor)),
			Math.min(255, Math.floor(this.color[2] + (255 - this.color[2]) * factor)),
			this.color[3]
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

	private createColshape() {
		if (this.colShape) {
			this.colShape.destroy();
		}

		this.colShape = mp.colshapes.newSphere(this.position.x, this.position.y, this.position.z, this.scaleValue[0] / 2, this.dimension);
	}

	public serialize(): SerializedMarker {
		return {
			id: this.id,
			position: this.position,
			color: this.color,
			scale: this.scaleValue,
			type: this.type,
			dimension: this.dimension,
			icon: this.icon,
			upperText: this.upperText,
			lowerText: this.lowerText,
			renderDistance: this.renderDistance
		};
	}
}
