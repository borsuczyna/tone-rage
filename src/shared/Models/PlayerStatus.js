import translate from '../Translation/Translation';
import { AdminLevel, adminLevelColors } from './AdminLevel';
export function getStatusText(adminLevel, status) {
    if (adminLevel) {
        return translate('scoreboard.status.adminService');
    }
    if (status === 'logging-in') {
        return translate('scoreboard.status.loggingIn');
    }
    else if (status === 'afk') {
        return translate('scoreboard.status.afk');
    }
    return translate('scoreboard.status.playing');
}
export function getStatusColor(adminLevel, status) {
    if (adminLevel !== undefined && adminLevel !== AdminLevel.User) {
        return adminLevelColors[adminLevel];
    }
    switch (status) {
        case 'logging-in':
            return '#6b7280';
        case 'afk':
            return '#f59e0b';
        default:
            return '#22c55e';
    }
}
