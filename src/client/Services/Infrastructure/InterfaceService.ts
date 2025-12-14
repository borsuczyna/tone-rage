import Logger from '@shared/Logger';
import TimerService from '@shared/Services/TimerService';
import { chunkData, ChunkAssembler, DataChunk } from '@shared/ChunkingUtils';
import { cursors } from '@/Models/Cursor';

export default class InterfaceService {
	private static browser: BrowserMp = null!;
	private static logger: Logger = Logger.getLogger(InterfaceService);
	private static cursorVisible: boolean = false;
	private static cursorToggleControls: boolean = false;
	private static chunkAssembler: ChunkAssembler = new ChunkAssembler();
	private static visibleInterfaces: Set<string> = new Set<string>();

	public static init() {
		this.browser = mp.browsers.new('package://ui/index.html');
		if (!this.browser) {
			this.logger.error('Failed to initialize interface: Browser instance is null');
			return;
		}

		this.logger.info('Interface initialized successfully');

		// Setup chunk event handlers for receiving chunked data from browser
		mp.events.add('interface:chunk', this.onChunkReceived.bind(this));

		// Bind F3 key for cursor toggle
		this.setupCursorToggle();

        // Register custom cursors
        this.registerCursors();

		// Set timer to update cursor state
		TimerService.setTimer(this.updateCursor.bind(this), 500, 0);
	}

    private static registerCursors() {
        for (const cursor of cursors) {
            const offset = cursor.offset || [0, 0];
            mp.gui.cursor.registerCustomIcon(cursor.type, cursor.path, offset[0], offset[1]);
        }
    }

	public static callInterfaceEvent(eventName: string, data: any) {
		if (!this.browser) {
			this.logger.error(`Cannot call interface event "${eventName}": Browser instance is null`);
			return;
		}

		const jsonData = JSON.stringify(data);
		const chunks = chunkData(jsonData);
		chunks.forEach((chunk) => {
			this.browser.call('event:chunk', eventName, JSON.stringify(chunk));
		});
	}

	public static setInterfaceVisible(name: string, visible: boolean) {
		if (!this.browser) {
			this.logger.error('Cannot set interface visibility: Browser instance is null');
			return;
		}

		this.browser.call('setInterfaceVisible', name, visible);

		if (visible) {
			this.visibleInterfaces.add(name);
		} else {
			this.visibleInterfaces.delete(name);
		}
	}

	public static isInterfaceVisible(name: string): boolean {
		return this.visibleInterfaces.has(name);
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

	private static onChunkReceived(eventName: string, chunkData: string) {
		const chunk: DataChunk = JSON.parse(chunkData);
		const completeData = this.chunkAssembler.addChunk(chunk);

		if (completeData) {
			// All chunks received, trigger the original event
			const data = JSON.parse(completeData);
			const eventHandler = (mp.events as any).events[eventName];
			if (eventHandler) {
				eventHandler.apply(null, [data]);
			} else {
				this.logger.warn(`No handler found for event: ${eventName}`);
			}
		}
	}
}
