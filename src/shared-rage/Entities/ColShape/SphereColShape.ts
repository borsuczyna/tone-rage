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
        const latStep = 15; // vertical density
        const lonStep = 15; // horizontal density

        // latitude rings
        for (let lat = -90 + latStep; lat <= 90 - latStep; lat += latStep) {
            this.drawLatitudeCircle(lat, lonStep);
        }

        // longitude rings
        for (let lon = 0; lon < 180; lon += lonStep) {
            this.drawLongitudeCircle(lon, latStep);
        }
    }

    private drawLatitudeCircle(latDeg: number, step: number): void {
        const lat = latDeg * Math.PI / 180;
        const r = Math.cos(lat) * this.radius;
        const z = Math.sin(lat) * this.radius;

        let last = getPointLat(this.position, r, z, 0);
        for (let a = step; a <= 360; a += step) {
            const next = getPointLat(this.position, r, z, a);
            this.drawLine(last, next);
            last = next;
        }
    }

    private drawLongitudeCircle(lonDeg: number, step: number): void {
        const lon = lonDeg * Math.PI / 180;

        let last = getPointLon(this.position, this.radius, lon, -90);
        for (let a = -90 + step; a <= 90; a += step) {
            const next = getPointLon(this.position, this.radius, lon, a);
            this.drawLine(last, next);
            last = next;
        }
    }

    private drawLine(a: Vector3, b: Vector3): void {
        mp.game.graphics.drawLine(
            a.x, a.y, a.z,
            b.x, b.y, b.z,
            255, 0, 0, 100
        );
    }
}

function getPointLat(
    o: Vector3,
    r: number,
    z: number,
    rot: number
): Vector3 {
    const a = rot * Math.PI / 180;
    return new mp.Vector3(
        o.x + r * Math.cos(a),
        o.y + r * Math.sin(a),
        o.z + z
    );
}

function getPointLon(
    o: Vector3,
    radius: number,
    lon: number,
    latDeg: number
): Vector3 {
    const lat = latDeg * Math.PI / 180;
    return new mp.Vector3(
        o.x + radius * Math.cos(lat) * Math.cos(lon),
        o.y + radius * Math.cos(lat) * Math.sin(lon),
        o.z + radius * Math.sin(lat)
    );
}
