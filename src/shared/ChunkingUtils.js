// Configuration for data chunking
export const CHUNK_SIZE = 320; // Safe size for RageMP events (leave some buffer from 65535 limit)
/**
 * Split data into chunks for transmission
 */
export function chunkData(data) {
    if (data === undefined) {
        data = '';
    }
    const chunks = [];
    const chunkId = generateChunkId();
    let totalChunks = Math.ceil(data.length / CHUNK_SIZE);
    if (totalChunks === 0) {
        totalChunks = 1; // Ensure at least one chunk for empty data
    }
    for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, data.length);
        chunks.push({
            chunkId,
            index: i,
            total: totalChunks,
            data: data.substring(start, end)
        });
    }
    return chunks;
}
/**
 * Generate a unique chunk ID
 */
function generateChunkId() {
    // Use timestamp, random string, and counter for better uniqueness
    const timestamp = Date.now();
    const random1 = Math.random().toString(36).substring(2, 15);
    const random2 = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random1}${random2}`;
}
/**
 * Class to manage chunk assembly
 */
export class ChunkAssembler {
    chunks = new Map();
    totalChunks = new Map();
    /**
     * Add a chunk and check if all chunks are received
     */
    addChunk(chunk) {
        if (!this.chunks.has(chunk.chunkId)) {
            this.chunks.set(chunk.chunkId, new Map());
            this.totalChunks.set(chunk.chunkId, chunk.total);
        }
        const chunkMap = this.chunks.get(chunk.chunkId);
        chunkMap.set(chunk.index, chunk.data);
        // Check if all chunks are received
        if (chunkMap.size === chunk.total) {
            const data = this.assembleChunks(chunk.chunkId);
            this.cleanup(chunk.chunkId);
            return data;
        }
        return null;
    }
    /**
     * Assemble all chunks into the complete data
     */
    assembleChunks(chunkId) {
        const chunkMap = this.chunks.get(chunkId);
        const total = this.totalChunks.get(chunkId);
        let result = '';
        for (let i = 0; i < total; i++) {
            const chunk = chunkMap.get(i);
            if (chunk === undefined) {
                throw new Error(`Missing chunk ${i} of ${total} for chunkId ${chunkId}`);
            }
            result += chunk;
        }
        return result;
    }
    /**
     * Clean up chunks after assembly
     */
    cleanup(chunkId) {
        this.chunks.delete(chunkId);
        this.totalChunks.delete(chunkId);
    }
}
