import Database from "./Database/Database";
import AnticheatService from "./Services/AnticheatService";
import EventService from "./Services/EventService";
import FetchService from "./Services/FetchService";
import ShutdownService from "./Services/ShutdownService";
import VehicleService from "./Services/VehicleService";
import Tests from "./Tests/Tests";

(async () => {
    await Database.init();
    await EventService.init();
    await AnticheatService.init();
    await VehicleService.init();
    await ShutdownService.init();
    await FetchService.init();

    // Debug
    Tests.getPositionCommandTest();
    await FetchService.initDebug();
})();