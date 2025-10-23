import Database from "./Database/Database";
import UserService from "./Services/UserService";

(async () => {
    await Database.init();

    async function createUserTest() {
        const userId = await UserService.createUser("johndoe", "johndoe@example.com", "password123");
        console.log("Create user result:", userId);
    }

    await createUserTest();
})();