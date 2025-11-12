import InterfaceService from "@/Services/InterfaceService";

export default class AtmInterfaceTest {
    private static isVisible: boolean = false;

    public static init() {
        mp.events.add('playerChat', this.onPlayerChat.bind(this));
    }

    private static onPlayerChat(_player: PlayerMp, message: string) {
        if (message === '/atm') {
            this.isVisible = !this.isVisible;
            InterfaceService.setInterfaceVisible('AtmInterface', this.isVisible);
        }
    }
}