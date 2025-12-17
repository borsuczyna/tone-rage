import { useEffect, useState } from "react";

type PakEntry = {
    offset: number;
    size: number;
};

type PakFile = {
    buf: ArrayBuffer;
    files: Record<string, PakEntry>;
};

const pakCache = new Map<string, PakFile>();
const pakPromises = new Map<string, Promise<PakFile>>(); // important

function loadPakXHR(url: string): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";

        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 0) {
                resolve(xhr.response);
            } else {
                reject(new Error("XHR failed"));
            }
        };

        xhr.onerror = reject;
        xhr.send();
    });
}

async function loadPak(pakUrl: string): Promise<PakFile> {
    const cached = pakCache.get(pakUrl);
    if (cached) return cached;

    const pending = pakPromises.get(pakUrl);
    if (pending) return pending;

    const promise = (async () => {
        const buf = await loadPakXHR(pakUrl);
        const view = new DataView(buf);

        let ptr = 0;
        const count = view.getUint32(ptr, true);
        ptr += 4;

        const files: Record<string, PakEntry> = {};

        for (let i = 0; i < count; i++) {
            const nameLen = view.getUint16(ptr, true);
            ptr += 2;

            const name = new TextDecoder().decode(
                new Uint8Array(buf, ptr, nameLen)
            );
            ptr += nameLen;

            const offset = view.getUint32(ptr, true);
            ptr += 4;

            const size = view.getUint32(ptr, true);
            ptr += 4;

            files[name] = { offset, size };
        }

        const pak: PakFile = { buf, files };
        pakCache.set(pakUrl, pak);
        pakPromises.delete(pakUrl);
        return pak;
    })();

    pakPromises.set(pakUrl, promise);
    return promise;
}

type PakImageProps = {
    pak: string;
    name: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export function PakImage({ pak, name, ...props }: PakImageProps) {
    const [src, setSrc] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;

        loadPak(pak).then(p => {
            const f = p.files[name];
            if (!f || !alive) return;

            const blob = new Blob([
                p.buf.slice(f.offset, f.offset + f.size)
            ]);

            setSrc(URL.createObjectURL(blob));
        });

        return () => {
            alive = false;
        };
    }, [pak, name]);

    if (!src) return null;
    return <img src={src} {...props} />;
}