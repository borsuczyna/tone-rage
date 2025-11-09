import UserService from '@/Services/UserService';
import Logger from '@shared/Logger';

export default class Tests {
	private static logger: Logger = Logger.getLogger(Tests);

	public static async createUserTest() {
		const userId = await UserService.createUser('johndoe', 'johndoe@example.com', 'password123');
		Tests.logger.info('Create user result:', userId);
	}

	public static async getPositionCommandTest() {
		mp.events.addCommand('getpos', (player: PlayerMp) => {
			const position = player.position;
			Tests.logger.info(`Player Position - X: ${position.x}, Y: ${position.y}, Z: ${position.z}`);
		});
	}

    public static async createVehicleCommandTest() {
        mp.events.addCommand('createveh', (player: PlayerMp, fullText: string) => {
            const model = fullText.trim() || 'adder';
            const hash = mp.joaat(model);
            
            const vehicle = mp.vehicles.new(hash, player.position, {
                heading: player.heading,
                numberPlate: 'TEST',
                dimension: player.dimension
            });
            Tests.logger.info(`Created vehicle with model: ${model} for player: ${player.name}`);

            player.notify(`Vehicle ${model} created!`);
            player.putIntoVehicle(vehicle, 0);
        });
    }
}
