import { CommandData, type CommandSnippet } from '@shared/Models/CommandSnippets';
import EventService from './EventService';

export default class CommandService {
    private static commands: Map<string, CommandData> = new Map();

    public static async init() {
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