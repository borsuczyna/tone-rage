import EventService from '@/Services/EventService';
import InterfaceService from '@/Services/InterfaceService';

export default class LoginPanel {
	public static async init() {
		InterfaceService.setInterfaceVisible('AuthInterface', true);
		InterfaceService.setCursorVisible(true, true);

		EventService.registerEventHandler('user:finishAuthentication', this.onFinishAuthentication.bind(this));
	}

	private static async onFinishAuthentication() {
		InterfaceService.setInterfaceVisible('AuthInterface', false);
		InterfaceService.setCursorVisible(false, false);
	}
}
