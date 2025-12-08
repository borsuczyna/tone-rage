import { CustomEventHandler } from "src/Hooks/RageEventProvider";
import { defaultTextureDictionary, type MarkerTextureRequest, type TextureData, type TextureRequest, type TextureUnloadRequest } from "@shared/Models/TextureData";
import { triggerEvent } from "src/Hooks/Fetch";
import SharedConfig from "@shared/SharedConfig";
import { generateGuid } from "@shared/Hash";

export default class TextureService {
    private static async waitForImageToLoad(htmlImageElement: HTMLImageElement): Promise<void> {
        return new Promise((resolve, reject) => {
            htmlImageElement.onload = () => resolve();
            htmlImageElement.onerror = (caughtError) => reject(caughtError);
        })
    }

    public static async createMarkerTexture(icon: string, upperText: string, lowerText: string): Promise<CanvasRenderingContext2D | null> {
        const canvas = document.createElement('canvas');
        canvas.width = SharedConfig.MarkerTextureSize;
        canvas.height = SharedConfig.MarkerTextureSize;
        const context = canvas.getContext('2d');
        if (!context) return null;
        
        // Make background transparent
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw icon
        const iconImage = new Image();
        iconImage.crossOrigin = 'anonymous';
        iconImage.src = icon;
        await this.waitForImageToLoad(iconImage);
        const iconSize = canvas.width * 0.4;

        context.drawImage(iconImage, (canvas.width - iconSize) / 2, (canvas.height - iconSize) / 2 - canvas.height * (lowerText.length > 0 ? 0.13 : 0.07), iconSize, iconSize);

        // Draw upper text
        context.font = 'bold 5rem Poppins, Arial, sans-serif';
        
        const drawText = (text: string, x: number, y: number, bold: boolean, size: string) => {
            context.font = `${bold ? 'bold ' : ''}${size} Poppins, Arial, sans-serif`;
            context.textAlign = 'center';
            context.fillStyle = 'rgba(0, 0, 0, 0.7)';
            context.fillText(text, x + 4, y + 4);

            context.fillStyle = 'white';
            context.fillText(text, x, y);
        }

        if (lowerText.length > 0) {
            drawText(upperText, canvas.width / 2, canvas.height * 0.75, true, '5rem');
            drawText(lowerText, canvas.width / 2, canvas.height * 0.87, false, '4rem');
        } else {
            drawText(upperText, canvas.width / 2, canvas.height * 0.8, true, '5rem');
        }

        return context;
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
            const textureName = generateGuid();

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
            } as TextureData);
        } catch (loadError) {
            console.error('Image loading failed', loadError);
        }
    }

    public static init() {
        CustomEventHandler.registerEventHandler('textureService:requestTextureData', this.onTextureDataRequest.bind(this));
        CustomEventHandler.registerEventHandler('textureService:requestMarkerTexture', this.onMarkerTextureRequest.bind(this));
        CustomEventHandler.registerEventHandler('textureService:unloadTextureData', this.onTextureDataUnloadRequest.bind(this));
    }

    private static async onTextureDataRequest(data: TextureRequest) {
        await this.sendTextureData(data);
    }

    private static async onMarkerTextureRequest(data: MarkerTextureRequest) {
        const context = await this.createMarkerTexture(data.icon, data.upperText, data.lowerText);
        if (!context) return;

        const textureWidth = context.canvas.width;
        const textureHeight = context.canvas.height;
        const textureName = generateGuid();

        await fetch('http://game-textures/put', {
            method: 'POST',
            body: context.getImageData(0, 0, textureWidth, textureHeight).data,
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
            url: '',
            key: data.key,
            width: textureWidth,
            height: textureHeight
        } as TextureData);
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