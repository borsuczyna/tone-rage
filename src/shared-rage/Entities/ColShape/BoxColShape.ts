import { ColShape, ColShapeType } from "./ColShape";

export default class BoxColShape extends ColShape {
    public type = ColShapeType.Box;
    public position: Vector3;
    public size: Vector3;
    public rotation: number;

    constructor(position: Vector3, size: Vector3, rotation: number) {
        super();

        this.position = position;
        this.size = size;
        this.rotation = rotation;
    }

    protected checkEntityInside(entity: EntityMp): boolean {
        const p = entity.position;

        // Z check
        if (p.z < this.position.z || p.z > this.position.z + this.size.z) {
            return false;
        }

        // translate to box center
        const dx = p.x - this.position.x;
        const dy = p.y - this.position.y;

        // undo rotation
        const rad = (-this.rotation * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const localX = dx * cos - dy * sin;
        const localY = dx * sin + dy * cos;

        const halfX = this.size.x / 2;
        const halfY = this.size.y / 2;

        return (
            localX >= -halfX &&
            localX <= halfX &&
            localY >= -halfY &&
            localY <= halfY
        );
    }

    public renderDebug(): void {
        const halfWidth = this.size.x / 2;
        const halfDepth = this.size.y / 2;
        const rotation = this.rotation - 90;
        
        const frontFaceCenter = getPointFromDistanceRotation(this.position, halfDepth, rotation);
        const backFaceCenter = getPointFromDistanceRotation(this.position, halfDepth, rotation + 180);
        const rightFaceCenter = getPointFromDistanceRotation(this.position, halfWidth, rotation + 90);
        const leftFaceCenter = getPointFromDistanceRotation(this.position, halfWidth, rotation + 270);

        const sides = [
            // Front face
            {
                from: getPointFromDistanceRotation(leftFaceCenter, halfDepth, rotation),
                to: getPointFromDistanceRotation(rightFaceCenter, halfDepth, rotation),
            },
            // Right face
            {
                from: getPointFromDistanceRotation(frontFaceCenter, halfWidth, rotation + 90),
                to: getPointFromDistanceRotation(backFaceCenter, halfWidth, rotation + 90),
            },
            // Back face
            {
                from: getPointFromDistanceRotation(rightFaceCenter, halfDepth, rotation + 180),
                to: getPointFromDistanceRotation(leftFaceCenter, halfDepth, rotation + 180),
            },
            // Left face
            {
                from: getPointFromDistanceRotation(backFaceCenter, halfWidth, rotation + 270),
                to: getPointFromDistanceRotation(frontFaceCenter, halfWidth, rotation + 270),
            },
        ];

        sides.forEach((side) => {
            mp.game.graphics.drawLine(
                side.from.x, side.from.y, this.position.z,
                side.to.x, side.to.y, this.position.z,
                255, 0, 0, 100
            );
            mp.game.graphics.drawLine(
                side.from.x, side.from.y, this.position.z + this.size.z,
                side.to.x, side.to.y, this.position.z + this.size.z,
                255, 0, 0, 100
            );
            mp.game.graphics.drawLine(
                side.from.x, side.from.y, this.position.z,
                side.from.x, side.from.y, this.position.z + this.size.z,
                255, 0, 0, 100
            );
        });
    }
}

function getPointFromDistanceRotation(origin: Vector3, distance: number, rotation: number): Vector3 {
	// rotation is in degrees
	const angleRad = rotation * (Math.PI / 180);
	const newX = origin.x + distance * Math.cos(angleRad);
	const newY = origin.y + distance * Math.sin(angleRad);
	return new mp.Vector3(newX, newY, origin.z);
}