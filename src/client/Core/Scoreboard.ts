import ElementDataService from "@/Services/ElementDataService";
import InterfaceService from "@/Services/InterfaceService";
import KeyboardService, { KeyState } from "@/Services/KeyboardService";
import { AdminLevel, getAdminEmblem } from "@shared/Models/AdminLevel";
import { Emblema } from "@shared/Models/Emblema";
import { ScoreboardPlayerItem } from "@shared/Models/ScoreboardData";
import TimerService, { Timer } from "@shared/Services/TimerService";

export default class Scoreboard {
    private static updateTimer: Timer | null = null;
    private static hideTimer: Timer | null = null;
    private static visible: boolean = false;
    
    public static async init() {
        this.setVisible(false);
        KeyboardService.registerKeyHandler('Tab', this.onTabKey.bind(this));
    }

    public static setVisible(visible: boolean) {
        this.visible = visible;

        if (visible) {
            InterfaceService.setInterfaceVisible('ScoreboardInterface', true);
            this.updateTimer = TimerService.setTimer(this.update.bind(this), 1000, 0);
            this.update();  

            if (this.hideTimer) {
                TimerService.killTimer(this.hideTimer);
                this.hideTimer = null;
            }
        } else if (this.updateTimer) {
            TimerService.killTimer(this.updateTimer);
            this.updateTimer = null;
            
            InterfaceService.callInterfaceEvent('playScoreboardHideAnimation', null);
            this.hideTimer = TimerService.setTimer(this.finalizeHide.bind(this), 500, 1);
        }
    }

    private static finalizeHide() {
        InterfaceService.setInterfaceVisible('ScoreboardInterface', false);
        this.hideTimer = null;
    }

    private static getPlayerEmblems(_player: PlayerMp, adminLevel: AdminLevel): Emblema[] {
        const emblemas: Emblema[] = [];
        
        const adminEmblem = getAdminEmblem(adminLevel);
        if (adminEmblem) {
            emblemas.push(adminEmblem);
        }

        return emblemas;
    }

    private static getScoreboardData(): ScoreboardPlayerItem[] {
        let result: ScoreboardPlayerItem[] = [];
        let players = mp.players.toArray();
    
        for (let player of players) {
            const id = player.id;
            const userId = ElementDataService.get(player, 'userId');
            const username = player.name;
            const level = ElementDataService.get(player, 'level') || 0;
            const ping = player.ping;
            const adminLevel = ElementDataService.get(player, 'adminLevel') || 0;
            const status = userId == null ? 'logging-in' : (ElementDataService.get(player, 'status') || 'playing');
            const emblemas = this.getPlayerEmblems(player, adminLevel);

            result.push({
                id,
                username,
                level,
                ping,
                adminLevel,
                status,
                emblemas
            });
        }

        return result;
    }

    private static update() {
        const players = this.getScoreboardData();
        InterfaceService.callInterfaceEvent('setScoreboardData', players);
    }

    private static onTabKey(state: KeyState) {
        const spawned = ElementDataService.get(mp.players.local, 'spawnPosition') !== undefined;
        if (!spawned) return;

        if (state === KeyState.Up) {
            this.setVisible(!this.visible);
        }
    }
}