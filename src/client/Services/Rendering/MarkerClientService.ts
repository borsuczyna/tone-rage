import TimerService from '@shared/Services/TimerService';
import DrawingService from './DrawingService';
import MarkerService from '@shared-rage/Services/MarkerService';
import Marker, { SerializedMarker } from '@shared-rage/Entities/Marker';
import EventService from '../Infrastructure/EventService';
import MarkerType from '@shared-rage/Models/MarkerType';
import { getPointFromDistanceRotation } from '@shared-rage/PositionHelper';

type DrawPlane3DParams = Parameters<typeof DrawingService.drawPlane3D>;

interface DrawPlane3DParamsCache {
	params: DrawPlane3DParams[];
	lastUsed: number;
}

export default class MarkerClientService {
	private static gameplayCamera: CameraMp | null = null;
	private static renderQueue: DrawPlane3DParams[] = [];
	private static sidesCache: Map<string, DrawPlane3DParamsCache> = new Map();
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

    private static renderMarkerBox(marker: Marker) {
        const boxData: DrawPlane3DParams[] = this.getSidesFromCache(marker) || [];
		const timeSinceLastFrame = Date.now() - this.lastFrameTime;

		if (boxData.length > 0) {
			const newBoxData = boxData.map((params) => {
				params[5] = marker.color;

				const uv = params[9];
				if (!uv) return params;

				const uvAnimationSpeed = (0.08 * timeSinceLastFrame) / 1000;
				uv[1] += uvAnimationSpeed % 10;
				uv[3] += uvAnimationSpeed % 10;

				return params;
			});

			this.renderQueue.push(...newBoxData);
			return;
		}

        const alpha = Math.floor(155 + (100 * (Math.sin(Date.now() / 500) + 1)) / 2);
        const scale = marker.scale as [number, number, number];
        const halfWidth = scale[0] / 2;
        const halfDepth = scale[1] / 2;
        const rotation = scale[2] - 90;
        const zPos = marker.position.z;
        const uvScale = [scale[0] / 3, scale[1] / 3];
        const markerCenter = new mp.Vector3(marker.position.x, marker.position.y, zPos);

        const frontFaceCenter = getPointFromDistanceRotation(markerCenter, halfDepth, rotation);
        const backFaceCenter = getPointFromDistanceRotation(markerCenter, halfDepth, rotation + 180);
        const rightFaceCenter = getPointFromDistanceRotation(markerCenter, halfWidth, rotation + 90);
        const leftFaceCenter = getPointFromDistanceRotation(markerCenter, halfWidth, rotation + 270);

        const sides = [
            // Front face
            {
                from: getPointFromDistanceRotation(leftFaceCenter, halfDepth, rotation),
                to: getPointFromDistanceRotation(rightFaceCenter, halfDepth, rotation),
                faceTowards: getPointFromDistanceRotation(frontFaceCenter, 1, rotation),
                uv: [0, uvScale[0]]
            },
            // Right face
            {
                from: getPointFromDistanceRotation(frontFaceCenter, halfWidth, rotation + 90),
                to: getPointFromDistanceRotation(backFaceCenter, halfWidth, rotation + 90),
                faceTowards: getPointFromDistanceRotation(rightFaceCenter, 1, rotation + 90),
                uv: [uvScale[0], uvScale[0] + uvScale[1]]
            },
            // Back face
            {
                from: getPointFromDistanceRotation(rightFaceCenter, halfDepth, rotation + 180),
                to: getPointFromDistanceRotation(leftFaceCenter, halfDepth, rotation + 180),
                faceTowards: getPointFromDistanceRotation(backFaceCenter, 1, rotation + 180),
                uv: [uvScale[0] + uvScale[1], uvScale[0] * 2 + uvScale[1]]
            },
            // Left face
            {
                from: getPointFromDistanceRotation(backFaceCenter, halfWidth, rotation + 270),
                to: getPointFromDistanceRotation(frontFaceCenter, halfWidth, rotation + 270),
                faceTowards: getPointFromDistanceRotation(leftFaceCenter, 1, rotation + 270),
                uv: [uvScale[0] * 2 + uvScale[1], uvScale[0] * 2 + uvScale[1] * 2]
            },
        ];

        for (let side of sides) {
            boxData.push([
                side.from,
                side.to,
                side.faceTowards,
                0.5,
                '/markers/texture.png',
                [marker.color[0], marker.color[1], marker.color[2], alpha],
                true, 256, 256,
                [0, side.uv[0], 1, side.uv[1]]
            ]);
        }

        this.sidesCache.set(this.getSidesCacheKey(marker), { params: boxData, lastUsed: Date.now() });
        this.renderQueue.push(...boxData);
    }

	private static renderMarkerRing(marker: Marker, sides: number = 12) {
		const ringData: DrawPlane3DParams[] = this.getSidesFromCache(marker, sides) || [];
		const timeSinceLastFrame = Date.now() - this.lastFrameTime;

		if (ringData.length > 0) {
			const newRingData = ringData.map((params) => {
				params[5] = marker.color;

				const uv = params[9];
				if (!uv) return params;

				const uvAnimationSpeed = (0.08 * timeSinceLastFrame) / 1000;
				uv[1] += uvAnimationSpeed % 10;
				uv[3] += uvAnimationSpeed % 10;

				return params;
			});

			this.renderQueue.push(...newRingData);
			return;
		}

		const position = new mp.Vector3(marker.position.x, marker.position.y, marker.position.z - 0.6);
		const step = (2 * Math.PI) / sides;
		const halfStep = step / 2;
        const scale = marker.scale as number;
		const uvStep = scale / sides;
		let lastPoint: Vector3 | null = null;

		for (let angle = 0; angle <= 2 * Math.PI; angle += step) {
			const uv = (angle / (2 * Math.PI)) * scale;
			const point = new mp.Vector3(
				position.x + (scale / 2) * Math.cos(angle),
				position.y + (scale / 2) * Math.sin(angle),
				position.z
			);

			if (lastPoint) {
				const faceTowards = new mp.Vector3(
					position.x + (scale / 2) * Math.cos(angle - halfStep),
					position.y + (scale / 2) * Math.sin(angle - halfStep),
					position.z
				);

				ringData.push([
                    lastPoint,
                    point,
                    faceTowards,
                    0.5,
                    '/markers/texture.png',
                    marker.color,
                    true,
                    256,
                    256,
                    [0, uv, 1, uv + uvStep]
                ]);
			}

			lastPoint = point;
		}

		this.sidesCache.set(this.getSidesCacheKey(marker, sides), { params: ringData, lastUsed: Date.now() });
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
        const scale = marker.scale as number;
		const start = new mp.Vector3(marker.position.x + scale / 2, marker.position.y, marker.position.z - 1);
		const end = new mp.Vector3(marker.position.x - scale / 2, marker.position.y, marker.position.z - 1);

		this.renderQueue.push([
			start,
			end,
			marker.position,
			scale,
			'/markers/ground.png',
			[marker.color[0], marker.color[1], marker.color[2], alpha]
		]);

        if (marker.type === MarkerType.Cylinder) {
            this.renderMarkerRing(marker, 10);
        } else if(marker.type === MarkerType.Box) {
            this.renderMarkerBox(marker);
        }

		this.renderMarkerDisplayText(marker);
		this.flushRenderQueue();
	}

	private static distanceToMarker(position: Vector3, marker: Marker): number {
		const markerPos = marker.position;
		const length = position.subtract(markerPos).length();
		return length;
	}

	private static getSidesCacheKey(marker: Marker, sides?: number): string {
		return `${marker.position.x},${marker.position.y},${marker.position.z},${marker.scale},${marker.color.join(',')},${sides}`;
	}

	private static getSidesFromCache(marker: Marker, sides?: number): DrawPlane3DParams[] | null {
		const key = this.getSidesCacheKey(marker, sides);
		const cached = this.sidesCache.get(key);
		if (cached) {
			cached.lastUsed = Date.now();
			return cached.params;
		}

		return null;
	}

	private static flushOldRingCache() {
		const now = Date.now();
		for (let [key, cached] of this.sidesCache) {
			if (now - cached.lastUsed > 1000) {
				this.sidesCache.delete(key);
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
