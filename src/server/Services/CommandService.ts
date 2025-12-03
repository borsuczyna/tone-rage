import { CommandData, type CommandSnippet } from '@shared/Models/CommandSnippets';
import EventService from './EventService';
import Chat from '@/Features/Chat/Chat';
import NotificationService from './NotificationService';
import { NotificationType } from '@shared/Models/NotificationType';

export default class CommandService {
    private static commands: Map<string, CommandData> = new Map();

    public static async init() {
        this.registerCommandHandler({
            command: '/help',
            description: 'Show available commands'
        }, (player: PlayerMp) => {
            console.log(`Player ${player.name} requested help command.`);
            Chat.outputChatMessage(player, 'Command system', 'Help command executed on server.');
        });

        this.registerCommandHandler({
            command: '/dance',
            description: 'Make your character dance'
        }, (player: PlayerMp) => {
            console.log(`Player ${player.name} is dancing!`);
        });

        this.registerCommandHandler({
            command: '/wave',
            description: 'Make your character wave'
        }, (player: PlayerMp) => {
            console.log(`Player ${player.name} is waving!`);
        });

        this.registerCommandHandler({
            command: '/pm',
            description: 'Send a private message to another player',
            params: [
                { name: 'Player name', type: 'string' },
                { name: 'Message', type: 'string' }
            ]
        }, (player: PlayerMp, targetPlayerName?: string, ...messageParts: string[]) => {
            if (!targetPlayerName) {
                NotificationService.addNotification(player, NotificationType.Error, 'Private message', 'You must specify a player name.');
                return;
            }

            const targetPlayer = mp.players.toArray().find(p => p.name.toLowerCase() === targetPlayerName.toLowerCase());
            if (!targetPlayer) {
                NotificationService.addNotification(player, NotificationType.Error, 'Private message', `Player "${targetPlayerName}" not found.`);
                return;
            }

            let message = '';
            try { message = messageParts.join(' ') } catch {}

            if (message.trim().length === 0) {
                NotificationService.addNotification(player, NotificationType.Error, 'Private message', 'Message cannot be empty.');
                return;
            }

            Chat.outputChatMessage(player, targetPlayer, message, ['dm-forward'], `PM to ${targetPlayer.name}`);
            Chat.outputChatMessage(targetPlayer, player, message, ['dm-reply'], `PM from ${player.name}`);
        });

        this.registerCommandHandler({
            command: '/time',
            description: 'Set the in-game time',
            params: [
                { name: 'Hour', type: 'number' },
                { name: 'Minute', type: 'number' }
            ]
        }, (player: PlayerMp, hourStr?: string, minuteStr?: string) => {
            const hour = hourStr ? parseInt(hourStr) : NaN;
            const minute = minuteStr ? parseInt(minuteStr) : NaN;
            if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
                NotificationService.addNotification(player, NotificationType.Error, 'Time Command', 'Invalid time format. Use /time [hour] [minute]');
                return;
            }

            mp.world.time.set(hour, minute, 0);
            Chat.outputChatMessage(player, 'Time system', `In-game time set to ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}.`);
        });

        mp.events.add('playerJoin', this.onPlayerJoin.bind(this));
        EventService.registerEventHandler('commandService:executeCommand', this.executeCommand.bind(this));
    }

    public static registerCommandHandler(command: CommandSnippet, callback: Function) {
        const commandName = command.command.toLowerCase();
        if (this.commands.has(commandName)) {
            const commandData = this.commands.get(commandName)!;
            commandData.listeners.push(callback);
        } else {
            this.commands.set(commandName, {
                snippet: command,
                listeners: [callback]
            });
        }
    }

    private static onPlayerJoin(player: PlayerMp) {
        EventService.triggerClientEvent(player, 'commandService:initializeCommands', Array.from(this.commands.values()).map(cmdData => cmdData.snippet));
    }

    public static executeCommand(player: PlayerMp, commandLine: string) {
        const parts = commandLine.split(' ');
        const commandName = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (this.commands.has(commandName)) {
            const commandData = this.commands.get(commandName)!;
            for (const listener of commandData.listeners) {
                listener(player, ...args);
            }
        }
    }
}