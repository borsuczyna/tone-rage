import InterfaceService from "@/Services/InterfaceService";
import EventService from "@/Services/EventService";
import Scoreboard from "../Scoreboard/Scoreboard";
import AtmPositions from "@shared-rage/Data/AtmPositions";
import { getPointFromDistanceRotation } from "@shared-rage/PositionHelper";
import MarkerService from "@shared-rage/Services/MarkerService";
import MarkerType from "@shared-rage/Models/MarkerType";
import Marker from "@shared-rage/Entities/Marker";
import MarkerHitType from "@shared-rage/Models/MarkerHitType";
import ElementDataService from "@/Services/ElementDataService";
import translate from "@shared/Translation/Translation";

export default class AtmFeature {
    private static isVisible: boolean = false;
    private static atmMarkers: Set<Marker> = new Set();
    private static atmObjects: Set<ObjectMp> = new Set();
    private static atmBlips: Set<BlipMp> = new Set();

    public static init() {
        EventService.registerEventHandler('atm:closeInterface', this.closeAtm.bind(this));
        MarkerService.registerEventHandler(null, this.onAtmMarkerHit.bind(this));
        
        // Create ATM objects in the world
        this.createATMs();
    }

    private static createATMs() {
        for (const { position, heading, dimension } of AtmPositions) {
            const validPosition = new mp.Vector3(position.x, position.y, position.z - 1); // Adjust Z to place on ground
            const markerPosition = getPointFromDistanceRotation(position, 1, heading - 90);
            markerPosition.z -= .6;

            const object = mp.objects.new(mp.game.joaat('prop_atm_01'), validPosition, {
                rotation: new mp.Vector3(0, 0, heading),
                dimension: dimension,
            });

            const blip = mp.blips.new(238, validPosition, {
                name: translate('blip.atm'),
                scale: 0.8,
                dimension: dimension,
                shortRange: true,
            });

            this.atmBlips.add(blip);

            object.setCollision(true, true);

            const marker = MarkerService.createMarker(markerPosition, [255, 0, 89, 140], 1, MarkerType.Cylinder, dimension, 1.5);
            
            this.atmMarkers.add(marker);
            this.atmObjects.add(object);
            this.atmBlips.add(blip);
        }
    }

    private static onAtmMarkerHit(hitType: MarkerHitType, player: PlayerMp, marker?: Marker) {
        if (!marker || !this.atmMarkers.has(marker) || player !== mp.players.local) {
            return;
        }

        if (hitType === MarkerHitType.Enter) {
            this.setVisible(true);
        } else if (hitType === MarkerHitType.Exit) {
            this.setVisible(false);
        }
    }

    private static setVisible(visible: boolean) {
        if (
            !ElementDataService.get(mp.players.local, 'userId') ||
            mp.players.local.vehicle != null ||
            mp.players.local.isDead()
        ) {
            return;
        }

        this.isVisible = visible;
        InterfaceService.setInterfaceVisible('AtmInterface', visible);
        InterfaceService.setCursorVisible(visible, false);
        
        if (visible) {
            Scoreboard.setVisible(false);
        }
    }

    private static closeAtm() {
        this.isVisible = false;
        InterfaceService.setInterfaceVisible('AtmInterface', false);
        InterfaceService.setCursorVisible(false, false);
    }
}
