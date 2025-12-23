import CommandService from "@/Services/Infrastructure/CommandService";
import ElementDataService from "@/Services/Infrastructure/ElementDataService";
import EventService from "@/Services/Infrastructure/EventService";
import NotificationService from "@/Services/Infrastructure/NotificationService";
import { ShareMode } from "@shared/Models/ElementDataModels";
import translate from "@shared/Translation/Translation";

export default class AdminDuty {
    public static init() {
        CommandService.registerCommandHandler(
            {
                command: '/duty',
                description: 'Admin duty mode toggle'
            },
            this.onDutyCommand.bind(this)
        );
    }

    private static onDutyCommand(client: PlayerMp) {
        const userId = ElementDataService.get(client, 'userId');
        if (!userId || typeof userId !== 'number') {
            return;
        }

        const adminLevel = ElementDataService.get(client, 'adminLevel');
        if (!adminLevel || typeof adminLevel !== 'number' || adminLevel < 1) {
            NotificationService.addNotification(client, 'error', translate('admin.duty.title'), translate('admin.duty.noPermission.message'));
            return;
        }

        const onDuty = ElementDataService.get(client, 'adminDuty') !== undefined;
        if (onDuty) {
            ElementDataService.delete(client, 'adminDuty');
            NotificationService.addNotification(client, 'info', translate('admin.duty.title'), translate('admin.duty.off.message'));
        } else {
            ElementDataService.set(client, 'adminDuty', adminLevel, ShareMode.Everywhere);
            NotificationService.addNotification(client, 'info', translate('admin.duty.title'), translate('admin.duty.on.message'));
        }

        EventService.triggerClientEvent(client, 'adminDuty:toggle', !onDuty);
    }
}