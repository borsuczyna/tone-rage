import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({
	tableName: 'vehicles',
	timestamps: false
})
export class VehicleEntity extends Model<VehicleEntity> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	uid!: number;

	@Column(DataType.STRING)
	model!: string;

	@Column(DataType.STRING)
	position!: string;

	@Column(DataType.STRING)
	rotation!: string;

	@Column(DataType.STRING)
	color!: string;

	get positionVector(): Vector3 {
		const parts = this.position.split(',').map(Number);
		const [x = 0, y = 0, z = 0] = parts;
		return new mp.Vector3(x, y, z);
	}

	get rotationVector(): Vector3 {
		const parts = this.rotation.split(',').map(Number);
		const [x = 0, y = 0, z = 0] = parts;
		return new mp.Vector3(x, y, z);
	}

	get colorArray(): [RGB, RGB] {
		const colors = this.color.split(',').map(Number);
		const [r1 = 0, g1 = 0, b1 = 0, r2 = 0, g2 = 0, b2 = 0] = colors;
		return [
			[r1, g1, b1],
			[r2, g2, b2]
		];
	}
}
