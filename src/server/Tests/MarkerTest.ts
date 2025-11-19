import MarkerHitType from "@shared-rage/Models/MarkerHitType";
import MarkerType from "@shared-rage/Models/MarkerType";
import MarkerService from "@shared-rage/Services/MarkerService";

export default class MarkerTest {
    public static init() {
        const cylinder = MarkerService.createMarker(new mp.Vector3(-34.44065856933594, 43.07141876220703, 71.95735168457031), [255, 0, 0, 155], 1, MarkerType.Cylinder);
        MarkerService.createMarker(new mp.Vector3(-39.44065856933594, 43.07141876220703, 71.95735168457031), [0, 255, 0, 155], 1, MarkerType.ArrowDown);
        MarkerService.createMarker(new mp.Vector3(-45.44065856933594, 43.07141876220703, 71.95735168457031), [0, 0, 255, 155], 1, MarkerType.ArrowUp);
        
        cylinder.registerEventHandler(this.onCylinderHit.bind(this));
    }

    private static onCylinderHit(hitType: MarkerHitType, player: PlayerMp) {
        if (hitType === MarkerHitType.Enter) {
            console.log(`Player ${player.id} entered cylinder marker.`);
        } else if (hitType === MarkerHitType.Exit) {
            console.log(`Player ${player.id} exited cylinder marker.`);
        }
    }
}