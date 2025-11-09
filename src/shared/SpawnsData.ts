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
        locations: [
            { name: 'Galileo Park', category: 'los-santos', position: [-23.88543701171875, 30.965816497802734, 71.93695831298828, 0] },
        ],
    },
    {
        name: 'Sandy Shores',
        locations: [
            { name: 'Sandy Shores Spawn', category: 'sandy-shores', position: [2011.7950439453125, 3760.773193359375, 32.18083190917969, 0] },
        ],
    }
];