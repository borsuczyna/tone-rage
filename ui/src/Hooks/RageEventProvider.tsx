import { useEffect } from "react";

/**
 * Hook that registers a RAGE:MP client event and cleans it up automatically.
 * @param eventName The name of the event to listen for.
 * @param callback The callback to run when the event fires.
 */
export function useRageEvent(eventName: string, callback: (...args: any[]) => void) {
    useEffect(() => {
        if (typeof mp === "undefined" || !mp?.events) {
            console.warn("mp.events is not available — are you running inside RAGE:MP client?");
            return;
        }

        mp.events.add(eventName, callback);

        return () => {
            mp.events.remove(eventName, callback);
        };
    }, [eventName, callback]);
}
