import InterfaceService from '@/Services/Infrastructure/InterfaceService';
import EventService from '@/Services/Infrastructure/EventService';
import FetchService from '@/Services/Infrastructure/FetchService';
import { InteractionWheelConfig, InteractionWheelResponse } from '@shared/Models/InteractionWheel';

export interface InteractionWheelItem {
	name: string;
	icon: string;
	color?: string;
	callback: () => void;
}

export default class InteractionWheelFeature {
	private static isVisible: boolean = false;
	private static currentInteractions: InteractionWheelItem[] = [];
	private static currentConfig: InteractionWheelConfig = {};

	public static init() {
		// Listen for selection events from the interface
		EventService.registerEventHandler('interactionWheel:onSelect', this.onInteractionSelected.bind(this));
		EventService.registerEventHandler('interactionWheel:onClose', this.onWheelClosed.bind(this));
		FetchService.registerFetchListener('interactionWheel:getInteractions', this.getInteractions.bind(this));

		// Register test command
		this.registerTestCommand();
	}

	/**
	 * Show the interaction wheel with given items
	 * @param items Array of interaction items with name, icon, color, and callback
	 * @param config Optional configuration for title/subtitle
	 */
	public static showInteractionWheel(items: InteractionWheelItem[], config: InteractionWheelConfig) {
		if (this.isVisible) {
			this.hideInteractionWheel();
		}

		// Clear previous interactions
		this.currentInteractions = items;
		this.currentConfig = config;

		// Show the interface and cursor
		InterfaceService.setInterfaceVisible('InteractionWheelInterface', true);
		InterfaceService.setCursorVisible(true, false);

		this.isVisible = true;
	}

	/**
	 * Hide the interaction wheel
	 */
	public static hideInteractionWheel() {
		if (!this.isVisible) return;

		// Trigger hide animation
		InterfaceService.callInterfaceEvent('interactionWheel:hide', null);
		InterfaceService.setCursorVisible(false, false);

		this.isVisible = false;
	}

	/**
	 * Check if the wheel is currently visible
	 */
	public static isWheelVisible(): boolean {
		return this.isVisible;
	}

	private static getInteractions(): InteractionWheelResponse {
		return {
			interactions: this.currentInteractions.map((item, index) => ({
				id: index.toString(),
				label: item.name,
				icon: item.icon,
				color: item.color
			})),
			config: this.currentConfig
		};
	}

	/**
	 * Handle selection event from interface
	 */
	private static onInteractionSelected(data: { id: string }) {
		const interaction = this.currentInteractions[parseInt(data.id)];

		if (interaction) {
			// Execute the callback
			try {
				interaction.callback();
			} catch (error) {
				mp.console.logError(`InteractionWheel callback error: ${error}`);
			}
		}

		// Hide the wheel after selection
		this.hideInteractionWheel();
	}

	/**
	 * Handle wheel closed event (e.g., user pressed escape or clicked outside)
	 */
	private static onWheelClosed() {
		this.isVisible = false;
		this.currentInteractions = [];
		InterfaceService.setCursorVisible(false, false);
	}

	/**
	 * Register test command for development
	 */
	private static registerTestCommand() {
		mp.events.add('playerCommand', (command: string) => {
			const args = command.split(' ');
			const commandName = args[0].toLowerCase();

			if (commandName === 'wheel' || commandName === 'testwheel') {
				this.showTestWheel();
			}
		});
	}

	/**
	 * Show a test wheel with sample interactions
	 */
	private static showTestWheel() {
		const testInteractions: InteractionWheelItem[] = [
			{
				name: 'Toggle Engine',
				icon: 'Power',
				color: '#ef4444',
				callback: () => {
					mp.gui.chat.push('Engine toggled!');
				}
			},
			{
				name: 'Toggle Headlights',
				icon: 'Lightbulb',
				color: '#3b82f6',
				callback: () => {
					mp.gui.chat.push('Headlights toggled!');
				}
			},
			{
				name: 'Lock Vehicle',
				icon: 'Lock',
				color: '#f59e0b',
				callback: () => {
					mp.gui.chat.push('Vehicle locked!');
				}
			},
			{
				name: 'Open Trunk',
				icon: 'DoorOpen',
				color: '#10b981',
				callback: () => {
					mp.gui.chat.push('Trunk opened!');
				}
			},
			{
				name: 'Toggle Radio',
				icon: 'Radio',
				color: '#8b5cf6',
				callback: () => {
					mp.gui.chat.push('Radio toggled!');
				}
			},
			{
				name: 'Hazard Lights',
				icon: 'TriangleAlert',
				color: '#ef4444',
				callback: () => {
					mp.gui.chat.push('Hazard lights toggled!');
				}
			}
		];

		this.showInteractionWheel(testInteractions, {
			title: 'VEHICLE',
			subtitle: 'CONTROLS'
		});

		mp.gui.chat.push('Interaction wheel opened! Click on an option to select it.');
	}
}
