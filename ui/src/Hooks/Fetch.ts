import { generateHash } from "@shared/Hash";
import translate from "@shared/Translation/Translation";

interface FetchResolver {
    resolve: (data: any) => void;
    reject: (error: any) => void;
    timeoutId: number;
}

const pendingFetches: Record<string, FetchResolver> = {};

async function fetchData<T>(eventName: string, data: any, client: boolean = false): Promise<T> {
    const hash = generateHash(eventName);

    if (typeof mp !== "undefined" && mp?.trigger) {
        mp.trigger('interface:fetchData', eventName, hash, client, JSON.stringify(data));
    }

    return new Promise<T>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            delete pendingFetches[hash];
            reject(new Error(translate('fetch.timeout')));
        }, 10000);

        pendingFetches[hash] = { resolve, reject, timeoutId };
    });
}

export async function fetchClientData<T>(eventName: string, data: any): Promise<T> {
    return fetchData<T>(eventName, data, true);
}

export async function fetchServerData<T>(eventName: string, data: any): Promise<T> {
    return fetchData<T>(eventName, data, false);
}

export function triggerEvent(eventName: string, data?: any) {
    if (typeof mp !== "undefined" && mp?.trigger) {
        mp.trigger('interface:triggerEvent', eventName, JSON.stringify(data));
    }
}

export function registerFetchResolver() {
    if (typeof mp === "undefined" || !mp?.events) {
        console.warn("mp.events is not available");
        return;
    }
    
    mp.events.add('interface:fetchResponse', onFetchResponse);
}

function onFetchResponse(dataAsJson: string) {
    const [hash, data] = JSON.parse(dataAsJson);
    const fetchResolver = pendingFetches[hash];
    
    if (fetchResolver) {
        clearTimeout(fetchResolver.timeoutId);
        fetchResolver.resolve(data);
        delete pendingFetches[hash];
    }
}