import { useEffect, useState } from "react";
const pakCache = new Map();
const pakInstances = new Map();
const UNLOAD_AFTER = 60_000; // 1 minute
function scheduleCleanup(pak, pakFile) {
    if (pakFile.cleanupTimer)
        return;
    pakFile.cleanupTimer = window.setTimeout(() => {
        if (pakFile.refCount === 0 && Date.now() - pakFile.lastUsed >= UNLOAD_AFTER) {
            pakCache.delete(pak);
            pakInstances.delete(pak);
        }
        pakFile.cleanupTimer = undefined;
    }, UNLOAD_AFTER);
}
function loadPak(pak) {
    if (pakCache.has(pak))
        return pakCache.get(pak);
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", pak, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => {
            const buffer = xhr.response;
            const view = new DataView(buffer);
            const indexLen = view.getUint32(4, true);
            const indexText = new TextDecoder().decode(buffer.slice(8, 8 + indexLen));
            const pakFile = {
                buffer,
                index: JSON.parse(indexText),
                dataOffset: 8 + indexLen,
                refCount: 0,
                lastUsed: Date.now()
            };
            pakInstances.set(pak, pakFile);
            resolve(pakFile);
        };
        xhr.onerror = reject;
        xhr.send();
    });
    pakCache.set(pak, promise);
    return promise;
}
export default function PakImage({ pak, image, ...imgProps }) {
    const [src, setSrc] = useState(null);
    useEffect(() => {
        let alive = true;
        let blobUrl = null;
        loadPak(pak).then(pakFile => {
            if (!alive)
                return;
            pakFile.refCount++;
            pakFile.lastUsed = Date.now();
            const file = pakFile.index.files[image];
            if (!file)
                return;
            const start = pakFile.dataOffset + file.offset;
            const slice = pakFile.buffer.slice(start, start + file.size);
            blobUrl = URL.createObjectURL(new Blob([slice]));
            setSrc(blobUrl);
        });
        return () => {
            alive = false;
            if (blobUrl)
                URL.revokeObjectURL(blobUrl);
            const pakFile = pakInstances.get(pak);
            if (!pakFile)
                return;
            pakFile.refCount--;
            pakFile.lastUsed = Date.now();
            if (pakFile.refCount === 0) {
                scheduleCleanup(pak, pakFile);
            }
        };
    }, [pak, image]);
    if (!src)
        return null;
    return <img src={src} {...imgProps}/>;
}
