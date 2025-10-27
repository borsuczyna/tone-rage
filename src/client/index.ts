import LoginPanel from "./Core/LoginPanel";
import DiscordRPCService from "./Services/DiscordRPCService";
import FetchService from "./Services/FetchService";
import InterfaceService from "./Services/InterfaceService";
import NotificationService from "./Services/NotificationService";

(async () => {
	await DiscordRPCService.init();
	
    await InterfaceService.init();
    await FetchService.init();
    await NotificationService.init();
    await LoginPanel.init();

    // Debug
    await InterfaceService.initDebug();
    await FetchService.initDebug();
    await NotificationService.initDebug();
})();
