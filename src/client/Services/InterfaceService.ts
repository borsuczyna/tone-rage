import Logger from '@shared/Logger';
import TimerService from '@shared/Services/TimerService';

export default class InterfaceService {
	private static browser: BrowserMp = null!;
	private static logger: Logger = Logger.getLogger(InterfaceService);
	private static cursorVisible: boolean = false;
	private static cursorToggleControls: boolean = false;

	public static init() {
		this.browser = mp.browsers.new('package://ui/index.html');
		if (!this.browser) {
			this.logger.error('Failed to initialize interface: Browser instance is null');
			return;
		}

		this.logger.info('Interface initialized successfully');

		// Bind F3 key for cursor toggle
		this.setupCursorToggle();

		// Set timer to update cursor state
		TimerService.setTimer(this.updateCursor.bind(this), 500, 0);
	}

	public static callInterfaceEvent(eventName: string, data: any) {
		if (!this.browser) {
			this.logger.error(`Cannot call interface event "${eventName}": Browser instance is null`);
			return;
		}

		this.browser.call(eventName, JSON.stringify(data));
	}

	public static setInterfaceVisible(name: string, visible: boolean) {
		if (!this.browser) {
			this.logger.error('Cannot set interface visibility: Browser instance is null');
			return;
		}

		this.browser.call('setInterfaceVisible', name, visible);
	}

	public static toggleInterfaceVisibility(name: string) {
		if (!this.browser) {
			this.logger.error('Cannot toggle interface visibility: Browser instance is null');
			return;
		}

		this.browser.call('toggleInterfaceVisibility', name);
	}

	private static setupCursorToggle() {
		mp.keys.bind(0x72, true, () => {
			this.toggleCursor();
		});
	}

	public static toggleCursor() {
		this.setCursorVisible(!this.cursorVisible, false);
	}

	public static isCursorVisible(): boolean {
		return this.cursorVisible;
	}

	public static setCursorVisible(visible: boolean, toggleControls: boolean = false) {
		this.cursorVisible = visible;
		this.cursorToggleControls = toggleControls;
		this.updateCursor();
	}

	private static updateCursor() {
		mp.gui.cursor.show(this.cursorToggleControls, this.cursorVisible);
	}
}
