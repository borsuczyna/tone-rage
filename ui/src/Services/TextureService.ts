import { CustomEventHandler } from "src/Hooks/RageEventProvider";
import { defaultTextureDictionary, type MarkerTextureRequest, type NametagTextureRequest, type TextureData, type TextureRequest, type TextureUnloadRequest } from "@shared/Models/TextureData";
import { triggerEvent } from "src/Hooks/Fetch";
import SharedConfig from "@shared/SharedConfig";
import { generateGuid } from "@shared/Hash";
import { emblemasData, type Emblema } from "@shared/Models/Emblema";
import DrawingService, { type TextShadow } from "./DrawingService";

export default class TextureService {

    public static async createMarkerTexture(icon: string, upperText: string, lowerText: string): Promise<CanvasRenderingContext2D | null> {
        const drawingContext = DrawingService.createCanvas(SharedConfig.MarkerTextureSize, SharedConfig.MarkerTextureSize);
        if (!drawingContext) return null;
        
        const { canvas, context } = drawingContext;

        // Draw icon
        const iconImage = await DrawingService.loadImage(icon);
        const iconSize = canvas.width * 0.4;
        const iconX = (canvas.width - iconSize) / 2;
        const iconY = (canvas.height - iconSize) / 2 - canvas.height * (lowerText.length > 0 ? 0.13 : 0.07);

        DrawingService.drawImage(context, iconImage, iconX, iconY, iconSize, iconSize);

        const textShadow: TextShadow = { offsetX: 4, offsetY: 4, color: 'rgba(0, 0, 0, 0.7)' };

        if (lowerText.length > 0) {
            DrawingService.drawText(
                context, upperText, canvas.width / 2, canvas.height * 0.75,
                'center', 'alphabetic', 'Inter, Arial, sans-serif', '5rem', true, 'white', textShadow
            );
            DrawingService.drawText(
                context, lowerText, canvas.width / 2, canvas.height * 0.87,
                'center', 'alphabetic', 'Inter, Arial, sans-serif', '4rem', false, 'white', textShadow
            );
        } else {
            DrawingService.drawText(
                context, upperText, canvas.width / 2, canvas.height * 0.8,
                'center', 'alphabetic', 'Inter, Arial, sans-serif', '5rem', true, 'white', textShadow
            );
        }

        return context;
    }

    public static async createPlayerNametagTexture(username: string, avatarUrl: string, emblemas: Emblema[], adminLevelName?: string, adminLevelColor?: string): Promise<CanvasRenderingContext2D | null> {
        const drawingContext = DrawingService.createCanvas(SharedConfig.PlayerNametagTextureWidth, SharedConfig.PlayerNametagTextureHeight);
        if (!drawingContext) return null;

        const { canvas, context } = drawingContext;

        const usernameWidth = DrawingService.measureText(context, username, 'Inter, Arial, sans-serif', '28px', true).width;
        const avatarWidth = SharedConfig.PlayerNametagTextureHeight - 10;
        const emblemaSize = 20;
        const totalEmblemaWidth = emblemas.length * (emblemaSize + 5);
        const adminLevelWidth = adminLevelName ? DrawingService.measureText(context, adminLevelName, 'Inter, Arial, sans-serif', '24px', true).width : 0;
        const adminLevelWidthWithEmblemas = adminLevelWidth + (emblemas.length > 0 ? totalEmblemaWidth + 10 : 0);
        const totalTextWidth = Math.max(usernameWidth, adminLevelWidthWithEmblemas);
        const totalContentWidth = avatarWidth + 10 + totalTextWidth;

        // let startX = (canvas.width - totalContentWidth - totalEmblemaWidth) / 2;
        let startX = canvas.width / 2 - totalContentWidth / 2;

        // Draw avatar
        try {
            const avatarImage = await DrawingService.loadImage(avatarUrl || SharedConfig.DefaultAvatar);
            const avatarRadius = avatarWidth / 2;
            
            // draw black circle behind avatar for better visibility

            DrawingService.drawCircle(context, startX + avatarRadius, 5 + avatarRadius, avatarRadius + 3, [50, 50, 50, 140]);
            DrawingService.drawCircularImage(context, avatarImage, startX, 5, avatarRadius);
        } catch (loadError) {
            console.error('Avatar image loading failed', loadError);
        }

        startX += avatarWidth + 10;
        const textStartX = startX;

        // Draw username
        const textShadow: TextShadow = { offsetX: 2, offsetY: 2, color: 'rgba(0, 0, 0, 0.7)' };
        DrawingService.drawText(
            context, username, startX, canvas.height / 2,
            'left', 'bottom', 'Inter, Arial, sans-serif', '28px', true, 'white', textShadow
        );

        let emblemaX = textStartX + adminLevelWidth + 10;
        
        if (adminLevelName && adminLevelColor) {
            // Draw admin level above username
            DrawingService.drawText(
                context, adminLevelName, startX, canvas.height / 2 + 4,
                'left', 'top', 'Inter, Arial, sans-serif', '24px', true, adminLevelColor, textShadow
            );
        } else {
            emblemaX = textStartX;
        }

        // Draw emblemas
        const emblemaY = canvas.height / 2 + 4;
        for (const emblema of emblemas) {
            const emblemaData = emblemasData[emblema];
            if (!emblemaData) continue;

            const emblemaColor = DrawingService.hexToRgba(emblemaData.color);
            await DrawingService.drawLucideReactIcon(
                context, emblemaData.icon, emblemaX, emblemaY,
                emblemaSize, emblemaSize, emblemaColor, emblemaColor
            );

            emblemaX += emblemaSize + 5;
        }

        return context;
    }

    private static async sendTextureData(data: TextureRequest) {
        const textureWidth = data.width;
        const textureHeight = data.height;

        const drawingContext = DrawingService.createCanvas(textureWidth, textureHeight);
        if (!drawingContext) return;
        
        const { context } = drawingContext;

        try {
            const sourceImage = await DrawingService.loadImage(data.url);

            DrawingService.drawImage(context, sourceImage, 0, 0, textureWidth, textureHeight);
            const canvasImageData = context.getImageData(0, 0, textureWidth, textureHeight);
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
        CustomEventHandler.registerEventHandler('textureService:requestPlayerNametagTexture', this.onPlayerNametagTextureRequest.bind(this));
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

    private static async onPlayerNametagTextureRequest(data: NametagTextureRequest) {
        const context = await this.createPlayerNametagTexture(data.name, data.avatar, data.emblemas, data.adminLevelName, data.adminLevelColor);
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