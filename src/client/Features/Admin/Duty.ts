import EventService from "@/Services/Infrastructure/EventService";

export default class AdminDuty {
    public static onDuty: boolean = false;

    public static init() {
        EventService.registerEventHandler('adminDuty:toggle', this.onDutyDataChange.bind(this));
    }

    private static onDutyDataChange(duty: boolean) {
        this.onDuty = duty;
    }
}