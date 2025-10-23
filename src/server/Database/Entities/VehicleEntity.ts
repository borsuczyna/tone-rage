import { DatabaseEntity } from "./DatabaseEntity";

export class VehicleEntity extends DatabaseEntity {
    model: string = '';
    position: string = '0,0,0';
    rotation: string = '0,0,0';
    color: string = '0,0,0,0';

    get positionVector(): Vector3 {
        const [x, y, z] = this.position.split(',').map(Number);
        return new mp.Vector3(x, y, z);
    }

    get rotationVector(): Vector3 {
        const [x, y, z] = this.rotation.split(',').map(Number);
        return new mp.Vector3(x, y, z);
    }

    get colorArray(): [Array2d, Array2d] {
        const colors = this.color.split(',').map(Number);
        return [[colors[0], colors[1]], [colors[2], colors[3]]];
    }
}