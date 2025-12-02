const pattern = 'rrrrxrrr-rrxr-4rrxr-y8rrrr-rrrr71rrrHrx';

function randomChar(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	return chars.charAt(Math.floor(Math.random() * chars.length));
}

export function generateSalt(): string {
	let salt = '';
	for (let i = 0; i < 32; i++) {
		salt += randomChar();
	}
	return salt;
}

export function generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function simpleEncode(input: string): string {
	return input.replace(/[^a-zA-Z0-9]/g, '');
}

export function generateHash(input: string, salt?: string): string {
	const saltedInput = salt ? `${input}:${salt}` : input;
	const encoded = simpleEncode(saltedInput);
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

export function validateHash(input: string, hash: string, salt?: string): boolean {
	const saltedInput = salt ? `${input}:${salt}` : input;
	const encoded = simpleEncode(saltedInput);
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
