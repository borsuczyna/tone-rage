import { MarkerTextureRequest, NametagTextureRequest, TextureData, TextureRequest, TextureUnloadRequest } from '@shared/Models/TextureData';
import InterfaceService from '../Infrastructure/InterfaceService';
import EventService from '../Infrastructure/EventService';
import Logger from '@shared/Logger';
import SharedConfig from '@shared/SharedConfig';
import TimerService from '@shared/Services/TimerService';
import ElementDataService from '../Infrastructure/ElementDataService';
import EmblemaService from '@shared-rage/Services/EmblemaService';
import { AdminLevel, adminLevelColors, adminLevels } from '@shared/Models/AdminLevel';

export default class DrawingService {
	private static logger: Logger = Logger.getLogger(DrawingService);
	private static textureDictionary: Map<string, TextureData> = new Map();
	private static textureLoadQueue: Set<string> = new Set();
	private static _debug = SharedConfig.MaterialLineDebug;

	public static init() {
		mp.events.add('render', this.render.bind(this));
		EventService.registerEventHandler('textureService:onTextureDataReady', this.onTextureDataReady.bind(this));
		TimerService.setTimer(this.cleanupUnusedTextures.bind(this), SharedConfig.MaterialLineTextureCleanupIntervalMs, 0);
	}

	private static getTextureKey(image: string, textureWidth: number, textureHeight: number): string {
		return `${image}_${textureWidth}x${textureHeight}`;
	}

	public static isTextureLoaded(image: string | TextureData, textureWidth: number = 1024, textureHeight: number = 1024): boolean {
		if (typeof image !== 'string') {
			return this.textureDictionary.has(image.key);
		}

		const key = this.getTextureKey(image, textureWidth, textureHeight);
		const loaded = this.textureDictionary.has(key);

		if (loaded) {
			this.markTextureUsed(image, textureWidth, textureHeight);
		}

		return loaded;
	}

	private static loadTexture(image: string, textureWidth: number = 1024, textureHeight: number = 1024) {
		const key = this.getTextureKey(image, textureWidth, textureHeight);
		if (this.textureLoadQueue.has(key)) {
			return;
		}

		InterfaceService.callInterfaceEvent('textureService:requestTextureData', {
			url: image,
			key: key,
			width: textureWidth,
			height: textureHeight
		} as TextureRequest);

		this.textureLoadQueue.add(key);
		this.logger.info(`Requested texture load: ${key}`);
	}

	private static getMarkerTextureKey(icon: string, upperText: string, lowerText: string): string {
		return `marker_${icon}_${upperText}_${lowerText}`;
	}

	private static loadMarkerTexture(icon: string, upperText: string, lowerText: string) {
		const key = this.getMarkerTextureKey(icon, upperText, lowerText);
		if (this.textureLoadQueue.has(key)) {
			return;
		}

		InterfaceService.callInterfaceEvent('textureService:requestMarkerTexture', {
			icon: icon,
			upperText: upperText,
			lowerText: lowerText,
			key: key
		} as MarkerTextureRequest);

		this.textureLoadQueue.add(key);
		this.logger.info(`Requested marker texture load: ${key}`);
	}

    private static getPlayerNametagTextureKey(player: PlayerMp): string {
        const name = player.name;
        const avatar = ElementDataService.get(player, 'avatar');
        const adminLevel = ElementDataService.get(player, 'adminLevel') || 0;
        const emblemas = EmblemaService.getPlayerEmblems(player, adminLevel);

        return `nametag_${name}_${avatar || 'noavatar'}_${emblemas.join(';')}`;
    }

    private static loadPlayerNametagTexture(player: PlayerMp) {
        const key = this.getPlayerNametagTextureKey(player);
        if (this.textureLoadQueue.has(key)) {
            return;
        }

        const name = player.name;
        const avatar = ElementDataService.get(player, 'avatar') || '';
        const adminLevel = (ElementDataService.get(player, 'adminLevel') || 0) as AdminLevel;
        // const adminLevelName = adminLevel != AdminLevel.User ? adminLevels[adminLevel] : undefined;
        // const adminLevelColor = adminLevel != AdminLevel.User ? adminLevelColors[adminLevel] : undefined;
        const adminLevelName = adminLevels[adminLevel];
        const adminLevelColor = adminLevelColors[adminLevel];
        const emblemas = EmblemaService.getPlayerEmblems(player, adminLevel);

        InterfaceService.callInterfaceEvent('textureService:requestPlayerNametagTexture', {
            name: name,
            avatar: avatar,
            emblemas: emblemas,
            key: key,
            adminLevelName: adminLevelName,
            adminLevelColor: adminLevelColor
        } as NametagTextureRequest);

        this.textureLoadQueue.add(key);
        this.logger.info(`Requested player nametag texture load: ${key}`);
    }

	private static unloadTexture(textureData: TextureData) {
		const key = this.getTextureKey(textureData.url, textureData.width, textureData.height);
		if (!this.textureDictionary.has(key)) {
			return;
		}

		InterfaceService.callInterfaceEvent('textureService:unloadTextureData', {
			dictionary: textureData.dictionary,
			name: textureData.name
		} as TextureUnloadRequest);

		this.textureLoadQueue.delete(key);
		this.textureDictionary.delete(key);

		this.logger.info(`Unloading texture: ${key}`);
	}

	public static getTexture(image: string, textureWidth: number = 1024, textureHeight: number = 1024): TextureData | null {
		if (!this.isTextureLoaded(image, textureWidth, textureHeight)) {
			this.loadTexture(image, textureWidth, textureHeight);
			return null;
		}

		const key = this.getTextureKey(image, textureWidth, textureHeight);
		const textureData = this.textureDictionary.get(key) || null;
		return textureData;
	}

	public static getTextureByKey(key: string): TextureData | null {
		const textureData = this.textureDictionary.get(key) || null;
		return textureData;
	}

	public static getMarkerTexture(icon: string, upperText: string, lowerText: string): TextureData | null {
		const key = this.getMarkerTextureKey(icon, upperText, lowerText);
		const textureData = this.textureDictionary.get(key) || null;
		if (!textureData) {
			this.loadMarkerTexture(icon, upperText, lowerText);
			return null;
		}

		return textureData;
	}

    public static getPlayerNametagTexture(player: PlayerMp): TextureData | null {
        const key = this.getPlayerNametagTextureKey(player);
        const textureData = this.textureDictionary.get(key) || null;
        if (!textureData) {
            this.loadPlayerNametagTexture(player);
            return null;
        }

        return textureData;
    }

	private static onTextureDataReady(data: TextureData) {
		data.lastUsed = Date.now();
		this.textureLoadQueue.delete(data.key);
		this.textureDictionary.set(data.key, data);

		this.logger.info(`Texture loaded and ready: ${data.key}`);
	}

	private static markTextureUsed(image: string, textureWidth: number = 1024, textureHeight: number = 1024) {
		const key = this.getTextureKey(image, textureWidth, textureHeight);
		const textureData = this.textureDictionary.get(key);
		if (textureData) {
			textureData.lastUsed = Date.now();
		}
	}

	private static cleanupUnusedTextures(maxAgeMs: number = SharedConfig.MaterialLineTextureMaxAgeMs) {
		const now = Date.now();
		for (const [key, textureData] of this.textureDictionary.entries()) {
			if (textureData.lastUsed && now - textureData.lastUsed > maxAgeMs) {
				this.unloadTexture(textureData);
				this.textureDictionary.delete(key);
			}
		}
	}

	public static drawQuad3D(
		bottomLeft: Vector3,
		bottomRight: Vector3,
		topRight: Vector3,
		topLeft: Vector3,
		image: string | TextureData,
		colors: [number, number, number, number] = [255, 255, 255, 255],
		textureWidth: number = 1024,
		textureHeight: number = 1024,
		uv: [number, number, number, number] = [0, 0, 1, 1]
	) {
		if (typeof image === 'string' && !this.isTextureLoaded(image, textureWidth, textureHeight)) {
			this.loadTexture(image, textureWidth, textureHeight);
			return;
		}

		const key = typeof image === 'string' ? this.getTextureKey(image, textureWidth, textureHeight) : image.key;
		const textureData = this.textureDictionary.get(key);
		if (!textureData) {
			this.logger.error(`Texture data not found for key: ${key} but was expected to be loaded.`);
			return;
		}

		mp.game.graphics.drawSpritePoly(
			bottomLeft.x,
			bottomLeft.y,
			bottomLeft.z,
			bottomRight.x,
			bottomRight.y,
			bottomRight.z,
			topLeft.x,
			topLeft.y,
			topLeft.z,
			colors[0],
			colors[1],
			colors[2],
			colors[3],
			`crtxd_${textureData.dictionary}`,
			textureData.name,
			uv[0],
			uv[1],
			1, // bottomLeft UV
			uv[2],
			uv[1],
			1, // bottomRight UV
			uv[0],
			uv[3],
			1 // topLeft UV
		);

		mp.game.graphics.drawSpritePoly(
			topLeft.x,
			topLeft.y,
			topLeft.z,
			bottomRight.x,
			bottomRight.y,
			bottomRight.z,
			topRight.x,
			topRight.y,
			topRight.z,
			colors[0],
			colors[1],
			colors[2],
			colors[3],
			`crtxd_${textureData.dictionary}`,
			textureData.name,
			uv[0],
			uv[3],
			1, // topLeft UV
			uv[2],
			uv[1],
			1, // bottomRight UV
			uv[2],
			uv[3],
			1 // topRight UV
		);

		if (this._debug) DrawingService.highlightPolyEdges(bottomLeft, bottomRight, topLeft, topRight);
	}

	public static drawPlane3D(
		start: Vector3,
		end: Vector3,
		faceTowards: Vector3,
		width: number,
		image: string | TextureData,
		colors: [number, number, number, number] = [255, 255, 255, 255],
		doubleSided = false,
		textureWidth = 1024,
		textureHeight = 1024,
		uv: [number, number, number, number] = [0, 0, 1, 1]
	) {
		const { bottomLeft, bottomRight, topRight, topLeft } = DrawingService.getQuad(start, end, width, faceTowards);

		DrawingService.drawQuad3D(bottomLeft, bottomRight, topRight, topLeft, image, colors, textureWidth, textureHeight, [
			uv[2],
			uv[1],
			uv[0],
			uv[3]
		]);

		if (doubleSided) {
			DrawingService.drawQuad3D(bottomRight, bottomLeft, topLeft, topRight, image, colors, textureWidth, textureHeight, uv);
		}

		if (this._debug) {
			const startTop = new mp.Vector3(start.x, start.y, start.z + 1.5);
			const endTop = new mp.Vector3(end.x, end.y, end.z + 1.5);
			DrawingService.drawLine3D(start, startTop, [0, 255, 0, 255]);
			DrawingService.drawLine3D(end, endTop, [0, 0, 255, 255]);
		}
	}

    public static getScreenResolution(): { width: number; height: number } {
        const screenRes = mp.game.graphics.getScreenActiveResolution(0, 0);
        return { width: screenRes.x, height: screenRes.y };
    }

    public static getScreenFromWorldPosition(worldPos: Vector3): { x: number; y: number } | null {
        const screenPos = mp.game.graphics.world3dToScreen2d(worldPos);
        if (!screenPos.x) {
            return null;
        }

        const screenResolution = this.getScreenResolution();
        return {
            x: screenPos.x * screenResolution.width,
            y: screenPos.y * screenResolution.height
        };
    }

    public static getWorldFromScreenPosition(screenX: number, screenY: number, depth: number = 1): Vector3 | null {
        const worldPos = mp.game.graphics.screen2dToWorld3d(new mp.Vector3(screenX, screenY, depth));
        if (!worldPos) {
            return null;
        }

        return new mp.Vector3(worldPos.x, worldPos.y, worldPos.z);
    }

    public static drawSprite(x: number, y: number, width: number, height: number, image: string | TextureData, textureWidth = 1024, textureHeight = 1024, color: [number, number, number, number] = [255, 255, 255, 255]) {
        if (typeof image === 'string' && !this.isTextureLoaded(image, textureWidth, textureHeight)) {
			this.loadTexture(image, textureWidth, textureHeight);
			return;
		}

		const key = typeof image === 'string' ? this.getTextureKey(image, textureWidth, textureHeight) : image.key;
		const textureData = this.textureDictionary.get(key);
		if (!textureData) {
			this.logger.error(`Texture data not found for key: ${key} but was expected to be loaded.`);
			return;
		}

        const screenResolution = this.getScreenResolution();
        x = x / screenResolution.width;
        y = y / screenResolution.height;
        width = width / screenResolution.width;
        height = height / screenResolution.height;
        
        mp.game.graphics.drawSprite(
            `crtxd_${textureData.dictionary}`,
            textureData.name,
            x + width / 2,
            y + height / 2,
            width,
            height,
            0,
            color[0],
            color[1],
            color[2],
            color[3],
            false
        );
    }

	public static drawLine3D(start: Vector3, end: Vector3, color: [number, number, number, number] = [255, 0, 0, 255]) {
		mp.game.graphics.drawLine(start.x, start.y, start.z, end.x, end.y, end.z, color[0], color[1], color[2], color[3]);
	}

    public static drawLine2D(x1: number, y1: number, x2: number, y2: number, color: [number, number, number, number] = [255, 0, 0, 255]) {
        const worldPos1 = this.getWorldFromScreenPosition(x1, y1, 100);
        const worldPos2 = this.getWorldFromScreenPosition(x2, y2, 100);
        if (!worldPos1 || !worldPos2) {
            return;
        }

        this.drawLine3D(worldPos1, worldPos2, color);
    }

	private static render() {
		return; // disable debug drawing for now

		const ppos = mp.players.local.position;

		const time = Date.now() / 1000;
		let a = new mp.Vector3(ppos.x, ppos.y - 1, ppos.z - 1);
		let b = new mp.Vector3(ppos.x, ppos.y - 1, ppos.z + 1);
		let rot = Math.sin(time) * Math.PI;
		let c = new mp.Vector3(ppos.x + Math.cos(rot), ppos.y - 1 + Math.sin(rot), ppos.z + Math.sin(rot));
		const width = 2;

		DrawingService.drawPlane3D(a, b, c, width, '/markers/texture.png', [255, 255, 255, 255], true, 1024, 1024, [0, 0, 0.5, 1]);

		// draw debug lines
		DrawingService.drawLine3D(new mp.Vector3(ppos.x, ppos.y - 1, ppos.z), c, [0, 255, 0, 255]);
		DrawingService.drawLine3D(a, b, [255, 0, 0, 255]);

		a = new mp.Vector3(ppos.x, ppos.y - 1, ppos.z - 0);
		b = new mp.Vector3(ppos.x, ppos.y + 1, ppos.z - 0);
		c = new mp.Vector3(ppos.x, ppos.y, ppos.z + 1);

		DrawingService.drawPlane3D(a, b, c, width, '/markers/debug.png', [255, 255, 255, 255], true, 1024, 1024, [0, 0, 1, 1]);

		a = new mp.Vector3(ppos.x + 3, ppos.y - 1, ppos.z - 0);
		b = new mp.Vector3(ppos.x + 3, ppos.y + 1, ppos.z - 0);
		c = new mp.Vector3(ppos.x + 3, ppos.y, ppos.z + 1);
		DrawingService.drawPlane3D(a, b, c, width, '/markers/debug.png', [255, 255, 255, 255], true, 1024, 1024, [
			0,
			Math.abs(Math.sin(Date.now() / 1000)) * 0.5,
			1,
			1
		]);

		// draw debug lines
		DrawingService.drawLine3D(new mp.Vector3(ppos.x, ppos.y, ppos.z - 1), c, [0, 255, 0, 255]);
		DrawingService.drawLine3D(a, b, [255, 0, 0, 255]);
	}

	public static getQuad(start: Vector3, end: Vector3, width: number, faceTowards: Vector3) {
		const center = new mp.Vector3((start.x + end.x) * 0.5, (start.y + end.y) * 0.5, (start.z + end.z) * 0.5);

		const heightVec = new mp.Vector3(end.x - start.x, end.y - start.y, end.z - start.z);
		const height = Math.sqrt(heightVec.x ** 2 + heightVec.y ** 2 + heightVec.z ** 2);

		let h = this.norm(heightVec);

		let f = new mp.Vector3(faceTowards.x - center.x, faceTowards.y - center.y, faceTowards.z - center.z);
		f = this.norm(f);

		let r = this.cross(h, f);
		if (Math.abs(r.x) < 0.0001 && Math.abs(r.y) < 0.0001 && Math.abs(r.z) < 0.0001) {
			r = this.cross(h, new mp.Vector3(1, 0, 0));
		}
		r = this.norm(r);
		f = this.norm(this.cross(r, h));

		const halfW = width * 0.5;

		const bottomLeft = new mp.Vector3(
			center.x - r.x * halfW - h.x * (height / 2),
			center.y - r.y * halfW - h.y * (height / 2),
			center.z - r.z * halfW - h.z * (height / 2)
		);

		const bottomRight = new mp.Vector3(
			center.x + r.x * halfW - h.x * (height / 2),
			center.y + r.y * halfW - h.y * (height / 2),
			center.z + r.z * halfW - h.z * (height / 2)
		);

		const topLeft = new mp.Vector3(bottomLeft.x + h.x * height, bottomLeft.y + h.y * height, bottomLeft.z + h.z * height);

		const topRight = new mp.Vector3(bottomRight.x + h.x * height, bottomRight.y + h.y * height, bottomRight.z + h.z * height);

		return { bottomLeft, bottomRight, topRight, topLeft };
	}

	public static highlightPolyEdges(bottomLeft: Vector3, bottomRight: Vector3, topLeft: Vector3, topRight: Vector3) {
		const r = 255,
			g = 0,
			b = 0,
			a = 255;

		mp.game.graphics.drawLine(bottomLeft.x, bottomLeft.y, bottomLeft.z, bottomRight.x, bottomRight.y, bottomRight.z, r, g, b, a);

		mp.game.graphics.drawLine(bottomRight.x, bottomRight.y, bottomRight.z, topRight.x, topRight.y, topRight.z, r, g, b, a);

		mp.game.graphics.drawLine(topRight.x, topRight.y, topRight.z, topLeft.x, topLeft.y, topLeft.z, r, g, b, a);

		mp.game.graphics.drawLine(topLeft.x, topLeft.y, topLeft.z, bottomLeft.x, bottomLeft.y, bottomLeft.z, r, g, b, a);
	}

	private static norm(v: Vector3) {
		const l = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
		if (l === 0) return new mp.Vector3(0, 0, 0);
		return new mp.Vector3(v.x / l, v.y / l, v.z / l);
	}

	private static cross(a: Vector3, b: Vector3) {
		return new mp.Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
	}
}
