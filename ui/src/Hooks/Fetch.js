import { generateHash } from "@shared/Hash";
import translate from "@shared/Translation/Translation";
import { CustomEventHandler } from "./RageEventStore";
import { chunkData } from "@shared/ChunkingUtils";
import { encodeData } from "@shared/DataEncoder";
const pendingFetches = {};
async function fetchData(eventName, data, client = false) {
    const hash = generateHash(eventName);
    if (typeof mp !== "undefined" && mp?.trigger) {
        mp.trigger('interface:fetchData', eventName, hash, client, JSON.stringify(data));
    }
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            delete pendingFetches[hash];
            reject(new Error(translate('fetch.timeout')));
        }, 10000);
        pendingFetches[hash] = { resolve, reject, timeoutId };
    });
}
export async function fetchClientData(eventName, data) {
    return fetchData(eventName, data, true);
}
export async function fetchServerData(eventName, data) {
    return fetchData(eventName, data, false);
}
export function triggerEvent(eventName, data) {
    if (typeof mp !== "undefined" && mp?.trigger) {
        const encodedData = encodeData([data]);
        // Send in chunks
        const chunks = chunkData(encodedData);
        chunks.forEach((chunk) => {
            mp.trigger('interface:triggerEvent:chunk', eventName, JSON.stringify(chunk));
        });
    }
}
export function registerFetchResolver() {
    if (typeof mp === "undefined" || !mp?.events) {
        console.warn("mp.events is not available");
        return;
    }
    CustomEventHandler.registerEventHandler('interface:fetchResponse', onFetchResponse);
}
function onFetchResponse([hash, data]) {
    const fetchResolver = pendingFetches[hash];
    if (fetchResolver) {
        clearTimeout(fetchResolver.timeoutId);
        fetchResolver.resolve(data);
        delete pendingFetches[hash];
    }
}
