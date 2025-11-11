import InterfaceService from "@/Services/InterfaceService";
import TimerService, { Timer } from "@shared/Services/TimerService";

export default class Scoreboard {
    private static updateTimer: Timer | null = null;
    
    public static async init() {
        this.setVisible(false);
    }

    public static setVisible(visible: boolean) {
        InterfaceService.setInterfaceVisible('ScoreboardInterface', visible);

        if (visible) {
            this.updateTimer = TimerService.setTimer(this.update.bind(this), 1000, 0);
            this.update();
        } else if (this.updateTimer) {
            TimerService.killTimer(this.updateTimer);
            this.updateTimer = null;
        }
    }

    private static update() {
        
    }
}