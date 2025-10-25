import { VehicleEntity } from '@/Database/Entities/VehicleEntity';

export default class PrivateVehicle {
	uid: number;
	model: string;
	color: [RGB, RGB];
	vehicle: VehicleMp;

	get colorString(): string {
		return this.color.map((c) => c.join(',')).join(',');
	}

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

	setColor(color: [RGB, RGB]) {
		this.color = color;
		this.vehicle.setColorRGB(...color[0], ...color[1]);
	}

	destroy() {
		if (this.vehicle) {
			this.vehicle.destroy();
		}
	}
}
