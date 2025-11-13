import Logger from "@shared/Logger";
import FetchService from "@/Services/FetchService";
import { spawnData, SpawnResponse } from "@shared/SpawnsData";
import UserService from "@/Features/User/UserService";

export default class SpawnService {
    private static logger: Logger = Logger.getLogger(SpawnService);

    public static async init() {
        FetchService.registerFetchListener('spawn:select', this.handleSpawnSelect.bind(this));
    }

    private static async handleSpawnSelect(client: PlayerMp, spawnLocation: [number, number]): Promise<SpawnResponse> {
        const spawn = spawnData[spawnLocation[0]]?.locations[spawnLocation[1]];
        if (!spawn) {
            this.logger.warn(`Invalid spawn location selected by player ${client.name}: ${JSON.stringify(spawnLocation)}`);
            return { success: false, message: 'spawn.invalidLocation' };
        }

        await UserService.spawnPlayerAtLocation(client, spawn);
        return { success: true };
    }
}