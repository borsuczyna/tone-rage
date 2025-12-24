import * as Icons from "lucide-vue-next";
import { h } from "vue";
import { renderToString } from "@vue/server-renderer";

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
        
        const promise = this.waitForImageToLoad(image);
        image.src = src;
        await promise;
        
        return image;
    }

    /**
     * Draws text with optional shadow
     */
    public static drawText(
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        font: string,
        color: string,
        textAlign?: TextAlign,
        textBaseline?: TextBaseline,
        shadow?: TextShadow
    ): void {
        ctx.save();
        
        ctx.font = font;
        ctx.fillStyle = color;
        if (textAlign) ctx.textAlign = textAlign;
        if (textBaseline) ctx.textBaseline = textBaseline;
        
        if (shadow) {
            ctx.shadowOffsetX = shadow.offsetX;
            ctx.shadowOffsetY = shadow.offsetY;
            ctx.shadowColor = shadow.color || 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 4;
        }
        
        ctx.fillText(text, x, y);
        
        ctx.restore();
    }

    /**
     * Draws a lucide icon as SVG
     */
    public static async drawIcon(
        ctx: CanvasRenderingContext2D,
        iconName: string,
        x: number,
        y: number,
        width: number,
        height: number,
        strokeColor: string = '#000000',
        strokeAlpha: number = 1,
        fillColor: string = '#000000',
        fillAlpha: number = 0
    ): Promise<void> {
        const IconComp = (Icons as any)[iconName];
        if (!IconComp) {
            console.warn(`Icon ${iconName} not found`);
            return;
        }

        const strokeRgba = this.hexToRgba(strokeColor, strokeAlpha);
        const fillRgba = this.hexToRgba(fillColor, fillAlpha);

        const stroke = `rgba(${strokeRgba.join(",")})`;
        const fill = `rgba(${fillRgba.join(",")})`;
        const iconSize = Math.max(width, height) * 1.5;

        // render vue icon → svg string with proper sizing
        const vnode = h(IconComp, {
            size: iconSize,
            color: stroke,
            strokeWidth: 2,
            fill: fill !== "rgba(0,0,0,0)" ? fill : "none"
        });

        const svg = await renderToString(vnode);
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

        if (hex.length === 3) {
            // Short form (e.g., #RGB)
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
            // Long form (e.g., #RRGGBB)
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
        }

        return [r, g, b, a];
    }

    /**
     * Measures the width of text
     */
    public static measureText(ctx: CanvasRenderingContext2D, text: string, font: string): number {
        ctx.save();
        ctx.font = font;
        const metrics = ctx.measureText(text);
        ctx.restore();
        return metrics.width;
    }

    /**
     * Draws a rounded rectangle
     */
    public static drawRoundedRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
        fillColor?: string,
        strokeColor?: string,
        strokeWidth: number = 1
    ): void {
        ctx.save();
        
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        
        if (fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
        
        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.stroke();
        }
        
        ctx.restore();
    }
}
