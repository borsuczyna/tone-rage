import TimerService from '@shared/Services/TimerService';
import DrawingService from './DrawingService';
import MarkerService from '@shared-rage/Services/MarkerService';
import Marker, { SerializedMarker } from '@shared-rage/Entities/Marker';
import EventService from '../Infrastructure/EventService';

type DrawPlane3DParams = Parameters<typeof DrawingService.drawPlane3D>;

interface DrawPlane3DParamsCache {
	params: DrawPlane3DParams[];
	lastUsed: number;
}

export default class MarkerClientService {
	private static gameplayCamera: CameraMp | null = null;
	private static renderQueue: DrawPlane3DParams[] = [];
	private static ringCache: Map<string, DrawPlane3DParamsCache> = new Map();
	private static lastFrameTime: number = Date.now();

	public static init() {
		mp.events.add('render', this.render.bind(this));
		this.gameplayCamera = mp.cameras.new('gameplay');
		TimerService.setTimer(this.flushOldRingCache.bind(this), 1000);
		EventService.registerEventHandler('MarkerService:ReceiveMarkers', this.onReceiveMarkers.bind(this));
	}

	public static render() {
		const position = mp.players.local.position;
		const markersInRange = Array.from(MarkerService.markers)
			.filter((marker) => {
				const dist = this.distanceToMarker(position, marker);
				return dist <= (marker.renderDistance || 50);
			})
			.map((marker) => ({
				marker,
				distance: this.distanceToMarker(position, marker)
			}))
			.sort((a, b) => a.distance - b.distance);

		for (let { marker } of markersInRange) {
			this.renderMarker(marker);
		}

		this.lastFrameTime = Date.now();
	}

	private static renderMarkerRing(marker: Marker, sides: number = 12) {
		const ringData: DrawPlane3DParams[] = this.getRingFromCache(marker, sides) || [];
		const timeSinceLastFrame = Date.now() - this.lastFrameTime;

		if (ringData.length > 0) {
			const newRingData = ringData.map((params) => {
				params[5] = marker.color;

				const uv = params[9];
				if (!uv) return params;

				uv[1] += ((0.08 * timeSinceLastFrame) / 1000) % 10;
				uv[3] += ((0.08 * timeSinceLastFrame) / 1000) % 10;

				return params;
			});

			this.renderQueue.push(...newRingData);
			return;
		}

		const position = new mp.Vector3(marker.position.x, marker.position.y, marker.position.z - 0.6);
		const step = (2 * Math.PI) / sides;
		const halfStep = step / 2;
		const uvStep = 1 / sides;
		let lastPoint: Vector3 | null = null;

		for (let angle = 0; angle <= 2 * Math.PI; angle += step) {
			const uv = angle / (2 * Math.PI);
			const point = new mp.Vector3(
				position.x + (marker.scale / 2) * Math.cos(angle),
				position.y + (marker.scale / 2) * Math.sin(angle),
				position.z
			);

			if (lastPoint) {
				const faceTowards = new mp.Vector3(
					position.x + (marker.scale / 2) * Math.cos(angle - halfStep),
					position.y + (marker.scale / 2) * Math.sin(angle - halfStep),
					position.z
				);

				ringData.push([lastPoint, point, faceTowards, 0.5, '/markers/texture.png', marker.color, true, 256, 256, [0, uv, 1, uv + uvStep]]);
			}

			lastPoint = point;
		}

		this.ringCache.set(this.getRingCacheKey(marker, sides), { params: ringData, lastUsed: Date.now() });
		this.renderQueue.push(...ringData);
	}

	private static renderMarkerDisplayText(marker: Marker) {
		const markerTexture = DrawingService.getMarkerTexture(`/markers/icons/${marker.icon}.png`, marker.upperText, marker.lowerText);
		if (!markerTexture) {
			return;
		}

		const floatHeight = Math.sin(Date.now() / 500) * 0.05;
		const startPoint = new mp.Vector3(marker.position.x, marker.position.y, marker.position.z + 0.5 + floatHeight);
		const endPoint = new mp.Vector3(marker.position.x, marker.position.y, marker.position.z - 0.5 + floatHeight);
		const camPos = this.gameplayCamera ? this.gameplayCamera.getCoord() : mp.players.local.position;

		this.renderQueue.push([startPoint, endPoint, camPos, 1.0, markerTexture, [255, 255, 255, 255], true]);
	}

	private static flushRenderQueue() {
		// sort by distance to camera
		const camPos = this.gameplayCamera ? this.gameplayCamera.getCoord() : mp.players.local.position;

		const sortedQueue = [];
		for (let params of this.renderQueue) {
			const midPoint = new mp.Vector3((params[0].x + params[1].x) / 2, (params[0].y + params[1].y) / 2, (params[0].z + params[1].z) / 2);
			const dist = camPos.subtract(midPoint).length();
			sortedQueue.push({ dist, params });
		}

		sortedQueue.sort((a, b) => b.dist - a.dist);

		// draw all
		for (let { params } of sortedQueue) {
			DrawingService.drawPlane3D(...params);
		}

		this.renderQueue = [];
	}

	private static renderMarker(marker: Marker) {
		const alpha = Math.floor(155 + (100 * (Math.sin(Date.now() / 500) + 1)) / 2);
		const start = new mp.Vector3(marker.position.x + marker.scale / 2, marker.position.y, marker.position.z - 1);
		const end = new mp.Vector3(marker.position.x - marker.scale / 2, marker.position.y, marker.position.z - 1);

		this.renderQueue.push([
			start,
			end,
			marker.position,
			marker.scale,
			'/markers/ground.png',
			[marker.color[0], marker.color[1], marker.color[2], alpha]
		]);

		this.renderMarkerRing(marker, 10);
		this.renderMarkerDisplayText(marker);
		this.flushRenderQueue();
	}

	private static distanceToMarker(position: Vector3, marker: Marker): number {
		const markerPos = marker.position;
		const length = position.subtract(markerPos).length();
		return length;
	}

	private static getRingCacheKey(marker: Marker, sides: number): string {
		return `${marker.position.x},${marker.position.y},${marker.position.z},${marker.scale},${marker.color.join(',')},${sides}`;
	}

	private static getRingFromCache(marker: Marker, sides: number): DrawPlane3DParams[] | null {
		const key = this.getRingCacheKey(marker, sides);
		const cached = this.ringCache.get(key);
		if (cached) {
			cached.lastUsed = Date.now();
			return cached.params;
		}

		return null;
	}

	private static flushOldRingCache() {
		const now = Date.now();
		for (let [key, cached] of this.ringCache) {
			if (now - cached.lastUsed > 1000) {
				this.ringCache.delete(key);
			}
		}
	}

	private static onReceiveMarkers(serializedMarkers: SerializedMarker[]) {
		for (let serialized of serializedMarkers) {
			let marker = MarkerService.getMarkerById(serialized.id);
			if (!marker) {
				marker = new Marker(serialized.position, serialized.color, serialized.scale, serialized.type, serialized.dimension);

				marker.id = serialized.id;
				MarkerService.markers.add(marker);
			}

			marker.position = serialized.position;
			marker.color = serialized.color;
			marker.scale = serialized.scale;
			marker.type = serialized.type;
			marker.dimension = serialized.dimension;
			marker.icon = serialized.icon;
			marker.upperText = serialized.upperText;
			marker.lowerText = serialized.lowerText;
			marker.renderDistance = serialized.renderDistance;
		}
	}
}
