import CommandService from "@/Services/CommandService";
import ElementDataService from "@/Services/ElementDataService";
import EventService from "@/Services/EventService";
import InterfaceService from "@/Services/InterfaceService";
import KeyboardService from "@/Services/KeyboardService";
import EmblemaService from "@shared-rage/Services/EmblemaService";
import { Emblema } from "@shared/Models/Emblema";
import { parseRichText } from "@shared/Models/RichTextModels";

export default class Chat {
    public static visible: boolean = false;
    public static chatInputOpen: boolean = false;

    public static init() {
        this.setVisible(false);
        KeyboardService.registerKeyHandler('T', this.openChatInput.bind(this));
        EventService.registerEventHandler('chat:sendMessage', this.onChatMessageSend.bind(this));
        EventService.registerEventHandler('chat:closeChatInput', this.onChatInputClose.bind(this));
        EventService.registerEventHandler('chat:receiveMessage', this.onChatMessageReceive.bind(this));
    }
    
    public static setVisible(visible: boolean) {
        mp.gui.chat.show(false);

        this.visible = visible;
        InterfaceService.setInterfaceVisible('ChatInterface', visible);
    }

    private static openChatInput() {
        if (
            this.chatInputOpen ||
            !this.visible ||
            InterfaceService.isInterfaceVisible('ScoreboardInterface') ||
            InterfaceService.isInterfaceVisible('InteractionWheelInterface') ||
            InterfaceService.isInterfaceVisible('AtmInterface')
        ) {
            return;
        }

        InterfaceService.setCursorVisible(true, true);
        this.chatInputOpen = true;
        InterfaceService.callInterfaceEvent('chat:openChatInput', ['', CommandService.getCommandSnippets()]);
    }

    private static onChatInputClose() {
        InterfaceService.setCursorVisible(false, false);
        this.chatInputOpen = false;
    }

    private static onChatMessageSend(message: string) {
        InterfaceService.setCursorVisible(false, false);
        this.chatInputOpen = false;

        const trimmedMessage = message.trim();
        if (trimmedMessage[0] === '/') {
            CommandService.executeCommand(trimmedMessage);
            return;
        }

        EventService.triggerServerEvent('chat:sendMessage', message);
    }

    private static onChatMessageReceive(ownerId: number | string, message: string, emblemas: Emblema[] = [], overrideName?: string) {
        const owner = typeof ownerId === 'number' ? mp.players.at(ownerId) : ownerId;
        const avatar = typeof owner === 'string' ? '' : (ElementDataService.get(owner, 'avatar') || '');
        let username = typeof owner === 'string' ? owner : owner.name;
        emblemas = emblemas || [];

        if (typeof owner !== 'string') {
            const adminLevel = ElementDataService.get(owner, 'adminLevel') || 0;
            const newEmblemas = EmblemaService.getPlayerEmblems(owner, adminLevel);
            emblemas = emblemas.concat(newEmblemas);
        }

        if (overrideName) {
            username = overrideName;
        }
      
        InterfaceService.callInterfaceEvent('chat:receiveMessage', {
            avatar: avatar,
            username: username,
            messages: [parseRichText(message)],
            emblemas: emblemas
        });
    }

    public static outputChatMessage(owner: PlayerMp | string, message: string, emblemas: Emblema[] = [], overrideName?: string) {
        this.onChatMessageReceive(typeof owner === 'string' ? owner : owner.id, message, emblemas, overrideName);
    }
}