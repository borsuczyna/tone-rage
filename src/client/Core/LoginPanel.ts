import InterfaceService from '@/Services/InterfaceService';

export default class LoginPanel {
	public static async init() {
		InterfaceService.setInterfaceVisible('AuthInterface', true);
		InterfaceService.setCursorVisible(true, true);
	}
}
