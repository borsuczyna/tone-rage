import { generateHash } from "@shared/Hash";

interface FetchResolver {
    resolve: (data: any) => void;
    reject: (error: any) => void;
}

const pendingFetches: Record<string, FetchResolver> = {};

async function fetchData<T>(eventName: string, data: any, client: boolean = false): Promise<T> {
    const hash = generateHash(eventName);

    mp.trigger('interface:fetchData', eventName, hash, client, JSON.stringify(data));

    return new Promise<T>((resolve, reject) => {
        pendingFetches[hash] = { resolve, reject };
    });
}

export async function fetchClientData<T>(eventName: string, data: any): Promise<T> {
    return fetchData<T>(eventName, data, true);
}

export async function fetchServerData<T>(eventName: string, data: any): Promise<T> {
    return fetchData<T>(eventName, data, false);
}

export function registerFetchResolver() {
    if (typeof mp === "undefined" || !mp?.events) {
        console.warn("mp.events is not available");
        return;
    }
    
    mp.events.add('interface:fetchResponse', onFetchResponse);
}

function onFetchResponse(hash: string, responseAsJson: string) {
    const fetchResolver = pendingFetches[hash];
    
    if (fetchResolver) {
        const response = JSON.parse(responseAsJson);
        fetchResolver.resolve(response);
        delete pendingFetches[hash];
    }
}