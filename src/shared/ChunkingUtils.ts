// Configuration for data chunking
export const CHUNK_SIZE = 32000; // Safe size for RageMP events (leave some buffer from 65535 limit)

export interface DataChunk {
	chunkId: string; // Unique identifier for this data transfer
	index: number; // Index of this chunk
	total: number; // Total number of chunks
	data: string; // The chunk data
}

/**
 * Split data into chunks for transmission
 */
export function chunkData(data: string): DataChunk[] {
	const chunks: DataChunk[] = [];
	const chunkId = generateChunkId();
	const totalChunks = Math.ceil(data.length / CHUNK_SIZE);

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
function generateChunkId(): string {
	return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Class to manage chunk assembly
 */
export class ChunkAssembler {
	private chunks: Map<string, Map<number, string>> = new Map();
	private totalChunks: Map<string, number> = new Map();

	/**
	 * Add a chunk and check if all chunks are received
	 */
	public addChunk(chunk: DataChunk): string | null {
		if (!this.chunks.has(chunk.chunkId)) {
			this.chunks.set(chunk.chunkId, new Map());
			this.totalChunks.set(chunk.chunkId, chunk.total);
		}

		const chunkMap = this.chunks.get(chunk.chunkId)!;
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
	private assembleChunks(chunkId: string): string {
		const chunkMap = this.chunks.get(chunkId)!;
		const total = this.totalChunks.get(chunkId)!;
		let result = '';

		for (let i = 0; i < total; i++) {
			result += chunkMap.get(i) || '';
		}

		return result;
	}

	/**
	 * Clean up chunks after assembly
	 */
	private cleanup(chunkId: string): void {
		this.chunks.delete(chunkId);
		this.totalChunks.delete(chunkId);
	}
}
