import { VehicleEntity } from "@/Database/Entities/VehicleEntity";

export default class PrivateVehicle {
    uid: number;
    model: string;
    color: [Array2d, Array2d];
    vehicle: VehicleMp;

    constructor(data: VehicleEntity) {
        this.uid = data.uid;
        this.model = data.model;
        this.color = data.colorArray;
        
        let realModel = mp.joaat(this.model);
        let position = data.positionVector;
        this.vehicle = mp.vehicles.new(realModel, position, {
            color: data.colorArray
        });

        this.vehicle.rotation = data.rotationVector;
    }

    destroy() {
        if (this.vehicle) {
            this.vehicle.destroy();
        }
    }
}