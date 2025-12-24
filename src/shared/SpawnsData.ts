export interface SpawnLocation {
	name: string;
	category: string;
	position: [number, number, number, number];
	cameraHeight?: number;
}

export interface SpawnCategory {
	name: string;
	locations: SpawnLocation[];
}

export interface SpawnResponse {
	success: boolean;
	message?: string;
}

export const spawnData: SpawnCategory[] = [
	{
		name: 'Los Santos',
		locations: [{ name: 'Galileo Park', category: 'los-santos', position: [-422.66552734375, 1133.93212890625, 325.85467529296875, 0] }]
	},
	{
		name: 'Sandy Shores',
		locations: [{ name: 'Sandy Shores Spawn', category: 'sandy-shores', position: [2011.7950439453125, 3760.773193359375, 32.18083190917969, 0] }]
	}
];

export const characterCreationPosition = [-421.4275817871094, 1137.279541015625, 625.8563537597656, 0];