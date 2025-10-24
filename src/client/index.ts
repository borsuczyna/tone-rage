import InterfaceService from "./Services/InterfaceService";

(async () => {
    await InterfaceService.init();

    // Debug
    await InterfaceService.initDebugCommands();
})();