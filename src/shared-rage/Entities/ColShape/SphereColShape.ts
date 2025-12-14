import { ColShape, ColShapeType } from "./ColShape";

export default class SphereColShape extends ColShape {
    public type = ColShapeType.Sphere;
    public position: Vector3;
    public radius: number;

    constructor(position: Vector3, radius: number) {
        super();

        this.position = position;
        this.radius = radius;
    }

    protected checkEntityInside(entity: EntityMp): boolean {
        const length = entity.position.subtract(this.position).length();
        return length <= this.radius;
    }

    public renderDebug(): void {
        mp.game.graphics.drawSphere(this.position.x, this.position.y, this.position.z, this.radius, 255, 0, 0, 0.3);
    }
}