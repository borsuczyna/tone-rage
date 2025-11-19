import InterfaceService from "@/Services/InterfaceService";
import EventService from "@/Services/EventService";

export default class AtmFeature {
    private static isVisible: boolean = false;

    public static init() {
        EventService.registerEventHandler('atm:toggle', this.toggleAtm.bind(this));
    }

    private static toggleAtm() {
        this.isVisible = !this.isVisible;
        InterfaceService.setInterfaceVisible('AtmInterface', this.isVisible);
    }
}
