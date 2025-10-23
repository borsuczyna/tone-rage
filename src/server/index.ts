import Database from "./Database/Database";
import VehicleService from "./Services/VehicleService";
import Tests from "./Tests/Tests";

(async () => {
    await Database.init();
    await VehicleService.init();

    Tests.getPositionCommandTest();
})();