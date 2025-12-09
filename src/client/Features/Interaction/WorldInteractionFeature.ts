import FetchService from "@/Services/Infrastructure/FetchService";
import InterfaceService from "@/Services/Infrastructure/InterfaceService";
import KeyboardService, { KeyState } from "@/Services/Utility/KeyboardService";
import { WorldInteractionHandler, WorldInteractionItem, WorldInteractionListener } from "@shared/Models/WorldInteraction";
import Chat from "../Chat/Chat";
import EventService from "@/Services/Infrastructure/EventService";
import ElementDataService from "@/Services/Infrastructure/ElementDataService";
import TimerService from "@shared/Services/TimerService";
import DrawingService from "@/Services/Rendering/DrawingService";

export default class WorldInteractionFeature {
    private static worldInteractionListeners: WorldInteractionListener[] = [];
    private static worldInteractions: WorldInteractionHandler[] = [];
    private static hiding: boolean = false;

    public static init() {
        KeyboardService.registerKeyHandler('Shift', this.toggleWorldInteraction.bind(this));
        KeyboardService.registerKeyHandler('E', this.toggleWorldInteraction.bind(this));
        FetchService.registerFetchListener('worldInteraction:getInteractions', this.getInterfaceInteractions.bind(this));
        EventService.registerEventHandler('worldInteraction:onSelect', this.onInteractionSelected.bind(this));
        TimerService.setTimer(this.updateInteractionPosition.bind(this), 50, 0);
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
            const spawnPosition = ElementDataService.get(mp.players.local, 'spawnPosition') as number;

            if (
                this.hiding ||
                !spawnPosition ||
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
            InterfaceService.callInterfaceEvent('worldInteraction:playHideAnimation', null);
            TimerService.setTimer(this.finallyHideInterface.bind(this), 200, 1);
            this.hiding = true;
        }
    }

    private static onInteractionSelected(index: number) {
        const interaction = this.worldInteractions[index];
        if (!interaction) return;

        interaction.action();
        TimerService.setTimer(this.finallyHideInterface.bind(this), 200, 1);
        this.hiding = true;
    }

    private static finallyHideInterface() {
        InterfaceService.setInterfaceVisible('WorldInteractionInterface', false);
        this.hiding = false;
    }

    private static updateInteractionPosition() {
        if (!InterfaceService.isInterfaceVisible('WorldInteractionInterface')) {
            return;
        }
        
        const playerPos = mp.players.local.position;
        const screenPos = DrawingService.getScreenFromWorldPosition(playerPos);
        if (!screenPos) {
            return;
        }

        InterfaceService.callInterfaceEvent('worldInteraction:updatePosition', screenPos);
    }
}