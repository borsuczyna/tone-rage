// Client-side config for verifying server-signed fetch responses.
//
// WARNING: This is a development convenience. For production you should use
// a secure key distribution / asymmetric signatures (public key).
const envKey =
    typeof process !== 'undefined' && process?.env
        ? (process.env.REACT_APP_SERVER_HMAC_KEY || process.env.SERVER_HMAC_KEY)
        : undefined;

export const SERVER_HMAC_KEY = envKey || 'dev_ui_secret';
export default SERVER_HMAC_KEY;
