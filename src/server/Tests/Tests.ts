import UserService from '@/Features/User/UserService';
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
        mp.events.addCommand('x', (player: PlayerMp, fullText: string) => {
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

        // weapon command
        mp.events.addCommand('w', (player: PlayerMp, fullText: string) => {
            const weapon = fullText.trim() || 'WEAPON_PISTOL';
            const hash = mp.joaat(weapon);
            player.giveWeapon(hash, 9999);
            Tests.logger.info(`Gave weapon ${weapon} to player: ${player.name}`);
            player.notify(`Weapon ${weapon} given!`);
        });
    }

    public static async createTimeCommandTest() {
        mp.events.addCommand('time', (player: PlayerMp, fullText: string) => {
            const [hoursStr, minutesStr] = fullText.trim().split(' ');
            const hours = parseInt(hoursStr, 10);
            const minutes = parseInt(minutesStr, 10);

            if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                player.notify('Invalid time format. Use: /time <hours> <minutes>');
                return;
            }

            mp.world.time.set(hours, minutes, 0);
            Tests.logger.info(`Set game time to ${hours}:${minutes} by player: ${player.name}`);
            player.notify(`Game time set to ${hours}:${minutes}`);
        });
    }
}
