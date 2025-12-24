import { useEffect, useRef } from "react";
import { ChunkAssembler } from '@shared/ChunkingUtils';
export class ChunkAssemblerHandler {
    static chunkAssembler = new ChunkAssembler();
    static init() {
        if (typeof mp === 'undefined') {
            console.warn('mp is undefined, cannot initialize ChunkAssemblerHandler');
            return;
        }
        mp.events.add('event:chunk', this.onChunkReceived.bind(this));
        console.log('ChunkAssemblerHandler initialized');
    }
    static onChunkReceived(targetEventName, chunkData) {
        const chunk = JSON.parse(chunkData);
        const completeData = this.chunkAssembler.addChunk(chunk);
        if (completeData) {
            CustomEventHandler.triggerEvent(targetEventName, JSON.parse(completeData));
        }
    }
}
export class CustomEventHandler {
    static eventHandlers = [];
    static registerEventHandler(eventName, callback) {
        if (typeof mp === 'undefined') {
            console.warn('mp is undefined, cannot register event handler');
            return;
        }
        this.eventHandlers.push({ eventName, callback });
        mp.events.add(eventName, callback);
    }
    static removeEventHandler(eventName, callback) {
        this.eventHandlers = this.eventHandlers.filter((handler) => handler.eventName !== eventName || handler.callback !== callback);
        if (typeof mp === 'undefined') {
            console.warn('mp is undefined, cannot remove event handler');
            return;
        }
        mp.events.remove(eventName, callback);
    }
    static triggerEvent(eventName, data) {
        const handler = this.eventHandlers.find(h => h.eventName === eventName);
        if (handler) {
            handler.callback(data);
        }
    }
}
export function useRageEvent(eventName, callback) {
    const savedCallback = useRef(callback);
    const mounted = useRef(true);
    // keep callback updated
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    useEffect(() => {
        mounted.current = true;
        const handler = (data) => {
            if (!mounted.current)
                return; // ignore if unmounted
            savedCallback.current(data);
        };
        CustomEventHandler.registerEventHandler(eventName, handler);
        return () => {
            mounted.current = false; // mark unmounted
            CustomEventHandler.removeEventHandler(eventName, handler);
        };
    }, [eventName]);
}
