import InterfaceService from "@/Services/Infrastructure/InterfaceService";
import KeyboardService, { KeyState } from "@/Services/Utility/KeyboardService";
import Chat from "../Chat/Chat";
import EventService from "@/Services/Infrastructure/EventService";
import ElementDataService from "@/Services/Infrastructure/ElementDataService";
import TimerService from "@shared/Services/TimerService";
import DrawingService from "@/Services/Rendering/DrawingService";
import { WorldInteractionHandler, WorldInteractionHandlerWithIndex, WorldInteractionListener } from "@shared-rage/Models/WorldInteractionListener";
import { WorldInteractionItem } from "@shared/Models/WorldInteraction";

export default class WorldInteraction {
    private static worldInteractionListeners: WorldInteractionListener[] = [];
    private static worldInteractions: WorldInteractionHandler[] = [];
    private static activeWorldInteraction: WorldInteractionHandlerWithIndex[] = [];
    private static hiding: boolean = false;
    private static ready: boolean = false;
    private static overlayBatch: EntityOverlayBatch = null!;
    private static activeOverlayBatch: EntityOverlayBatch = null!;
    private static latestClosestEntity: EntityMp | null = null;

    public static init() {
        KeyboardService.registerKeyHandler('Shift', this.toggleWorldInteraction.bind(this));
        KeyboardService.registerKeyHandler('E', this.toggleWorldInteraction.bind(this));
        EventService.registerEventHandler('worldInteraction:onSelect', this.onInteractionSelected.bind(this));
        EventService.registerEventHandler('worldInteraction:isReady', this.onInterfaceReady.bind(this));
        TimerService.setTimer(this.updateInteractionPosition.bind(this), 50, 0);
        TimerService.setTimer(this.updateInteractions.bind(this), 500, 0);

        this.createOverlayBatch();

        mp.events.add('render', this.onRender.bind(this));
    }

    private static createOverlayBatch() {
        const overlayParams: EntityOverlayParams = {
            enableDepth: true,
            deleteWhenUnused: false,
            keepNonBlurred: true,
            processAttachments: true,
            fill: { enable: true, color: 0x407cff44 },
            noise: { enable: false, size: 0.0, speed: 0.0, intensity: 0.0 },
            outline: { enable: true, color: 0x407cffAA, width: 1.0, blurRadius: 0, blurIntensity: 0 },
            wireframe: { enable: false }
        };

        const activeOverlayParams = {...overlayParams, fill: { enable: true, color: 0xaf40ff44 }, outline: { enable: true, color: 0xaf40ffAA, width: 1.5, blurRadius: 0, blurIntensity: 0 } };

        mp.game.graphics.setEntityOverlayPassEnabled(true);
        this.overlayBatch = mp.game.graphics.createEntityOverlayBatch(overlayParams);
        this.activeOverlayBatch = mp.game.graphics.createEntityOverlayBatch(activeOverlayParams);
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
            // if (this.worldInteractions.length === 0) return;

            InterfaceService.setInterfaceVisible('WorldInteractionInterface', true);
            InterfaceService.setCursorVisible(true, false);
            this.latestClosestEntity = null;
            this.ready = false;
        } else if (state === KeyState.Up && InterfaceService.isInterfaceVisible('WorldInteractionInterface')) {
            InterfaceService.callInterfaceEvent('worldInteraction:playHideAnimation', null);
            InterfaceService.setCursorVisible(false, false);
            TimerService.setTimer(this.finallyHideInterface.bind(this), 200, 1);
            this.hiding = true;
        }
    }

    private static onInteractionSelected(index: number) {
        const interaction = this.activeWorldInteraction.find(i => i.index === index);
        if (!interaction) return;

        interaction.action();
        TimerService.setTimer(this.finallyHideInterface.bind(this), 200, 1);
        this.hiding = true;
    }

    private static onInterfaceReady() {
        this.ready = true;
    }

    private static finallyHideInterface() {
        InterfaceService.setInterfaceVisible('WorldInteractionInterface', false);
        InterfaceService.setCursorVisible(false, false);
        this.hiding = false;
    }

    private static updateInteractionPosition() {
        if (!InterfaceService.isInterfaceVisible('WorldInteractionInterface') || !this.latestClosestEntity) {
            return;
        }
        
        const interactionPos = this.latestClosestEntity?.position;
        const screenPos = DrawingService.getScreenFromWorldPosition(interactionPos);
        if (!screenPos) {
            return;
        }

        InterfaceService.callInterfaceEvent('worldInteraction:updatePosition', screenPos);
    }

    private static updateInteractions() {
        this.worldInteractions = this.getWorldInteractions();

        // if closest entity is no longer valid, clear it
        if (this.latestClosestEntity && !this.worldInteractions.find(interaction => interaction.entity === this.latestClosestEntity)) {
            this.latestClosestEntity = null;
            this.updateInterfaceInteractions();
        }
    }

    private static onRender() {
        if (!InterfaceService.isInterfaceVisible('WorldInteractionInterface') || !this.ready) {
            return;
        }

        const screenSize = DrawingService.getScreenResolution();
        const playerPos = mp.players.local.position;
        const zoom = screenSize.width / 1920;
        const diamondSize = zoom * 20;
        const [centerX, centerY] = [screenSize.width / 2, screenSize.height / 2];
        const closestEntity: [number, EntityMp | null] = [screenSize.width / 2, null];
        const entityScreenPositions: Map<EntityMp, { x: number; y: number }> = new Map();

        const entities = [...new Set(this.worldInteractions.map(interaction => interaction.entity))];
        entities.forEach(entity => {
            const position = entity.position;
            const screenPos = DrawingService.getScreenFromWorldPosition(position);
            if (screenPos) {
                entityScreenPositions.set(entity, screenPos);

                const worldDistance = playerPos.subtract(position).length();
                if (worldDistance > 5) return;

                const distance = Math.hypot(screenPos.x - centerX, screenPos.y - centerY);
                if (distance < closestEntity[0]) {
                    closestEntity[0] = distance;
                    closestEntity[1] = entity;
                }
            }
        });

        if (closestEntity[1]) {
            if (this.latestClosestEntity !== closestEntity[1]) {
                this.latestClosestEntity = closestEntity[1];
                this.updateInterfaceInteractions();
            }
        } else {
            this.latestClosestEntity = null;
            this.updateInterfaceInteractions();
        }

        // Update overlays
        entities.forEach(entity => {
            if (entity === this.latestClosestEntity) {
                // @ts-ignore
                this.activeOverlayBatch.addThisFrame(entity);
            } else {
                // @ts-ignore
                this.overlayBatch.addThisFrame(entity);
                
                const screenPos = entityScreenPositions.get(entity);
                if (!screenPos) return;

                DrawingService.drawSprite(screenPos.x - diamondSize / 2, screenPos.y - diamondSize / 2, diamondSize, diamondSize, '/interaction/diamond.png', 100, 100);
            }
        });
    }

    private static updateInterfaceInteractions() {
        if (!InterfaceService.isInterfaceVisible('WorldInteractionInterface') || this.hiding) {
            return;
        }

        this.activeWorldInteraction = this.latestClosestEntity ? this.worldInteractions.map<WorldInteractionHandlerWithIndex>((interaction, index) => ({ ...interaction, index })).filter(interaction => interaction.entity === this.latestClosestEntity) : [];

        const interfaceInteractions: WorldInteractionItem[] = this.activeWorldInteraction?.map(interaction => ({
            icon: interaction.icon,
            label: interaction.label,
            index: interaction.index
        })) ?? [];

        InterfaceService.callInterfaceEvent('worldInteraction:updateInteractions', interfaceInteractions);
    }
}