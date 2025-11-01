import InterfaceService from '../Services/InterfaceService';

export default class InterfaceServiceTest {
	public static init() {
		mp.events.add('playerCommand', (command: string) => {
			const args = command.split(' ');
			const commandName = args[0].toLowerCase();

			if (commandName === 'uiv') {
				if (!args[1]) {
					mp.gui.chat.push('Usage: /uiv <interfaceName>');
					return;
				}

				InterfaceService.toggleInterfaceVisibility(args[1]);
				mp.gui.chat.push(`Toggled visibility of interface: ${args[1]}`);
				return;
			} else if (commandName === 'test') {
				if (!args[1]) {
					mp.gui.chat.push('Usage: /test <value>');
					return;
				}

				const value = parseInt(args[1], 10);
				InterfaceService.callInterfaceEvent('testEvent', value);
				mp.gui.chat.push(`Sent testEvent with value: ${value}`);
				return;
			}
		});
	}
}
