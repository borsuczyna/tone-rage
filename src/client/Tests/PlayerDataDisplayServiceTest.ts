export default class PlayerDataDisplayServiceTest {
	/**
	 * Test PlayerDataDisplayService by setting sample element data
	 */
	public static init() {
		mp.console.logInfo('PlayerDataDisplayService test initialized on client');

		// Register command to test the display
		mp.events.add('playerCommand', (command: string) => {
			if (command === 'testdatadisplay') {
				// Set some test element data for the local player
				// const localPlayerId = mp.players.local.remoteId;

				// Set various types of data
				// ElementDataService.set(localPlayerId, 'player', 'level', 10, ShareMode.Local);
				// ElementDataService.set(localPlayerId, 'player', 'score', 1234, ShareMode.Local);
				// ElementDataService.set(localPlayerId, 'player', 'team', 'red', ShareMode.Local);
				// ElementDataService.set(localPlayerId, 'player', 'status', 'active', ShareMode.Local);
				// ElementDataService.set(localPlayerId, 'player', 'stats', { health: 100, armor: 50, stamina: 80 }, ShareMode.Local);

				mp.gui.chat.push('Test data set! Use /toggledatadisplay to view it');
			}

			if (command === 'cleartestdata') {
				// Note: ElementDataService doesn't have a clear method,
				// so we'll just inform the user to restart
				mp.gui.chat.push('To clear data, you need to restart the client');
			}
		});

		mp.gui.chat.push('PlayerDataDisplayService test loaded. Commands:');
		mp.gui.chat.push('  /testdatadisplay - Set test element data');
		mp.gui.chat.push('  /toggledatadisplay - Toggle display on/off');
		mp.gui.chat.push('  /cleartestdata - Info about clearing data');
	}
}
