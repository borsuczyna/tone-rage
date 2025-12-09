import FetchService from "@/Services/Infrastructure/FetchService";
import InterfaceService from "@/Services/Infrastructure/InterfaceService";
import NotificationService from "@/Services/Infrastructure/NotificationService";
import KeyboardService, { KeyState } from "@/Services/Utility/KeyboardService";
import { WorldInteractionHandler, WorldInteractionItem, WorldInteractionListener } from "@shared/Models/WorldInteraction";
import Chat from "../Chat/Chat";
import EventService from "@/Services/Infrastructure/EventService";
import ElementDataService from "@/Services/Infrastructure/ElementDataService";

export default class WorldInteractionFeature {
    private static worldInteractionListeners: WorldInteractionListener[] = [];
    private static worldInteractions: WorldInteractionHandler[] = [];

    public static init() {
        KeyboardService.registerKeyHandler('Shift', this.toggleWorldInteraction.bind(this));
        KeyboardService.registerKeyHandler('E', this.toggleWorldInteraction.bind(this));
        FetchService.registerFetchListener('worldInteraction:getInteractions', this.getInterfaceInteractions.bind(this));
        EventService.registerEventHandler('worldInteraction:onSelect', this.onInteractionSelected.bind(this));

        this.initTestInteractions();
    }

    public static registerWorldInteractionListener(listener: WorldInteractionListener) {
        this.worldInteractionListeners.push(listener);
    }

    public static removeWorldInteractionListener(listener: WorldInteractionListener) {
        this.worldInteractionListeners = this.worldInteractionListeners.filter(l => l !== listener);
    }
    
    public static getWorldInteractions() {
        const interactions = this.worldInteractionListeners
            .map(listener => listener())
            .flat()
            .filter((item): item is NonNullable<typeof item> => item !== null);

        // Sort by priority (higher priority first)
        interactions.sort((a, b) => (b.priority || 0) - (a.priority || 0));

        return interactions;
    }

    private static getInterfaceInteractions(): WorldInteractionItem[] {
        const interactions = this.worldInteractions.map(interaction => ({
            icon: interaction.icon,
            label: interaction.label,
        }));

        return interactions;
    }

    private static toggleWorldInteraction(state: KeyState) {
        if (state === KeyState.Down) {
            const userId = ElementDataService.get(mp.players.local, 'userId') as number;

            if (
                !userId ||
                mp.players.local.isDead() ||
                InterfaceService.isInterfaceVisible('AtmInterface') ||
                InterfaceService.isInterfaceVisible('ScoreboardInterface') ||
                Chat.chatInputOpen
            ) {
                return;
            }

            this.worldInteractions = this.getWorldInteractions();
            if (this.worldInteractions.length === 0) return;

            InterfaceService.setInterfaceVisible('WorldInteractionInterface', true);
        } else if (state === KeyState.Up && InterfaceService.isInterfaceVisible('WorldInteractionInterface')) {
            InterfaceService.setInterfaceVisible('WorldInteractionInterface', false);
        }
    }

    private static onInteractionSelected(index: number) {
        Chat.outputChatMessage('interaction', 'selected ' + index);
        const interaction = this.worldInteractions[index];
        if (!interaction) return;

        interaction.action();
        InterfaceService.setInterfaceVisible('WorldInteractionInterface', false);
    }

    private static initTestInteractions() {
        this.registerWorldInteractionListener(() => {
            return [
                {
                    icon: 'Hand',
                    label: 'Pick up item',
                    action: () => {
                        NotificationService.addNotification('info', 'World Interaction', 'You picked up an item!');
                    }
                },
                {
                    icon: 'Eye',
                    label: 'Examine object',
                    action: () => {
                        NotificationService.addNotification('info', 'World Interaction', 'You examined the object.');
                    },
                    priority: 999
                }
            ];
        });
    }
}