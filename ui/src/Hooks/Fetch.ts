import { generateHash } from "@shared/Hash";
import { SERVER_HMAC_KEY } from "../config";

interface FetchResolver {
    resolve: (data: any) => void;
    reject: (error: any) => void;
    timeoutId?: number;
}

interface ResponseEnvelope {
    payload: any;
    signature: string;
}

const pendingFetches: Record<string, FetchResolver> = {};
const FETCH_TIMEOUT_MS = 10000; // 10 seconds

async function fetchData<T>(eventName: string, data: any, client: boolean = false): Promise<T> {
    const hash = generateHash(eventName);

    mp.trigger('interface:fetchData', eventName, hash, client, JSON.stringify(data));

    return new Promise<T>((resolve, reject) => {
        // Set up timeout to reject stale promises
        const timeoutId = window.setTimeout(() => {
            if (pendingFetches[hash]) {
                delete pendingFetches[hash];
                reject(new Error(`Fetch request timed out after ${FETCH_TIMEOUT_MS}ms: ${eventName}`));
            }
        }, FETCH_TIMEOUT_MS);

        pendingFetches[hash] = { resolve, reject, timeoutId };
    });
}

export async function fetchClientData<T>(eventName: string, data: any): Promise<T> {
    return fetchData<T>(eventName, data, true);
}

export async function fetchServerData<T>(eventName: string, data: any): Promise<T> {
    return fetchData<T>(eventName, data, false);
}

let isResolverRegistered = false;

export function registerFetchResolver() {
    if (typeof mp === "undefined" || !mp?.events) {
        console.warn("mp.events is not available");
        return;
    }
    
    // Register only once to avoid duplicate event handlers
    if (isResolverRegistered) {
        return;
    }
    
    mp.events.add('interface:fetchResponse', onFetchResponse);
    isResolverRegistered = true;
}

/**
 * Verify HMAC-SHA256 signature for the response
 * @param hash - The request hash
 * @param payload - The response payload (as string)
 * @param signature - The HMAC signature to verify
 * @returns true if signature is valid
 */
async function verifySignature(hash: string, payload: string, signature: string): Promise<boolean> {
    try {
        const message = hash + ':' + payload;
        const encoder = new TextEncoder();
        const keyData = encoder.encode(SERVER_HMAC_KEY);
        const messageData = encoder.encode(message);

        // Import the key for HMAC
        const key = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign', 'verify']
        );

        // Convert hex signature to ArrayBuffer
        const signatureBytes = new Uint8Array(signature.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

        // Verify the signature
        return await crypto.subtle.verify(
            'HMAC',
            key,
            signatureBytes,
            messageData
        );
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
}

function onFetchResponse(hash: string, responseAsJson: string) {
    const fetchResolver = pendingFetches[hash];
    
    if (fetchResolver) {
        // Clear the timeout
        if (fetchResolver.timeoutId) {
            clearTimeout(fetchResolver.timeoutId);
        }

        // Try to parse as envelope first
        try {
            const parsed = JSON.parse(responseAsJson);
            
            // Check if response has envelope structure { payload, signature }
            if (parsed && typeof parsed === 'object' && 'payload' in parsed && 'signature' in parsed) {
                const envelope = parsed as ResponseEnvelope;
                const payloadStr = JSON.stringify(envelope.payload);
                
                // Verify signature asynchronously
                verifySignature(hash, payloadStr, envelope.signature).then(isValid => {
                    if (isValid) {
                        fetchResolver.resolve(envelope.payload);
                    } else {
                        console.error(`Signature verification failed for fetch response: hash=${hash}`);
                        fetchResolver.reject(new Error('Response signature verification failed'));
                    }
                    delete pendingFetches[hash];
                }).catch(error => {
                    console.error('Error during signature verification:', error);
                    fetchResolver.reject(error);
                    delete pendingFetches[hash];
                });
            } else {
                // Old-style response without envelope (backwards compatibility)
                console.warn(`Received unsigned response for hash=${hash}. Consider upgrading server to send signed responses.`);
                fetchResolver.resolve(parsed);
                delete pendingFetches[hash];
            }
        } catch (error) {
            console.error('Failed to parse fetch response:', error);
            fetchResolver.reject(error);
            delete pendingFetches[hash];
        }
    }
}