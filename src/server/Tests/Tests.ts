import Chat from '@/Features/Chat/Chat';
import CommandService from '@/Services/Infrastructure/CommandService';
import Logger from '@shared/Logger';

export default class Tests {
    private static logger: Logger = Logger.getLogger(Tests);

    public static async getPositionCommandTest() {
        CommandService.registerCommandHandler({
            command: '/getpos',
            description: 'Get the current position of the player',
        }, (player: PlayerMp) => {
            const position = player.position;
            Tests.logger.info(`Player Position - X: ${position.x}, Y: ${position.y}, Z: ${position.z}`);
            Chat.outputChatMessage(player, 'Position', `Your current position is X: ${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}`);
        });
    }

    public static async createVehicleCommandTest() {
        CommandService.registerCommandHandler({
            command: '/x',
            description: 'Spawn a vehicle',
            params: [{ type: 'rest', name: 'model' }]
        },
        (player: PlayerMp, ...args: string[]) => {
            const model = args.join(' ') || 'adder';
            const hash = model.startsWith('0x') ? parseInt(model, 16) : mp.joaat(model);

            const vehicle = mp.vehicles.new(hash, player.position, {
                heading: player.heading,
                numberPlate: 'TEST',
                dimension: player.dimension
            });
            vehicle.engine = false;
            Tests.logger.info(`Created vehicle with model: ${model} for player: ${player.name}`);

            player.notify(`Vehicle ${model} created!`);
            player.putIntoVehicle(vehicle, 0);
        });

        // weapon command
        CommandService.registerCommandHandler({
            command: '/w',
            description: 'Give a weapon to the player',
            params: [{ type: 'rest', name: 'weapon' }],
        },
        (player: PlayerMp, ...args: string[]) => {
            const weapon = args.join(' ') || 'WEAPON_PISTOL';
            const hash = mp.joaat(weapon);
            player.giveWeapon(hash, 9999);
            Tests.logger.info(`Gave weapon ${weapon} to player: ${player.name}`);
            player.notify(`Weapon ${weapon} given!`);
        });
    }

    public static async createTimeCommandTest() {
        CommandService.registerCommandHandler({
            command: '/time',
            description: 'Set the game time',
            params: [
                { type: 'number', name: 'hours' },
                { type: 'number', name: 'minutes' }
            ],
        },
        (player: PlayerMp, hoursStr: string, minutesStr: string) => {
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
