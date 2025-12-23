import EventService from '@/Services/Infrastructure/EventService';
import InterfaceService from '@/Services/Infrastructure/InterfaceService';
import SpawnPanel from '@/Features/Spawn/SpawnPanel';
import TimerService from '@shared/Services/TimerService';
import CharacterCreator from '../CharacterCreator/CharacterCreator';

export default class LoginPanel {
	public static async init() {
		this.setVisible(true);
		EventService.registerEventHandler('auth:loginSuccess', this.handleLoginSuccess.bind(this));
	}

	private static handleLoginSuccess(hasCharacter: boolean) {
		TimerService.setTimer(this.hideLoginPanel.bind(this, hasCharacter), 400, 1);
	}

	private static setVisible(visible: boolean) {
		InterfaceService.setInterfaceVisible('AuthInterface', visible);
		InterfaceService.setCursorVisible(visible, visible);
		mp.game.ui.displayHud(!visible);
		mp.game.ui.displayRadar(!visible);
	}

	private static hideLoginPanel(hasCharacter: boolean) {
		this.setVisible(false);

        if (!hasCharacter) {
            CharacterCreator.setVisible(true);
            return;
        }

		SpawnPanel.setVisible(true);
	}
}
