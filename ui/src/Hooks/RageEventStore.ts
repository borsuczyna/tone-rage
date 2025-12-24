import { onMount } from 'svelte';
import { ChunkAssembler, type DataChunk } from '@shared/ChunkingUtils';

export class ChunkAssemblerHandler {
    private static chunkAssembler: ChunkAssembler = new ChunkAssembler();

    public static init() {
        if (typeof mp === 'undefined') {
            console.warn('mp is undefined, cannot initialize ChunkAssemblerHandler');
            return;
        }

        mp.events.add('event:chunk', this.onChunkReceived.bind(this));
        console.log('ChunkAssemblerHandler initialized');
    }

    private static onChunkReceived(targetEventName: string, chunkData: string) {
        const chunk: DataChunk = JSON.parse(chunkData);
        const completeData = this.chunkAssembler.addChunk(chunk);
        if (completeData) {
            CustomEventHandler.triggerEvent(targetEventName, JSON.parse(completeData));
        }
    }
}

interface EventHandler {
    eventName: string;
    callback: (data: any) => void;
}

export class CustomEventHandler {
    private static eventHandlers: EventHandler[] = [];

    public static registerEventHandler(eventName: string, callback: (data: any) => void) {
        if (typeof mp === 'undefined') {
            console.warn('mp is undefined, cannot register event handler');
            return;
        }
        
        this.eventHandlers.push({ eventName, callback });
        mp.events.add(eventName, callback);
    }

    public static removeEventHandler(eventName: string, callback: (data: any) => void) {
        this.eventHandlers = this.eventHandlers.filter(
            (handler) => handler.eventName !== eventName || handler.callback !== callback
        );

        if (typeof mp === 'undefined') {
            console.warn('mp is undefined, cannot remove event handler');
            return;
        }
        
        mp.events.remove(eventName, callback);
    }

    public static triggerEvent(eventName: string, data: any) {
        const handler = this.eventHandlers.find(h => h.eventName === eventName);
        if (handler) {
            handler.callback(data);
        }
    }
}

// Svelte hook equivalent for useRageEvent
export function useRageEvent(eventName: string, callback: (data: any) => void) {
    let mounted = true;

    onMount(() => {
        mounted = true;

        const handler = (data: any) => {
            if (!mounted) return; // ignore if unmounted
            callback(data);
        };

        CustomEventHandler.registerEventHandler(eventName, handler);

        return () => {
            mounted = false; // mark unmounted
            CustomEventHandler.removeEventHandler(eventName, handler);
        };
    });
}
