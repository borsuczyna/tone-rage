import UserService from "@/Services/Core/UserService";
import ElementDataService from "@/Services/Infrastructure/ElementDataService";
import FetchService from "@/Services/Infrastructure/FetchService";
import Logger from "@shared/Logger";
import { CharacterAppearance, SaveCharacterAppearanceResponse, validateCharacterAppearance } from "@shared/Models/Character/Character";
import { ShareMode } from "@shared/Models/ElementDataModels";

export default class CharacterCreator {
    private static logger: Logger = Logger.getLogger(CharacterCreator, true);
    public static init() {
        FetchService.registerFetchListener('characterCreator:saveCharacter', this.onSaveCharacter.bind(this));
    }

    private static async onSaveCharacter(client: PlayerMp, appearance: CharacterAppearance): Promise<SaveCharacterAppearanceResponse> {
        const isInCharacterCreator = ElementDataService.get(client, 'inCharacterCreation');
        if (!isInCharacterCreator) {
            this.logger.warn(`Player ${client.id} attempted to save character outside of character creator`);
            return { success: false, message: 'Not in character creator' };
        }

        const userId = ElementDataService.get(client, 'userId');
        if (!userId) {
            this.logger.warn(`Player ${client.name} has no associated userId`);
            return { success: false, message: 'User not logged in' };
        }

        const [isValid, validationMessage] = validateCharacterAppearance(appearance);
        if (!isValid) {
            this.logger.warn(`Invalid character appearance data received from player ${client.name} (${userId}): ${validationMessage}`);
            return { success: false, message: 'Invalid character data' };
        }
        
        this.logger.info(`Saving character for player ${client.name} (${client.id})`);
        const success = await UserService.updateCharacterAppearance(client, appearance);
        if (!success) {
            this.logger.error(`Failed to save character appearance for player ${client.name} (${userId})`);
            return { success: false, message: 'Failed to save character, please try again' };
        }

        ElementDataService.set(client, 'characterVisuals', appearance, ShareMode.SpecificClient);
        return { success: true, message: 'Character saved successfully' };
    }
}