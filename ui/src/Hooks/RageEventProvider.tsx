import { useEffect, useRef } from "react";

export function useRageEvent(eventName: string, callback: (...args: any[]) => void) {
    const savedCallback = useRef(callback);
    const mounted = useRef(true);

    // keep callback updated
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (typeof mp === "undefined" || !mp?.events) {
            console.warn("mp.events is not available");
            return;
        }

        mounted.current = true;

        const handler = (...args: any[]) => {
            if (!mounted.current) return; // ignore if unmounted
            savedCallback.current(...args);
        };

        mp.events.add(eventName, handler);

        return () => {
            mounted.current = false; // mark unmounted
            mp.events.remove(eventName, handler);
        };
    }, [eventName]);
}