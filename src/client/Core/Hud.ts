import ElementDataService from '@/Services/ElementDataService';
import InterfaceService from '@/Services/InterfaceService';
import TimerService, { Timer } from '@shared/Services/TimerService';

export default class Hud {
    private static updateTimer: Timer | null = null;

    public static async init() {
        this.setVisible(false);
    }

    public static setVisible(visible: boolean) {
        InterfaceService.setInterfaceVisible('HudInterface', visible);
        mp.game.ui.displayHud(false);
        mp.game.ui.displayRadar(visible);

        if (visible) {
            this.updateTimer = TimerService.setTimer(this.update.bind(this), 1000, 0);
            this.update();
        } else if (this.updateTimer) {
            TimerService.killTimer(this.updateTimer);
            this.updateTimer = null;
        }
    }

    private static update() {
        const username = mp.players.local.name;
        const health = mp.players.local.getHealth();
        const money = ElementDataService.get(mp.players.local, 'money') || 0;
        const level = ElementDataService.get(mp.players.local, 'level') || 0;
        const exp = ElementDataService.get(mp.players.local, 'exp') || 0;

        InterfaceService.callInterfaceEvent('updateUserInfo', {
            userInfo: {
                username,
                health,
                money,
                level,
                exp,
            },
        });
    }
}