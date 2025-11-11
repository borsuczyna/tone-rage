import translate from "../Translation/Translation";
import { AdminLevel, adminLevelColors } from "./AdminLevel";

export type PlayerStatus = 'playing' | 'afk';

export function getStatusText(adminLevel: AdminLevel, status: PlayerStatus): string {
    if (adminLevel) {
        return translate('scoreboard.status.adminService');
    }

    if (status === 'afk') {
        return translate('scoreboard.status.afk');
    }
    
    return translate('scoreboard.status.playing');
};

export function getStatusColor(adminLevel?: AdminLevel, status?: PlayerStatus): string {
    if (adminLevel !== undefined && adminLevel !== AdminLevel.User) {
        return adminLevelColors[adminLevel];
    }
    
    switch (status) {
        case 'afk':
            return '#f59e0b';
        default:
            return '#22c55e';
    }
};