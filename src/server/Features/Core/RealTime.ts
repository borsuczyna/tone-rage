import TimerService from "@shared/Services/TimerService";

export default class RealTime {
    public static init() {
        TimerService.setTimer(this.updateTime.bind(this), 60000, 0);
        this.updateTime();
    }

    private static updateTime() {
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        mp.world.time.set(hours, minutes, 0);
    }
}