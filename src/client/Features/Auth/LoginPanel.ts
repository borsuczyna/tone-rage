import EventService from '@/Services/Infrastructure/EventService';
import InterfaceService from '@/Services/Infrastructure/InterfaceService';
import SpawnPanel from '@/Features/Spawn/SpawnPanel';
import TimerService from '@shared/Services/TimerService';

export default class LoginPanel {
	public static async init() {
		this.setVisible(true);
		EventService.registerEventHandler('auth:loginSuccess', this.handleLoginSuccess.bind(this));
	}

	private static handleLoginSuccess() {
		TimerService.setTimer(this.hideLoginPanel.bind(this), 400, 1);
	}

	private static setVisible(visible: boolean) {
		InterfaceService.setInterfaceVisible('AuthInterface', visible);
		InterfaceService.setCursorVisible(visible, visible);
		mp.game.ui.displayHud(!visible);
		mp.game.ui.displayRadar(!visible);
	}

	private static hideLoginPanel() {
		this.setVisible(false);
		SpawnPanel.setVisible(true);
	}
}
