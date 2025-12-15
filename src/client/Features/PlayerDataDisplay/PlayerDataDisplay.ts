import { NotificationType } from '@shared/Models/NotificationType';
import ElementDataService from '@/Services/Infrastructure/ElementDataService';
import NotificationService from '@/Services/Infrastructure/NotificationService';
import CommandService from '@/Services/Infrastructure/CommandService';

/**
 * PlayerDataDisplayService - Debug feature to display all element data above players in 3D
 */
export default class PlayerDataDisplay {
	/** Debug flag to control visibility */
	private static isEnabled: boolean = false;

	/**
	 * Initialize the service
	 */
	public static init() {
		// Register render event to display 3D text above players
		mp.events.add('render', this.onRender.bind(this));

		// Register debug command to toggle display
        CommandService.registerCommandHandler({
            command: '/toggledatadisplay',
            description: 'Toggle the player data display debug feature',
        }, this.toogleDataDisplay.bind(this));

		mp.console.logInfo('PlayerDataDisplayService initialized (debug mode - use /toggledatadisplay to enable)');
	}

    private static toogleDataDisplay() {
        this.isEnabled = !this.isEnabled;
        NotificationService.addNotification(
            NotificationType.Info,
            'Player Data Display',
            `Player data display: ${this.isEnabled ? 'enabled' : 'disabled'}`
        );
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
			const elementData = ElementDataService.getAll(player);

			// Skip if no data
			if (!elementData || elementData.size === 0) return;

			// Format data as key: value pairs
			const dataLines: string[] = [];
            dataLines.push(`Name: ${player.name} id: ${player.remoteId}`);
			elementData.forEach((value: any, key: string) => {
				// Convert value to string, handle objects/arrays
				let valueStr: string;
				if (typeof value === 'object' && value !== null) {
					try {
						valueStr = JSON.stringify(value);
					} catch (error) {
						// Handle circular references or non-serializable values
						valueStr = '[Object]';
					}
				} else {
					valueStr = String(value);
				}
				dataLines.push(`${key}: ${valueStr}`);
			});

			// Combine all lines with newline
			const text = dataLines.join('\n');

			// Display 3D text above player's head
			// Offset Z by 1.0 to position above the player
			mp.game.graphics.drawText(text, [pos.x, pos.y, pos.z + 1.0], {
				font: 4,
				color: [255, 255, 255, 255],
				scale: [0.5, 0.5],
				outline: true,
				centre: true
			});
		});
	}
}
