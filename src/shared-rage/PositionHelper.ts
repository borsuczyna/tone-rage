export function getPointFromDistanceRotation(origin: Vector3, distance: number, rotation: number): Vector3 {
	// rotation is in degrees
	const angleRad = rotation * (Math.PI / 180);
	const newX = origin.x + distance * Math.cos(angleRad);
	const newY = origin.y + distance * Math.sin(angleRad);
	return new mp.Vector3(newX, newY, origin.z);
}
