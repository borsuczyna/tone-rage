import ElementDataService from "@/Services/ElementDataService";
import EventService from "@/Services/EventService";
import InterfaceService from "@/Services/InterfaceService";
import KeyboardService from "@/Services/KeyboardService";
import EmblemaService from "@shared-rage/Services/EmblemaService";
import { Emblema } from "@shared/Models/Emblema";
import { parseRichText } from "@shared/Models/RichTextModels";
import CommandSnippetService from "@/Services/CommandSnippetService";

export default class Chat {
    public static visible: boolean = false;
    public static chatInputOpen: boolean = false;

    public static init() {
        this.setVisible(false);
        KeyboardService.registerKeyHandler('T', this.openChatInput.bind(this));
        EventService.registerEventHandler('chat:sendMessage', this.onChatMessageSend.bind(this));
        EventService.registerEventHandler('chat:closeChatInput', this.onChatInputClose.bind(this));
        EventService.registerEventHandler('chat:receiveMessage', this.onChatMessageReceive.bind(this));
        
        // Register example command snippets
        this.registerDefaultCommands();
    }

    private static registerDefaultCommands() {
        CommandSnippetService.registerSnippets([
            {
                command: 'pm',
                description: 'Send a private message to a player',
                parameters: [
                    { name: 'player', type: 'player' },
                    { name: 'id', type: 'number' },
                    { name: 'message', type: 'rest' }
                ]
            },
            {
                command: 'me',
                description: 'Describe an action',
                parameters: [
                    { name: 'action', type: 'rest' }
                ]
            },
            {
                command: 'do',
                description: 'Describe a situation',
                parameters: [
                    { name: 'description', type: 'rest' }
                ]
            },
            {
                command: 'b',
                description: 'Out of character chat',
                parameters: [
                    { name: 'message', type: 'rest' }
                ]
            },
            {
                command: 'help',
                description: 'Get help with commands',
                parameters: []
            },
            {
                command: 'give',
                description: 'Give an item to a player',
                parameters: [
                    { name: 'player_id', type: 'number' },
                    { name: 'item', type: 'string' },
                    { name: 'amount', type: 'number' }
                ]
            }
        ]);

        // Send snippets to UI
        InterfaceService.callInterfaceEvent('chat:setCommandSnippets', CommandSnippetService.getSnippets());
    }
    
    public static setVisible(visible: boolean) {
        mp.gui.chat.show(false);

        if (visible) {
            if (
                InterfaceService.isInterfaceVisible('ScoreboardInterface') ||
                InterfaceService.isInterfaceVisible('InteractionWheelInterface') ||
                InterfaceService.isInterfaceVisible('AtmInterface')
            ) {
                return;
            }
        }

        this.visible = visible;
        InterfaceService.setInterfaceVisible('ChatInterface', visible);
    }

    private static openChatInput() {
        if (this.chatInputOpen || !this.visible) return;

        InterfaceService.setCursorVisible(true, true);
        this.chatInputOpen = true;
        InterfaceService.callInterfaceEvent('chat:openChatInput', '');
    }

    private static onChatInputClose() {
        InterfaceService.setCursorVisible(false, false);
        this.chatInputOpen = false;
    }

    private static onChatMessageSend(message: string) {
        InterfaceService.setCursorVisible(false, false);
        this.chatInputOpen = false;
        EventService.triggerServerEvent('chat:sendMessage', message);
    }

    private static onChatMessageReceive(ownerId: number | string, message: string) {
        const owner = typeof ownerId === 'number' ? mp.players.at(ownerId) : ownerId;
        const avatar = typeof owner === 'string' ? '' : (ElementDataService.get(owner, 'avatar') || '');
        const username = typeof owner === 'string' ? owner : owner.name;
        let emblemas: Emblema[] = [];

        if (typeof owner !== 'string') {
            const adminLevel = ElementDataService.get(owner, 'adminLevel') || 0;
            emblemas = EmblemaService.getPlayerEmblems(owner, adminLevel);
        }
      
        InterfaceService.callInterfaceEvent('chat:receiveMessage', {
            avatar: avatar,
            username: username,
            messages: [parseRichText(message)],
            emblemas: emblemas
        });
    }
}