export default class WinterSeason {
    private static snowEnabled: boolean = false;

    public static init() {
        mp.game.gameplay.setSnowLevel(1.0);
        this.enableSnow(true);
    }

    public static enableSnow(toggle: boolean) {
        mp.game.invoke('0x6E9EF3A33C8899F8', toggle);
        this.snowEnabled = toggle;
    }

    public static isSnowEnabled(): boolean {
        return this.snowEnabled;
    }
}