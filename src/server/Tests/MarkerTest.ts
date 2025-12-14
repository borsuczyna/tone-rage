import Marker from '@shared-rage/Entities/Marker';
import MarkerHitType from '@shared-rage/Models/MarkerHitType';
import MarkerType from '@shared-rage/Models/MarkerType';
import MarkerService from '@shared-rage/Services/MarkerService';

export default class MarkerTest {
	private static cylinder: Marker;

	public static init() {
		this.cylinder = MarkerService.createMarker(
			new mp.Vector3(-34.44065856933594, 43.07141876220703, 71.95735168457031),
			[255, 0, 0, 155],
			1,
			MarkerType.Cylinder
		);
		MarkerService.createMarker(
			new mp.Vector3(-39.44065856933594, 43.07141876220703, 71.95735168457031),
			[0, 255, 0, 155],
			1,
			MarkerType.Cylinder
		);
		MarkerService.createMarker(
			new mp.Vector3(-45.44065856933594, 43.07141876220703, 71.95735168457031),
			[0, 0, 255, 155],
			1,
			MarkerType.Cylinder
		);

        MarkerService.createMarker(
            new mp.Vector3(-34.44065856933594, 33.07141876220703, 71.95735168457031),
            [255, 255, 0, 155],
            [2, 4.5],
            MarkerType.Box
        );

        MarkerService.createMarker(
            new mp.Vector3(-39.44065856933594, 33.07141876220703, 71.95735168457031),
            [255, 255, 0, 155],
            [2, 4.5, 45],
            MarkerType.Box
        );

		this.cylinder.registerEventHandler(this.onCylinderHit.bind(this));
	}

	private static onCylinderHit(hitType: MarkerHitType, entity: EntityMp) {
		if (hitType === MarkerHitType.Enter) {
			console.log(`Player ${entity.id} entered cylinder marker.`);
			const pos = this.cylinder.position;
			this.cylinder.position = new mp.Vector3(pos.x + 1, pos.y, pos.z);
			this.cylinder.color = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 155];
			this.cylinder.scale = (this.cylinder.scale as number) + 0.5;
			this.cylinder.upperText = `Scale: ${this.cylinder.scale.toFixed(1)}`;
			this.cylinder.lowerText = `Pos: (${this.cylinder.position.x.toFixed(1)}, ${this.cylinder.position.y.toFixed(
				1
			)}, ${this.cylinder.position.z.toFixed(1)})`;
		} else if (hitType === MarkerHitType.Exit) {
			console.log(`Player ${entity.id} exited cylinder marker.`);
		}
	}
}
