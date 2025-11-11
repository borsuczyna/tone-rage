import { AdminLevel } from "./AdminLevel";
import { Emblema } from "./Emblema";
import { PlayerStatus } from "./PlayerStatus";

export interface ScoreboardPlayerItem {
    id: number;
    username: string;
    avatar?: string;
    level: number;
    ping: number;
    adminLevel: AdminLevel;
    status: PlayerStatus;
    emblemas?: Emblema[];
}

export interface ScoreboardData {
    players: ScoreboardPlayerItem[];
    serverInfo: {
        name: string;
        playerCount: number;
        maxPlayers: number;
        uptime: string;
    };
}