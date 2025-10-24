const pattern = 'rrrrxrrr-rrxr-4rrxr-y8rrrr-rrrr71rrrHrx';

function randomChar(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return chars.charAt(Math.floor(Math.random() * chars.length));
}

function simpleEncode(input: string): string {
    return input.replace(/[^a-zA-Z0-9]/g, "");
}

export function generateHash(input: string): string {
    const encoded = simpleEncode(input);
    let hash = '';
    let index = 0;

    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === 'x') {
            hash += encoded[index % encoded.length];
            index++;
        } else if (pattern[i] === 'r') {
            hash += randomChar();
        } else {
            hash += pattern[i];
        }
    }

    return hash;
}

export function validateHash(input: string, hash: string): boolean {
    const encoded = simpleEncode(input);
    let index = 0;

    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === 'x') {
            if (hash[i] !== encoded[index % encoded.length]) {
                return false;
            }
            index++;
        } else if (pattern[i] === 'r') {
            if (!/[A-Za-z0-9]/.test(hash[i])) {
                return false;
            }
        } else {
            if (hash[i] !== pattern[i]) {
                return false;
            }
        }
    }

    return true;
}