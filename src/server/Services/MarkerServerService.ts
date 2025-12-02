import { SerializedMarker } from "@shared-rage/Entities/Marker";
import MarkerService from "@shared-rage/Services/MarkerService";
import EventService from "./EventService";
import Logger from "@shared/Logger";
import TimerService from "@shared/Services/TimerService";

export default class MarkerServerService {
    private static logger = Logger.getLogger(MarkerServerService);
    
    public static init() {
        mp.events.add('playerJoin', this.sendMarkersToPlayer.bind(this));
        TimerService.setTimer(this.resyncChangedMarkers.bind(this), 100, 0);
    }

    private static sendMarkersToPlayer(player: PlayerMp) {
        const serialized: SerializedMarker[] = [];

        for (let marker of MarkerService.markers) {
            serialized.push(marker.serialize());
        }

        EventService.triggerClientEvent(player, 'MarkerService:ReceiveMarkers', serialized);
        this.logger.info(`Sent ${serialized.length} markers to player ${player.name} (${player.id})`);
    }

    private static resyncChangedMarkers() {
        const changedMarkers = Array.from(MarkerService.markers).filter(marker => marker.resyncToPlayers);
        if (changedMarkers.length === 0) return;

        const serialized: SerializedMarker[] = changedMarkers.map(marker => marker.serialize());
        for (let marker of changedMarkers) {
            marker.resyncToPlayers = false;
        }

        EventService.triggerAllClients('MarkerService:ReceiveMarkers', serialized);
        this.logger.info(`Resynced ${serialized.length} changed markers to all players`);
    }
}