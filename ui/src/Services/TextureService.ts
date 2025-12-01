import { CustomEventHandler } from "src/Hooks/RageEventProvider";
import { defaultTextureDictionary, type TextureRequest, type TextureUnloadRequest } from "@shared/Models/TextureData";
import { triggerEvent } from "src/Hooks/Fetch";

export default class TextureService {
    private static async waitForImageToLoad(htmlImageElement: HTMLImageElement): Promise<void> {
        return new Promise((resolve, reject) => {
            htmlImageElement.onload = () => resolve();
            htmlImageElement.onerror = (caughtError) => reject(caughtError);
        })
    }

    private static generateGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private static async sendTextureData(data: TextureRequest) {
        const textureWidth = data.width;
        const textureHeight = data.height;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = textureWidth;
        tempCanvas.height = textureHeight;

        const canvasContext = tempCanvas.getContext('2d');
        if (!canvasContext) return;

        canvasContext.clearRect(0, 0, textureWidth, textureHeight);

        const sourceImage = new Image();
        sourceImage.crossOrigin = 'anonymous';
        sourceImage.src = data.url;
        try {
            await this.waitForImageToLoad(sourceImage);

            canvasContext.drawImage(sourceImage, 0, 0, textureWidth, textureHeight);
            const canvasImageData = canvasContext.getImageData(0, 0, textureWidth, textureHeight);
            const textureName = this.generateGuid();

            await fetch('http://game-textures/put', {
                method: 'POST',
                body: canvasImageData.data,
                headers: {
                    'texture-dict': defaultTextureDictionary,
                    'texture-name': textureName,
                    'texture-width': textureWidth.toString(),
                    'texture-height': textureHeight.toString()
                }
            });

            triggerEvent('textureService:onTextureDataReady', {
                dictionary: defaultTextureDictionary,
                name: textureName,
                url: data.url,
                key: data.key,
                width: textureWidth,
                height: textureHeight
            });
        } catch (loadError) {
            console.error('Image loading failed', loadError);
        }
    }

    public static init() {
        CustomEventHandler.registerEventHandler('textureService:requestTextureData', this.onTextureDataRequest.bind(this));
        CustomEventHandler.registerEventHandler('textureService:unloadTextureData', this.onTextureDataUnloadRequest.bind(this));
    }

    private static async onTextureDataRequest(data: TextureRequest) {
        await this.sendTextureData(data);
    }

    private static async onTextureDataUnloadRequest(data: TextureUnloadRequest) {
        await fetch('http://game-textures/remove', {
            method: 'POST',
            headers: {
                'texture-dict': data.dictionary,
                'texture-name': data.name
            }
        });
    }
}