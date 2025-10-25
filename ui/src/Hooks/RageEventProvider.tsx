import { useEffect, useRef } from "react";

export function useRageEvent(eventName: string, callback: (data: any) => void) {
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

        const handler = (data: string) => {
            if (!mounted.current) return; // ignore if unmounted
            savedCallback.current(JSON.parse(data));
        };

        mp.events.add(eventName, handler);

        return () => {
            mounted.current = false; // mark unmounted
            mp.events.remove(eventName, handler);
        };
    }, [eventName]);
}