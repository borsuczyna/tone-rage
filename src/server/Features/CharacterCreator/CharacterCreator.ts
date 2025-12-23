import UserService from "@/Services/Core/UserService";
import ElementDataService from "@/Services/Infrastructure/ElementDataService";
import EventService from "@/Services/Infrastructure/EventService";
import FetchService from "@/Services/Infrastructure/FetchService";
import Logger from "@shared/Logger";
import { CharacterAppearance, decodeCharacterAppearance, getBestTorsoForTop, getBestUndershirtsForTop, SaveCharacterAppearanceResponse, validateCharacterAppearance } from "@shared/Models/Character/Character";

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
        
        const success = await UserService.updateCharacterAppearance(client, appearance);
        if (!success) {
            this.logger.error(`Failed to save character appearance for player ${client.name} (${userId})`);
            return { success: false, message: 'Failed to save character, please try again' };
        }

        this.logger.info(`Saved character for player ${client.name} (${client.id})`);
        return { success: true, message: 'Character saved successfully' };
    }

    public static loadCharacterAppearance(client: PlayerMp) {
        const appearanceString = ElementDataService.get(client, 'characterVisuals') as string | null;
        if (!appearanceString) {
            this.logger.error(`Cannot load character appearance for player ${client.name}: appearance data is null`);
            return;
        }

        const appearance = decodeCharacterAppearance(appearanceString);
        if (!appearance) {
            this.logger.error(`Cannot load character appearance for player ${client.name}: failed to decode appearance data`);
            return;
        }

        client.setCustomization(
            appearance.gender === 'male',
            appearance.maleParent,
            appearance.femaleParent,
            0,
            appearance.maleParent,
            appearance.femaleParent,
            0,
            1 - (appearance.faceSimilarity / 100),
            1 - (appearance.skinSimilarity / 100),
            0,
            appearance.eyeColor,
            appearance.hairColor,
            appearance.hairHighlightColor,
            [
                (appearance.noseWidth - 50) / 50,
                (appearance.noseHeight - 50) / 50,
                (appearance.noseLength - 50) / 50,
                (appearance.noseBridge - 50) / 50,
                (appearance.noseTip - 50) / 50,
                (appearance.noseBridgeShift - 50) / 50,
                (appearance.eyebrowHeight - 50) / 50,
                (appearance.eyebrowWidth - 50) / 50,
                (appearance.cheekboneHeight - 50) / 50,
                (appearance.cheekboneWidth - 50) / 50,
                (appearance.cheeksWidth - 50) / 50,
                (appearance.eyesOpening - 50) / 50,
                (appearance.lipsThickness - 50) / 50,
                (appearance.jawWidth - 50) / 50,
                (appearance.jawHeight - 50) / 50,
                (appearance.chinLength - 50) / 50,
                (appearance.chinPosition - 50) / 50,
                (appearance.chinWidth - 50) / 50,
                (appearance.chinShape - 50) / 50,
                (appearance.neckWidth - 50) / 50
            ]
        );

        const bestTorso = getBestTorsoForTop(appearance.gender, appearance.topStyle);
        const bestUndershirts = getBestUndershirtsForTop(appearance.gender, appearance.topStyle);
        
        client.setClothes(2, appearance.hairStyle, 0, 1);
        client.setClothes(4, appearance.legsStyle, appearance.legsTexture, 2);
        client.setClothes(6, appearance.shoesStyle, appearance.shoesTexture, 2);
        client.setClothes(3, bestTorso, 0, 2);
        client.setClothes(8, appearance.undershirtStyle ?? bestUndershirts[0].id, appearance.undershirtTexture ?? bestUndershirts[0].textures[0], 2);
        client.setClothes(11, appearance.topStyle, appearance.topTexture, 2);
        client.setHairColor(appearance.hairColor, appearance.hairHighlightColor);

        this.updatePlayerHairOverlay(client);
    }

    private static updatePlayerHairOverlay(client: PlayerMp) {
        EventService.triggerAllClients('characterCreator:updateHairOverlay', client.id);
    }
}