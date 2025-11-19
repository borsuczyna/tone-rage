import InterfaceService from "@/Services/InterfaceService";
import EventService from "@/Services/EventService";
import Scoreboard from "../Scoreboard/Scoreboard";

export default class AtmFeature {
    private static isVisible: boolean = false;

    public static init() {
        EventService.registerEventHandler('atm:toggle', this.toggleAtm.bind(this));
        EventService.registerEventHandler('atm:closeInterface', this.closeAtm.bind(this));
    }

    private static toggleAtm() {
        this.isVisible = !this.isVisible;
        InterfaceService.setInterfaceVisible('AtmInterface', this.isVisible);

        if (this.isVisible) {
            Scoreboard.setVisible(false);
        }
    }

    private static closeAtm() {
        this.isVisible = false;
        InterfaceService.setInterfaceVisible('AtmInterface', false);
    }
}
