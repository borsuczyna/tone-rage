import Database from "./Database/Database";
import ShutdownService from "./Services/ShutdownService";
import VehicleService from "./Services/VehicleService";
import Tests from "./Tests/Tests";

(async () => {
    await Database.init();
    await VehicleService.init();
    await ShutdownService.init();

    Tests.getPositionCommandTest();
})();