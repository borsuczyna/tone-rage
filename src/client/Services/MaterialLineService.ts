// import KeyboardService, { KeyState } from "./KeyboardService";

import { TextureData, TextureRequest } from "@shared/Models/TextureData";
import InterfaceService from "./InterfaceService";
import EventService from "./EventService";
import Logger from "@shared/Logger";

export default class MaterialLineService {
    private static logger: Logger = Logger.getLogger(MaterialLineService);
    private static textureDictionary: Map<string, TextureData> = new Map();
    private static textureLoadQueue: Set<string> = new Set();
    // private static imageList: Array<{
    //     position: Vector3,
    //     forward: Vector3,
    //     width: number,
    //     height: number,
    //     textureDict: string,
    //     textureName: string
    // }> = [];

    public static init() {
        mp.events.add('render', this.render.bind(this));
        EventService.registerEventHandler('textureService:onTextureDataReady', this.onTextureDataReady.bind(this));
        // KeyboardService.registerKeyHandler('J', this.addImage.bind(this));
    }

    private static getTextureKey(image: string, textureWidth: number, textureHeight: number): string {
        return `${image}_${textureWidth}x${textureHeight}`;
    }

    public static isTextureLoaded(image: string, textureWidth: number = 1024, textureHeight: number = 1024): boolean {
        const key = this.getTextureKey(image, textureWidth, textureHeight);
        return this.textureDictionary.has(key);
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

        mp.gui.chat.push(`Requested texture load: ${key}`);
    }

    private static onTextureDataReady(data: TextureData) {
        const key = this.getTextureKey(data.url, data.width, data.height);
        this.textureDictionary.set(key, data);
        this.textureLoadQueue.delete(key);

        mp.gui.chat.push(`Texture loaded and ready: ${key}`);
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

        mp.gui.chat.push(`Drawing plane with texture: crtxd_${textureData.dictionary} / ${textureData.name}`);
    }

    private static render() {
        // const pos = mp.players.local.position;
        // const a = new mp.Vector3(pos.x - 1, pos.y, pos.z - 1);
        // const b = new mp.Vector3(pos.x + 1, pos.y, pos.z - 1);
        // const c = new mp.Vector3(pos.x + 1, pos.y, pos.z + 1);
        // const d = new mp.Vector3(pos.x - 1, pos.y, pos.z + 1);
        const heading = mp.players.local.getHeading() * Math.PI / 180;
        const forward = new mp.Vector3(Math.cos(heading), Math.sin(heading), 0);
        const { bottomLeft, bottomRight, topRight, topLeft } = MaterialLineService.getQuadPoints(
            mp.players.local.position,
            forward,
            2,
            2
        );

        MaterialLineService.drawQuad3D(bottomLeft, bottomRight, topRight, topLeft, 'https://i1.sndcdn.com/artworks-zkZZmAZ468yGcABD-6Juq9g-t500x500.jpg', 1024, 1024);
    }

    // private static addImage(state: KeyState) {
    //     if (state !== KeyState.Down) {
    //         return;
    //     }

    //     const pos = mp.players.local.position;
    //     const heading = mp.players.local.getHeading() * Math.PI / 180;
    //     const forward = new mp.Vector3(Math.cos(heading), Math.sin(heading), 0);

    //     this.imageList.push({
    //         position: pos,
    //         forward: forward,
    //         width: 1,
    //         height: 1,
    //         textureDict: 'crtxd_dict',
    //         textureName: 'name'
    //     });

    //     mp.gui.chat.push(`Added image at position: ${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}`);
    // }

    public static getQuadPoints(position: Vector3, forwardDir: Vector3, width: number, height: number) {
        // norm
        const len = Math.sqrt(forwardDir.x * forwardDir.x + forwardDir.y * forwardDir.y);
        const forward = new mp.Vector3(forwardDir.x / len, forwardDir.y / len, 0);

        // perp
        const right = new mp.Vector3(-forward.y, forward.x, 0);

        // center stays = position
        const center = new mp.Vector3(position.x, position.y, position.z);

        // bottom
        const halfW = width / 2;
        const bottomLeft = new mp.Vector3(
            center.x - right.x * halfW,
            center.y - right.y * halfW,
            center.z - height / 2
        );

        const bottomRight = new mp.Vector3(
            center.x + right.x * halfW,
            center.y + right.y * halfW,
            center.z - height / 2
        );

        // top
        const topLeft = new mp.Vector3(bottomLeft.x, bottomLeft.y, bottomLeft.z + height);
        const topRight = new mp.Vector3(bottomRight.x, bottomRight.y, bottomRight.z + height);

        return { bottomLeft, bottomRight, topLeft, topRight };
    }

    // public static drawPolyQuad(position: Vector3, forwardDir: Vector3, width: number, height: number, textureDict: string, textureName: string) {
    //     const length = Math.sqrt(forwardDir.x * forwardDir.x + forwardDir.y * forwardDir.y);
    //     const forward = new mp.Vector3(
    //         forwardDir.x / length,
    //         forwardDir.y / length,
    //         0
    //     );

    //     const right = new mp.Vector3(
    //         -forward.y,
    //         forward.x,
    //         0
    //     );

    //     const center = new mp.Vector3(
    //         position.x + forward.x * 2,
    //         position.y + forward.y * 2,
    //         position.z
    //     );

    //     const bottomLeft = new mp.Vector3(
    //         center.x + right.x * (-width / 2),
    //         center.y + right.y * (-width / 2),
    //         center.z
    //     );

    //     const bottomRight = new mp.Vector3(
    //         center.x + right.x * (width / 2),
    //         center.y + right.y * (width / 2),
    //         center.z
    //     );

    //     const topLeft = new mp.Vector3(bottomLeft.x, bottomLeft.y, bottomLeft.z + height);
    //     const topRight = new mp.Vector3(bottomRight.x, bottomRight.y, bottomRight.z + height);

    //     if (!mp.game.graphics.hasStreamedTextureDictLoaded(textureDict)) {
    //         mp.game.graphics.requestStreamedTextureDict(textureDict, true);
    //         return { bottomLeft, bottomRight, topLeft, topRight };
    //     }

    //     mp.game.graphics.drawSpritePoly(
    //         bottomLeft.x, bottomLeft.y, bottomLeft.z,
    //         bottomRight.x, bottomRight.y, bottomRight.z,
    //         topLeft.x, topLeft.y, topLeft.z,
    //         255, 255, 255, 255,
    //         textureDict, textureName,
    //         0, 1, 1, 1, 1, 1,
    //         0, 0, 1
    //     );

    //     mp.game.graphics.drawSpritePoly(
    //         topLeft.x, topLeft.y, topLeft.z,
    //         bottomRight.x, bottomRight.y, bottomRight.z,
    //         topRight.x, topRight.y, topRight.z,
    //         255, 255, 255, 255,
    //         textureDict, textureName,
    //         0, 0, 1, 1, 1, 1,
    //         1, 0, 1
    //     );

    //     return { bottomLeft, bottomRight, topLeft, topRight };
    // }

    // public static highlightPolyEdges(bottomLeft: Vector3, bottomRight: Vector3, topLeft: Vector3, topRight: Vector3) {
    //     const r = 255, g = 0, b = 0, a = 255;

    //     mp.game.graphics.drawLine(
    //         bottomLeft.x, bottomLeft.y, bottomLeft.z,
    //         bottomRight.x, bottomRight.y, bottomRight.z,
    //         r, g, b, a
    //     );

    //     mp.game.graphics.drawLine(
    //         bottomRight.x, bottomRight.y, bottomRight.z,
    //         topRight.x, topRight.y, topRight.z,
    //         r, g, b, a
    //     );

    //     mp.game.graphics.drawLine(
    //         topRight.x, topRight.y, topRight.z,
    //         topLeft.x, topLeft.y, topLeft.z,
    //         r, g, b, a
    //     );

    //     mp.game.graphics.drawLine(
    //         topLeft.x, topLeft.y, topLeft.z,
    //         bottomLeft.x, bottomLeft.y, bottomLeft.z,
    //         r, g, b, a
    //     );
    // }

    // public static render() {
    //     this.imageList.forEach(g => {
    //         const corners = this.drawPolyQuad(
    //             g.position,
    //             g.forward,
    //             g.width,
    //             g.height,
    //             g.textureDict,
    //             g.textureName
    //         );

    //         if (corners) {
    //             this.highlightPolyEdges(corners.bottomLeft, corners.bottomRight, corners.topLeft, corners.topRight);
    //         }
    //     });
    // }
}