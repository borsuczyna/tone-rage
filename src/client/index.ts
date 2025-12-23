import LoginPanel from './Features/Auth/LoginPanel';
import DiscordRPC from './Features/DiscordRPC/DiscordRPC';
import EventService from './Services/Infrastructure/EventService';
import ElementDataService from './Services/Infrastructure/ElementDataService';
import FetchService from './Services/Infrastructure/FetchService';
import InterfaceService from './Services/Infrastructure/InterfaceService';
import NotificationService from './Services/Infrastructure/NotificationService';
import PlayerDataDisplay from './Features/PlayerDataDisplay/PlayerDataDisplay';
import CredentialsStorageService from './Services/Utility/CredentialsStorageService';
import Hud from './Features/Hud/Hud';
import Scoreboard from './Features/Scoreboard/Scoreboard';
import KeyboardService from './Services/Utility/KeyboardService';
import PlayerBlipsService from './Services/Utility/PlayerBlipsService';
import Atm from './Features/Atm/Atm';
import HandlingEditorService from './Features/HandlingEditor/HandlingEditorService';
import MarkerService from '@shared-rage/Services/MarkerService';
import DrawingService from './Services/Rendering/DrawingService';
import MarkerClientService from './Services/Rendering/MarkerClientService';
import Chat from './Features/Chat/Chat';
import CommandService from './Services/Infrastructure/CommandService';
import WorldInteraction from './Features/Interaction/WorldInteraction';
import VehicleInteraction from './Features/Interaction/VehicleInteraction';
// import PlayerNametags from './Features/Nametags/PlayerNametags';
import ColShapeService from '@shared-rage/Services/ColShapeService';
import PlayerControlService from './Services/Gameplay/PlayerControlService';
import VehicleService from './Services/Core/VehicleService';
import WinterSeason from './Features/Core/WinterSeason';
import UserService from './Services/Core/UserService';
import GreenScreen from './Features/GreenScreen/GreenScreen';
import CharacterCreator from './Features/CharacterCreator/CharacterCreator';
// import TopsMaker from './Features/GreenScreen/TopsMaker';

(async () => {
	await DiscordRPC.init();
	await EventService.init();
	await ElementDataService.init();
	await PlayerDataDisplay.init();
	await CredentialsStorageService.init();
	await KeyboardService.init();
	await InterfaceService.init();
	await PlayerBlipsService.init();
	await FetchService.init();
	await NotificationService.init();
	await HandlingEditorService.init();
	await LoginPanel.init();
	await Hud.init();
	await Scoreboard.init();
	await MarkerService.init();
	await MarkerClientService.init();
	await DrawingService.init();
	await Chat.init();
	await CommandService.init();
    await ColShapeService.init();
    await PlayerControlService.init();
    await VehicleService.init();
    await UserService.init();

	// Features
	await Atm.init();
	await WorldInteraction.init();
	await VehicleInteraction.init();
    // await PlayerNametags.init();
    await WinterSeason.init();
    await CharacterCreator.init();

    // Tests
    await GreenScreen.init();
    // await TopsMaker.init();
})();