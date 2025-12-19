import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({
	tableName: 'vehicles',
	timestamps: false
})
export class VehicleEntity extends Model {
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
		const [x, y, z] = this.position.split(',').map(Number);
		return new mp.Vector3(x, y, z);
	}

	get rotationVector(): Vector3 {
		const [x, y, z] = this.rotation.split(',').map(Number);
		return new mp.Vector3(x, y, z);
	}

	get colorArray(): [RGB, RGB] {
		const colors = this.color.split(',').map(Number);
		return [
			[colors[0], colors[1], colors[2]],
			[colors[3], colors[4], colors[5]]
		];
	}
}
