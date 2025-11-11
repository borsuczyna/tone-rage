import { useEffect, useRef } from "react";
import { ChunkAssembler, type DataChunk } from '@shared/ChunkingUtils';

export class ChunkAssemblerHandler {
    private static chunkAssembler: ChunkAssembler = new ChunkAssembler();

    public static init() {
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
        this.eventHandlers.push({ eventName, callback });
        mp.events.add(eventName, callback);
    }

    public static removeEventHandler(eventName: string, callback: (data: any) => void) {
        this.eventHandlers = this.eventHandlers.filter(
            (handler) => handler.eventName !== eventName || handler.callback !== callback
        );
        mp.events.remove(eventName, callback);
    }

    public static triggerEvent(eventName: string, data: any) {
        const handler = this.eventHandlers.find(h => h.eventName === eventName);
        if (handler) {
            handler.callback(data);
        }
    }
}

export function useRageEvent(eventName: string, callback: (data: any) => void) {
    const savedCallback = useRef(callback);
    const mounted = useRef(true);

    // keep callback updated
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        mounted.current = true;

        const handler = (data: any) => {
            if (!mounted.current) return; // ignore if unmounted
            savedCallback.current(data);
        };

        CustomEventHandler.registerEventHandler(eventName, handler);

        return () => {
            mounted.current = false; // mark unmounted
            CustomEventHandler.removeEventHandler(eventName, handler);
        };
    }, [eventName]);
}
