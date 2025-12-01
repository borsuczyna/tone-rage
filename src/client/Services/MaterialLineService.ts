// import KeyboardService, { KeyState } from "./KeyboardService";

import { TextureData, TextureRequest, TextureUnloadRequest } from "@shared/Models/TextureData";
import InterfaceService from "./InterfaceService";
import EventService from "./EventService";
import Logger from "@shared/Logger";
import SharedConfig from "@shared/SharedConfig";
import TimerService from "@shared/Services/TimerService";

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

    public static isTextureLoaded(image: string, textureWidth: number = 1024, textureHeight: number = 1024): boolean {
        const key = this.getTextureKey(image, textureWidth, textureHeight);
        const loaded = this.textureDictionary.has(key);

        if (loaded) {
            this.markTextureUsed(image, textureWidth, textureHeight);
        }

        return loaded;
    }

    public static loadTexture(image: string, textureWidth: number = 1024, textureHeight: number = 1024) {
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

        if (this._debug) {
            this.logger.info(`Requested texture load: ${key}`);
        }
    }

    public static unloadTexture(textureData: TextureData) {
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

        if (this._debug) {
            this.logger.info(`Unloading texture: ${key}`);
        }
    }

    private static onTextureDataReady(data: TextureData) {
        const key = this.getTextureKey(data.url, data.width, data.height);
        data.lastUsed = Date.now();
        this.textureDictionary.set(key, data);
        this.textureLoadQueue.delete(key);

        if (this._debug) {
            this.logger.info(`Texture loaded and ready: ${key}`);
        }
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
            if (textureData.lastUsed && (now - textureData.lastUsed) > maxAgeMs) {
                this.unloadTexture(textureData);
                this.textureDictionary.delete(key);
            }
        }
    }

    public static drawQuad3D(bottomLeft: Vector3, bottomRight: Vector3, topRight: Vector3, topLeft: Vector3, image: string, textureWidth: number = 1024, textureHeight: number = 1024) {
        if (!this.isTextureLoaded(image, textureWidth, textureHeight)) {
            this.loadTexture(image, textureWidth, textureHeight);
            return;
        }

        const key = this.getTextureKey(image, textureWidth, textureHeight);
        const textureData = this.textureDictionary.get(key);
        if (!textureData) {
            this.logger.error(`Texture data not found for key: ${key} but was expected to be loaded.`);
            return;
        }

        mp.game.graphics.drawSpritePoly(
            bottomLeft.x, bottomLeft.y, bottomLeft.z,
            bottomRight.x, bottomRight.y, bottomRight.z,
            topLeft.x, topLeft.y, topLeft.z,
            255, 255, 255, 255,
            `crtxd_${textureData.dictionary}`, textureData.name,
            0, 1, 1, 1, 1, 1,
            0, 0, 1
        );

        mp.game.graphics.drawSpritePoly(
            topLeft.x, topLeft.y, topLeft.z,
            bottomRight.x, bottomRight.y, bottomRight.z,
            topRight.x, topRight.y, topRight.z,
            255, 255, 255, 255,
            `crtxd_${textureData.dictionary}`, textureData.name,
            0, 0, 1, 1, 1, 1,
            1, 0, 1
        );

        if (this._debug)
            DrawingService.highlightPolyEdges(bottomLeft, bottomRight, topLeft, topRight);
    }

    public static drawPlane3D(start: Vector3, end: Vector3, faceTowards: Vector3, width: number, image: string, doubleSided = false, textureWidth = 1024, textureHeight = 1024) {
        const { bottomLeft, bottomRight, topRight, topLeft } = DrawingService.getQuad(start, end, width, faceTowards);

        DrawingService.drawQuad3D(
            bottomLeft, bottomRight, topRight, topLeft,
            image, textureWidth, textureHeight
        );

        if (doubleSided) {
            DrawingService.drawQuad3D(
                bottomRight, bottomLeft, topLeft, topRight,
                image, textureWidth, textureHeight
            );
        }
    }

    public static drawLine3D(start: Vector3, end: Vector3, color: [number, number, number, number] = [255, 0, 0, 255]) {
        mp.game.graphics.drawLine(
            start.x, start.y, start.z,
            end.x, end.y, end.z,
            color[0], color[1], color[2], color[3]
        );
    }

    private static render() {
        const ppos = mp.players.local.position;
      
        const time = Date.now() / 1000;
        let a = new mp.Vector3(ppos.x, ppos.y - 1, ppos.z - 1);
        let b = new mp.Vector3(ppos.x, ppos.y - 1, ppos.z + 1);
        let rot = Math.sin(time) * Math.PI;
        let c = new mp.Vector3(
            ppos.x + Math.cos(rot),
            ppos.y - 1 + Math.sin(rot),
            ppos.z + Math.sin(rot)
        );
        const width = Math.sin(time) + 2;

        DrawingService.drawPlane3D(a, b, c, width, 'https://i1.sndcdn.com/artworks-zkZZmAZ468yGcABD-6Juq9g-t500x500.jpg', true, 1024, 1024);

        // draw debug lines
        DrawingService.drawLine3D(new mp.Vector3(ppos.x, ppos.y - 1, ppos.z), c, [0, 255, 0, 255]);
        DrawingService.drawLine3D(a, b, [255, 0, 0, 255]);

        a = new mp.Vector3(ppos.x, ppos.y - 1, ppos.z - 0);
        b = new mp.Vector3(ppos.x, ppos.y + 1, ppos.z - 0);
        c = new mp.Vector3(
            ppos.x,
            ppos.y,
            ppos.z + 1
        );

        DrawingService.drawPlane3D(a, b, c, width, 'https://i1.sndcdn.com/artworks-zkZZmAZ468yGcABD-6Juq9g-t500x500.jpg', true, 1024, 1024);

        // draw debug lines
        DrawingService.drawLine3D(new mp.Vector3(ppos.x, ppos.y, ppos.z - 1), c, [0, 255, 0, 255]);
        DrawingService.drawLine3D(a, b, [255, 0, 0, 255]);
    }

    public static getQuad(start: Vector3, end: Vector3, width: number, faceTowards: Vector3) {
        const center = new mp.Vector3(
            (start.x + end.x) * 0.5,
            (start.y + end.y) * 0.5,
            (start.z + end.z) * 0.5
        );

        const heightVec = new mp.Vector3(
            end.x - start.x,
            end.y - start.y,
            end.z - start.z
        );
        const height = Math.sqrt(heightVec.x**2 + heightVec.y**2 + heightVec.z**2);

        let h = this.norm(heightVec);

        let f = new mp.Vector3(
            faceTowards.x - center.x,
            faceTowards.y - center.y,
            faceTowards.z - center.z
        );
        f = this.norm(f);

        let r = this.cross(h, f);
        if (Math.abs(r.x) < 0.0001 && Math.abs(r.y) < 0.0001 && Math.abs(r.z) < 0.0001) {
            r = this.cross(h, new mp.Vector3(1,0,0));
        }
        r = this.norm(r);
        f = this.norm(this.cross(r, h));

        const halfW = width * 0.5;

        const bottomLeft = new mp.Vector3(
            center.x - r.x*halfW - h.x*(height/2),
            center.y - r.y*halfW - h.y*(height/2),
            center.z - r.z*halfW - h.z*(height/2)
        );

        const bottomRight = new mp.Vector3(
            center.x + r.x*halfW - h.x*(height/2),
            center.y + r.y*halfW - h.y*(height/2),
            center.z + r.z*halfW - h.z*(height/2)
        );

        const topLeft = new mp.Vector3(
            bottomLeft.x + h.x*height,
            bottomLeft.y + h.y*height,
            bottomLeft.z + h.z*height
        );

        const topRight = new mp.Vector3(
            bottomRight.x + h.x*height,
            bottomRight.y + h.y*height,
            bottomRight.z + h.z*height
        );

        return { bottomLeft, bottomRight, topRight, topLeft };
    }

    public static highlightPolyEdges(bottomLeft: Vector3, bottomRight: Vector3, topLeft: Vector3, topRight: Vector3) {
        const r = 255, g = 0, b = 0, a = 255;

        mp.game.graphics.drawLine(
            bottomLeft.x, bottomLeft.y, bottomLeft.z,
            bottomRight.x, bottomRight.y, bottomRight.z,
            r, g, b, a
        );

        mp.game.graphics.drawLine(
            bottomRight.x, bottomRight.y, bottomRight.z,
            topRight.x, topRight.y, topRight.z,
            r, g, b, a
        );

        mp.game.graphics.drawLine(
            topRight.x, topRight.y, topRight.z,
            topLeft.x, topLeft.y, topLeft.z,
            r, g, b, a
        );

        mp.game.graphics.drawLine(
            topLeft.x, topLeft.y, topLeft.z,
            bottomLeft.x, bottomLeft.y, bottomLeft.z,
            r, g, b, a
        );
    }

    private static norm(v: Vector3) {
        const l = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
        if (l === 0) return new mp.Vector3(0,0,0);
        return new mp.Vector3(v.x/l, v.y/l, v.z/l);
    }

    private static cross(a: Vector3, b: Vector3) {
        return new mp.Vector3(
            a.y*b.z - a.z*b.y,
            a.z*b.x - a.x*b.z,
            a.x*b.y - a.y*b.x
        );
    }
}