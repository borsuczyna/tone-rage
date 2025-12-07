const ENCODE_KEY = 73;

// Encode string to UTF-8 bytes
function utf8Encode(str: string): number[] {
	const bytes: number[] = [];
	for (let i = 0; i < str.length; i++) {
		let code = str.charCodeAt(i);
		if (code < 0x80) {
			bytes.push(code);
		} else if (code < 0x800) {
			bytes.push(0xc0 | (code >> 6));
			bytes.push(0x80 | (code & 0x3f));
		} else if (code >= 0xd800 && code <= 0xdfff) {
			// surrogate pair
			i++;
			const code2 = str.charCodeAt(i);
			const fullCode = 0x10000 + (((code & 0x3ff) << 10) | (code2 & 0x3ff));
			bytes.push(0xf0 | (fullCode >> 18));
			bytes.push(0x80 | ((fullCode >> 12) & 0x3f));
			bytes.push(0x80 | ((fullCode >> 6) & 0x3f));
			bytes.push(0x80 | (fullCode & 0x3f));
		} else {
			bytes.push(0xe0 | (code >> 12));
			bytes.push(0x80 | ((code >> 6) & 0x3f));
			bytes.push(0x80 | (code & 0x3f));
		}
	}
	return bytes;
}

// Decode UTF-8 bytes to string
function utf8Decode(bytes: number[]): string {
	let str = '';
	for (let i = 0; i < bytes.length; ) {
		const b1 = bytes[i++];
		if (b1 < 0x80) {
			str += String.fromCharCode(b1);
		} else if (b1 < 0xe0) {
			const b2 = bytes[i++];
			str += String.fromCharCode(((b1 & 0x1f) << 6) | (b2 & 0x3f));
		} else if (b1 < 0xf0) {
			const b2 = bytes[i++];
			const b3 = bytes[i++];
			str += String.fromCharCode(((b1 & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f));
		} else {
			const b2 = bytes[i++];
			const b3 = bytes[i++];
			const b4 = bytes[i++];
			let codepoint = ((b1 & 0x07) << 18) | ((b2 & 0x3f) << 12) | ((b3 & 0x3f) << 6) | (b4 & 0x3f);
			codepoint -= 0x10000;
			str += String.fromCharCode(0xd800 + ((codepoint >> 10) & 0x3ff), 0xdc00 + (codepoint & 0x3ff));
		}
	}
	return str;
}

// Convert bytes to hex string
function bytesToHex(bytes: number[]): string {
	return bytes.map((b) => (b ^ ENCODE_KEY).toString(16).padStart(2, '0')).join('');
}

// Convert hex string to bytes
function hexToBytes(hex: string): number[] {
	const bytes: number[] = [];
	for (let i = 0; i < hex.length; i += 2) {
		bytes.push(parseInt(hex.substr(i, 2), 16) ^ ENCODE_KEY);
	}
	return bytes;
}

// Encode data
export function encodeData(data: any): string {
	const json = JSON.stringify(data);
	const bytes = utf8Encode(json);
	return bytesToHex(bytes);
}

export function fixBrokenUnicode(str: string) {
	// remove lone high/low surrogates
	return str.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');
}

// Decode data
export function decodeData<T>(encodedData: string): T {
	const bytes = hexToBytes(encodedData);
	const json = utf8Decode(bytes);
	return JSON.parse(fixBrokenUnicode(json)) as T;
}
