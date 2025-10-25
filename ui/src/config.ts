/**
 * Configuration constants for the UI
 * 
 * Note: In production, use proper key distribution mechanisms
 * or asymmetric cryptography instead of shared secrets.
 */

// Read from build-time environment variable or use developer default
const envKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_SERVER_HMAC_KEY as string | undefined;

export const SERVER_HMAC_KEY = envKey || 'dev_secret';
