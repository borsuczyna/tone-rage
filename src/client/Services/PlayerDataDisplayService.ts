import ElementDataService from './ElementDataService';

/**
 * PlayerDataDisplayService - Debug feature to display all element data above players in 3D
 */
export default class PlayerDataDisplayService {
	/** Debug flag to control visibility */
	private static isEnabled: boolean = false;

	/**
	 * Initialize the service
	 */
	public static init() {
		// Register render event to display 3D text above players
		mp.events.add('render', this.onRender.bind(this));

		// Register debug command to toggle display
		mp.events.add('playerCommand', this.onCommand.bind(this));

		mp.console.logInfo('PlayerDataDisplayService initialized (debug mode - use /toggledatadisplay to enable)');
	}

	/**
	 * Handle player commands
	 */
	private static onCommand(command: string) {
		if (command === 'toggledatadisplay') {
			this.isEnabled = !this.isEnabled;
			mp.gui.chat.push(`Player data display: ${this.isEnabled ? 'enabled' : 'disabled'}`);
		}
	}

	/**
	 * Render handler - called every frame
	 */
	private static onRender() {
		// Skip rendering if debug display is disabled
		if (!this.isEnabled) return;

		// Get all players in the world
		mp.players.forEachInStreamRange((player: PlayerMp) => {
			// Skip if player is invalid
			if (!player || !player.handle) return;

			// Get player's position
			const pos = player.position;

			// Get all element data for this player
			const elementData = ElementDataService.getAll(player.remoteId);

			// Skip if no data
			if (!elementData || elementData.size === 0) return;

			// Format data as key: value pairs
			const dataLines: string[] = [];
			elementData.forEach((value: any, key: string) => {
				// Convert value to string, handle objects/arrays
				let valueStr: string;
				if (typeof value === 'object' && value !== null) {
					valueStr = JSON.stringify(value);
				} else {
					valueStr = String(value);
				}
				dataLines.push(`${key}: ${valueStr}`);
			});

			// Combine all lines with newline
			const text = dataLines.join('\n');

			// Display 3D text above player's head
			// Offset Y by 1.0 to position above the player
			mp.game.graphics.drawText(text, [pos.x, pos.y, pos.z + 1.0], {
				font: 4,
				color: [255, 255, 255, 255],
				scale: [0.35, 0.35],
				outline: true,
				centre: true
			});
		});
	}
}
