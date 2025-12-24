const pakCache = new Map();
const urlCache = new Map();
async function loadPak(pakUrl) {
    if (pakCache.has(pakUrl))
        return pakCache.get(pakUrl);
    const buf = await fetch(pakUrl).then(r => r.arrayBuffer());
    const view = new DataView(buf);
    let ptr = 0;
    const count = view.getUint32(ptr, true);
    ptr += 4;
    const files = {};
    for (let i = 0; i < count; i++) {
        const nameLen = view.getUint16(ptr, true);
        ptr += 2;
        const name = new TextDecoder().decode(new Uint8Array(buf, ptr, nameLen));
        ptr += nameLen;
        const offset = view.getUint32(ptr, true);
        ptr += 4;
        const size = view.getUint32(ptr, true);
        ptr += 4;
        files[name] = { offset, size };
    }
    const pak = { buf, files };
    pakCache.set(pakUrl, pak);
    return pak;
}
export function pakImage(pakUrl, fileName) {
    const key = pakUrl + "::" + fileName;
    if (urlCache.has(key))
        return urlCache.get(key);
    loadPak(pakUrl).then(pak => {
        const f = pak.files[fileName];
        if (!f)
            return;
        const slice = pak.buf.slice(f.offset, f.offset + f.size);
        const blob = new Blob([slice]);
        const url = URL.createObjectURL(blob);
        urlCache.set(key, url);
    });
    return "";
}
