interface AtmPoint {
    position: Vector3;
    heading: number;
    dimension: number;
}

const AtmPositions: AtmPoint[] = [
    { position: new mp.Vector3(-31.0828914642334, 42.9251823425293, 71.99915313720703), heading: 0, dimension: 0 },
    { position: new mp.Vector3(-35.0828914642334, 42.9251823425293, 71.99915313720703), heading: 45, dimension: 0 },
];

export default AtmPositions;