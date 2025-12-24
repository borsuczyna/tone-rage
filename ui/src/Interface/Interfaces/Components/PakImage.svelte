<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  type PakIndex = {
      files: Record<string, { offset: number; size: number }>;
  };

  type PakFile = {
      buffer: ArrayBuffer;
      index: PakIndex;
      dataOffset: number;
      refCount: number;
      lastUsed: number;
      cleanupTimer?: number;
  };

  const pakCache = new Map<string, Promise<PakFile>>();
  const pakInstances = new Map<string, PakFile>();

  const UNLOAD_AFTER = 60_000; // 1 minute

  function scheduleCleanup(pak: string, pakFile: PakFile) {
      if (pakFile.cleanupTimer) return;

      pakFile.cleanupTimer = window.setTimeout(() => {
          if (pakFile.refCount === 0 && Date.now() - pakFile.lastUsed >= UNLOAD_AFTER) {
              pakCache.delete(pak);
              pakInstances.delete(pak);
          }
          pakFile.cleanupTimer = undefined;
      }, UNLOAD_AFTER);
  }

  function loadPak(pak: string): Promise<PakFile> {
      if (pakCache.has(pak)) return pakCache.get(pak)!;

      const promise = new Promise<PakFile>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", pak, true);
          xhr.responseType = "arraybuffer";

          xhr.onload = () => {
              const buffer = xhr.response;
              const view = new DataView(buffer);

              const indexLen = view.getUint32(4, true);
              const indexText = new TextDecoder().decode(
                  buffer.slice(8, 8 + indexLen)
              );

              const pakFile: PakFile = {
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

  export let pak: string;
  export let image: string;

  let src: string | null = null;
  let blobUrl: string | null = null;

  onMount(() => {
      let alive = true;

      loadPak(pak).then(pakFile => {
          if (!alive) return;

          pakFile.refCount++;
          pakFile.lastUsed = Date.now();

          const file = pakFile.index.files[image];
          if (!file) return;

          const start = pakFile.dataOffset + file.offset;
          const slice = pakFile.buffer.slice(start, start + file.size);

          blobUrl = URL.createObjectURL(new Blob([slice]));
          src = blobUrl;
      });

      return () => {
          alive = false;

          if (blobUrl) URL.revokeObjectURL(blobUrl);

          const pakFile = pakInstances.get(pak);
          if (!pakFile) return;

          pakFile.refCount--;
          pakFile.lastUsed = Date.now();

          if (pakFile.refCount === 0) {
              scheduleCleanup(pak, pakFile);
          }
      };
  });
</script>

{#if src}
  <img {src} {...$$restProps} />
{/if}
