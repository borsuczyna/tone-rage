import * as Icons from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

export interface DrawingContext {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
}

export interface TextShadow {
    offsetX: number;
    offsetY: number;
    color?: string;
}

export type TextAlign = 'left' | 'center' | 'right' | 'start' | 'end';
export type TextBaseline = 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';

export default class DrawingService {
    /**
     * Creates a canvas with the specified dimensions
     */
    public static createCanvas(width: number, height: number): DrawingContext | null {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        
        if (!context) return null;
        
        // Make background transparent by default
        context.clearRect(0, 0, width, height);
        
        return { canvas, context };
    }

    /**
     * Waits for an image to load
     */
    public static async waitForImageToLoad(htmlImageElement: HTMLImageElement): Promise<void> {
        return new Promise((resolve, reject) => {
            htmlImageElement.onload = () => resolve();
            htmlImageElement.onerror = (error) => reject(error);
        });
    }

    /**
     * Loads an image from URL
     */
    public static async loadImage(src: string, crossOrigin: string = 'anonymous'): Promise<HTMLImageElement> {
        const image = new Image();
        image.crossOrigin = crossOrigin;
        image.src = src;
        await this.waitForImageToLoad(image);
        return image;
    }

    /**
     * Draws an image on the canvas
     */
    public static drawImage(
        context: CanvasRenderingContext2D,
        image: HTMLImageElement,
        x: number,
        y: number,
        w: number,
        h: number,
        color?: [number, number, number, number]
    ): void {
        if (color) {
            // Apply color filter by drawing with composite operation
            context.save();
            context.globalCompositeOperation = 'source-over';
            context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`;
            context.fillRect(x, y, w, h);
            context.globalCompositeOperation = 'multiply';
            context.drawImage(image, x, y, w, h);
            context.restore();
        } else {
            context.drawImage(image, x, y, w, h);
        }
    }

    public static async drawLucideReactIcon(
        ctx: CanvasRenderingContext2D,
        icon: string,
        x: number,
        y: number,
        width: number,
        height: number,
        strokeRgba: [number, number, number, number],
        fillRgba: [number, number, number, number]
    ) {
        const IconComp = (Icons as any)[icon];
        if (!IconComp) return;

        const stroke = `rgba(${strokeRgba.join(",")})`;
        const fill = `rgba(${fillRgba.join(",")})`;
        const iconSize = Math.max(width, height) * 1.5;

        // render react icon → svg string with proper sizing
        const svg = renderToStaticMarkup(
            <IconComp
                size={iconSize}
                color={stroke}
                strokeWidth={2}
                fill={fill !== "rgba(0,0,0,0)" ? fill : "none"}
            />
        );

        const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

        // load into image then draw
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const i = new Image();
            i.onload = () => resolve(i);
            i.onerror = reject;
            i.src = url;
        });

        ctx.drawImage(img, x, y, width, height);
    }

    public static hexToRgba(hex: string, alpha: number = 1): [number, number, number, number] {
        let r = 0, g = 0, b = 0, a = Math.floor(alpha * 255);

        // First remove the leading #
        if (hex.startsWith('#')) {
            hex = hex.slice(1);
        }

        // Handle 3-digit hex
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        }

        // Handle 6-digit hex
        else if (hex.length === 6) {
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
        }

        return [r, g, b, a];
    }

    /**
     * Draws a circular image (useful for avatars)
     */
    public static drawCircularImage(
        context: CanvasRenderingContext2D,
        image: HTMLImageElement,
        x: number,
        y: number,
        radius: number
    ): void {
        context.save();
        
        // Create circular clipping path
        const centerX = x + radius;
        const centerY = y + radius;
        
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, Math.PI * 2);
        context.clip();
        
        // Draw the image within the circular clip
        context.drawImage(image, x, y, radius * 2, radius * 2);
        
        context.restore();
    }

    /**
     * Measures text dimensions
     */
    public static measureText(
        context: CanvasRenderingContext2D,
        text: string,
        font: string,
        fontSize: string,
        bold: boolean = false
    ): TextMetrics {
        context.font = `${bold ? 'bold ' : ''}${fontSize} ${font}`;
        return context.measureText(text);
    }

    /**
     * Draws text with optional shadow
     */
    public static drawText(
        context: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        alignX: TextAlign = 'left',
        alignY: TextBaseline = 'alphabetic',
        font: string = 'Inter, Arial, sans-serif',
        fontSize: string = '16px',
        bold: boolean = false,
        color: string = 'white',
        shadow: TextShadow | null = null
    ): void {
        // Set font and alignment
        context.font = `${bold ? 'bold ' : ''}${fontSize} ${font}`;
        context.textAlign = alignX;
        context.textBaseline = alignY;

        // Draw shadow if specified
        if (shadow) {
            context.fillStyle = shadow.color || 'rgba(0, 0, 0, 0.7)';
            context.fillText(text, x + shadow.offsetX, y + shadow.offsetY);
        }

        // Draw main text
        context.fillStyle = color;
        context.fillText(text, x, y);
    }

    /**
     * Clears the entire canvas
     */
    public static clearCanvas(context: CanvasRenderingContext2D, width: number, height: number): void {
        context.clearRect(0, 0, width, height);
    }

    /**
     * Draws a rectangle
     */
    public static drawRect(
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        color: [number, number, number, number],
        fill: boolean = true
    ): void {
        context.save();
        const colorStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`;
        
        if (fill) {
            context.fillStyle = colorStyle;
            context.fillRect(x, y, w, h);
        } else {
            context.strokeStyle = colorStyle;
            context.strokeRect(x, y, w, h);
        }
        
        context.restore();
    }

    /**
     * Draws a circle
     */
    public static drawCircle(
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        radius: number,
        color: [number, number, number, number],
        fill: boolean = true
    ): void {
        context.save();
        const colorStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`;
        
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        
        if (fill) {
            context.fillStyle = colorStyle;
            context.fill();
        } else {
            context.strokeStyle = colorStyle;
            context.stroke();
        }
        
        context.restore();
    }
}