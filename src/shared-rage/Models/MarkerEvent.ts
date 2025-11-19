import Marker from "../Entities/Marker";
import MarkerHitType from "./MarkerHitType";

export default interface MarkerEvent {
    marker: Marker | null;
    callback: (hitType: MarkerHitType, player: PlayerMp, marker?: Marker) => void;
}