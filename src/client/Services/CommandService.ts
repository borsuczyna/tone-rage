import { CommandData, type CommandSnippet } from '@shared/Models/CommandSnippets';
import EventService from './EventService';
import Chat from '@/Features/Chat/Chat';

export default class CommandService {
    private static commands: Map<string, CommandData> = new Map();

    public static async init() {
        this.registerCommandHandler({
            command: '/help',
            description: 'Show available commands'
        }, (/* player: PlayerMp */) => {
            Chat.outputChatMessage('Command system', 'Help command executed on client.');
        });

        EventService.registerEventHandler('commandService:initializeCommands', this.registerCommandsFromServer.bind(this));
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

    private static registerCommandsFromServer(commandSnippets: CommandSnippet[]) {
        for (const snippet of commandSnippets) {
            if (!this.commands.has(snippet.command.toLowerCase())) {
                this.commands.set(snippet.command.toLowerCase(), {
                    snippet: snippet,
                    listeners: []
                });
            }
        }
    }

    public static getCommandSnippets(): CommandSnippet[] {
        return Array.from(this.commands.values()).map(cmdData => cmdData.snippet);
    }

    public static executeCommand(commandLine: string) {
        const parts = commandLine.split(' ');
        const commandName = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (this.commands.has(commandName)) {
            const commandData = this.commands.get(commandName)!;
            for (const listener of commandData.listeners) {
                listener(...args);
            }
        }

        EventService.triggerServerEvent('commandService:executeCommand', commandLine);
    }
}