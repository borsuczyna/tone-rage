import EventService from './EventService';
import Logger from '@shared/Logger';

/**
 * Blip sprite IDs for RAGE MP
 * Reference: https://wiki.rage.mp/index.php?title=Blips
 */
export enum BlipSprite {
    STANDARD = 1,
    WAYPOINT = 8,
    RADIUS = 9,
    PLAYER = 1,
    NORTH = 42,
    ENEMY = 1,
    FRIEND = 1,
    OBJECTIVE = 1,
    VEHICLE = 225,
    HELICOPTER = 43,
    AIRCRAFT = 16,
    BOAT = 427,
    POLICE = 56,
    HOUSE = 40,
    STORE = 52,
    GUN_SHOP = 110,
    GARAGE = 50,
    HOSPITAL = 61,
    PARKING = 50,
}

/**
 * Blip color IDs for RAGE MP
 * Reference: https://wiki.rage.mp/index.php?title=Blips
 */
export enum BlipColor {
    WHITE = 0,
    RED = 1,
    GREEN = 2,
    BLUE = 3,
    YELLOW = 27,
    LIGHT_RED = 6,
    VIOLET = 7,
    PINK = 8,
    LIGHT_ORANGE = 17,
    LIGHT_BROWN = 18,
    LIGHT_GREEN = 25,
    LIGHT_BLUE = 26,
    LIGHT_PURPLE = 27,
    DARK_PURPLE = 49,
    CYAN = 30,
    LIGHT_YELLOW = 36,
    ORANGE = 17,
    LIGHT_PINK = 34,
    LIGHT_RED_2 = 76,
    FRIENDLY = 2,
    ENEMY_RED = 1,
    NEUTRAL = 0,
    TEAM_1 = 3,
    TEAM_2 = 1,
}

export interface BlipConfig {
    sprite: BlipSprite;
    color: BlipColor;
    scale?: number;
    alpha?: number;
    shortRange?: boolean;
    name?: string;
    showCone?: boolean;
    category?: number;
    showHeading?: boolean; // Show heading indicator on blip
}

interface PlayerBlipConfig {
    playerId: number;
    config: BlipConfig;
    visibleTo: number[]; // Array of player IDs who can see this blip
}

interface CustomBlipData {
    id: string;
    position: Vector3;
    config: BlipConfig;
    visibleTo: number[]; // Array of player IDs who can see this blip (empty = everyone)
}

/**
 * Server-side blip management service
 * Controls which blips players can see on their radar
 * Prevents client-side manipulation and exploits
 */
export default class PlayersBlipsService {
    private static logger: Logger = Logger.getLogger(PlayersBlipsService);
    private static playerBlips: Map<number, PlayerBlipConfig> = new Map(); // playerId -> config
    private static customBlips: Map<string, CustomBlipData> = new Map(); // blipId -> data
    private static playerTeams: Map<number, number> = new Map(); // playerId -> teamId
    private static showAllPlayers: boolean = true; // Global setting
    private static showTeamOnly: boolean = false; // Only show teammates
    private static maxBlipDistance: number = 1000; // Maximum distance to show blips (0 = unlimited)
    private static defaultConfig: BlipConfig = {
        sprite: BlipSprite.PLAYER,
        color: BlipColor.WHITE,
        scale: 0.8,
        alpha: 255,
        shortRange: true,
        showCone: true,
        // category: 7, // Category 7 is for other players
        // showHeading: true, // Show heading indicator by default
    };

    /**
     * Initialize the service
     */
    public static init() {
        this.logger.info('Initializing server-side PlayersBlipsService...');

        // Register event handlers
        EventService.registerEventHandler('players:blip:requestUpdate', this.onClientRequestUpdate.bind(this));

        // Register RAGE MP events
        mp.events.add('playerJoin', this.onPlayerJoin.bind(this));
        mp.events.add('playerQuit', this.onPlayerQuit.bind(this));

        // Start periodic sync (every 2 seconds)
        setInterval(() => {
            this.syncAllBlips();
        }, 2000);

        // Create example blips
        this.createExampleBlips();

        this.logger.info('Server-side PlayersBlipsService initialized successfully');
    }

    /**
     * Create example custom blips for demonstration
     */
    private static createExampleBlips() {
        // Example: Gun shop blip (visible to everyone)
        this.createCustomBlip(
            'gunshop_example',
            new mp.Vector3(-662.1, -935.3, 21.8), // Ammu-Nation in Los Santos
            {
                sprite: BlipSprite.GUN_SHOP,
                color: BlipColor.RED,
                scale: 0.8,
                name: 'Ammu-Nation',
                shortRange: false, // Always visible
            },
            [] // Empty array = visible to everyone
        );

        // Example: Hospital blip
        this.createCustomBlip(
            'hospital_example',
            new mp.Vector3(1839.6, 3672.9, 34.3), // Sandy Shores Medical Center
            {
                sprite: BlipSprite.HOSPITAL,
                color: BlipColor.RED,
                scale: 0.8,
                name: 'Hospital',
                shortRange: false,
            },
            []
        );

        // Example: Store blip
        this.createCustomBlip(
            'store_example',
            new mp.Vector3(25.7, -1347.3, 29.5), // 24/7 Store
            {
                sprite: BlipSprite.STORE,
                color: BlipColor.GREEN,
                scale: 0.7,
                name: '24/7 Store',
                shortRange: false,
            },
            []
        );

        this.logger.info('Example blips created (Gun Shop, Hospital, Store)');
    }

    /**
     * Set a player's blip configuration
     */
    public static setPlayerBlip(player: PlayerMp, config: Partial<BlipConfig>) {
        const finalConfig: BlipConfig = { ...this.defaultConfig, ...config };

        this.playerBlips.set(player.id, {
            playerId: player.id,
            config: finalConfig,
            visibleTo: [],
        });

        // Sync to all relevant clients
        this.syncPlayerBlip(player);
    }

    /**
     * Remove a player's blip
     */
    public static removePlayerBlip(player: PlayerMp) {
        this.playerBlips.delete(player.id);

        // Tell all clients to remove this blip
        mp.players.forEach(client => {
            EventService.triggerClientEvent(client, 'players:blip:remove', { playerId: player.id });
        });
    }

    /**
     * Create a custom blip (for objectives, locations, etc.)
     */
    public static createCustomBlip(
        id: string,
        position: Vector3,
        config: Partial<BlipConfig>,
        visibleTo: number[] = [] // Empty array = visible to everyone
    ): void {
        const finalConfig: BlipConfig = { ...this.defaultConfig, ...config };

        const blipData: CustomBlipData = {
            id,
            position,
            config: finalConfig,
            visibleTo,
        };

        this.customBlips.set(id, blipData);

        // Sync to relevant clients
        this.syncCustomBlip(blipData);
    }

    /**
     * Update an existing custom blip
     */
    public static updateCustomBlip(
        id: string,
        position?: Vector3,
        config?: Partial<BlipConfig>,
        visibleTo?: number[]
    ) {
        const blipData = this.customBlips.get(id);
        if (!blipData) {
            this.logger.warn(`Cannot update custom blip ${id}: not found`);
            return;
        }

        if (position) blipData.position = position;
        if (config) blipData.config = { ...blipData.config, ...config };
        if (visibleTo !== undefined) blipData.visibleTo = visibleTo;

        this.syncCustomBlip(blipData);
    }

    /**
     * Remove a custom blip
     */
    public static removeCustomBlip(id: string) {
        const blipData = this.customBlips.get(id);
        if (!blipData) return;

        this.customBlips.delete(id);

        // Tell clients to remove it
        mp.players.forEach(client => {
            if (this.canPlayerSeeBlip(client, blipData.visibleTo)) {
                EventService.triggerClientEvent(client, 'players:blip:removeCustom', { id });
            }
        });
    }

    /**
     * Set player's team (affects which blips they see)
     */
    public static setPlayerTeam(player: PlayerMp, teamId: number) {
        this.playerTeams.set(player.id, teamId);

        // Update blip color based on team
        const teamConfig: Partial<BlipConfig> = {
            color: this.getTeamColor(teamId),
        };

        this.setPlayerBlip(player, teamConfig);
    }

    /**
     * Get team color based on team ID
     */
    private static getTeamColor(teamId: number): BlipColor {
        const colorMap: { [key: number]: BlipColor } = {
            0: BlipColor.WHITE,
            1: BlipColor.TEAM_1, // Blue
            2: BlipColor.TEAM_2, // Red
            3: BlipColor.GREEN,
            4: BlipColor.YELLOW,
            5: BlipColor.ORANGE,
            6: BlipColor.PINK,
            7: BlipColor.VIOLET,
        };

        return colorMap[teamId] || BlipColor.WHITE;
    }

    /**
     * Set whether all players should show on radar
     */
    public static setShowAllPlayers(enabled: boolean) {
        this.showAllPlayers = enabled;
        this.syncAllBlips();
    }

    /**
     * Set whether to only show team members
     */
    public static setShowTeamOnly(enabled: boolean) {
        this.showTeamOnly = enabled;
        this.syncAllBlips();
    }

    /**
     * Set maximum blip distance
     */
    public static setMaxBlipDistance(distance: number) {
        this.maxBlipDistance = distance;
    }

    /**
     * Set default blip config
     */
    public static setDefaultConfig(config: Partial<BlipConfig>) {
        this.defaultConfig = { ...this.defaultConfig, ...config };
    }

    /**
     * Enable/disable the blip system for a specific player
     */
    public static setPlayerBlipsEnabled(player: PlayerMp, enabled: boolean) {
        EventService.triggerClientEvent(player, 'players:blip:setPlayerBlipsEnabled', enabled);
    }

    /**
     * Enable/disable the entire blip system for a specific player
     */
    public static setBlipSystemEnabled(player: PlayerMp, enabled: boolean) {
        EventService.triggerClientEvent(player, 'players:blip:setEnabled', enabled);
    }

    /**
     * Sync all blips to all players
     */
    private static syncAllBlips() {
        mp.players.forEach(client => {
            this.syncBlipsToPlayer(client);
        });
    }

    /**
     * Sync all relevant blips to a specific player
     */
    private static syncBlipsToPlayer(client: PlayerMp) {
        const blipsToShow: any[] = [];

        // Collect player blips
        mp.players.forEach(player => {
            if (player.id === client.id) return; // Don't show own blip

            if (!this.shouldShowPlayerBlip(client, player)) return;

            const blipConfig = this.playerBlips.get(player.id);
            if (blipConfig) {
                blipsToShow.push({
                    type: 'player',
                    playerId: player.id,
                    config: blipConfig.config,
                });
            } else {
                // Use default config
                blipsToShow.push({
                    type: 'player',
                    playerId: player.id,
                    config: this.defaultConfig,
                });
            }
        });

        // Collect custom blips
        this.customBlips.forEach(blipData => {
            if (this.canPlayerSeeBlip(client, blipData.visibleTo)) {
                blipsToShow.push({
                    type: 'custom',
                    id: blipData.id,
                    position: blipData.position,
                    config: blipData.config,
                });
            }
        });

        // Send to client
        EventService.triggerClientEvent(client, 'players:blip:syncAll', {
            blips: blipsToShow,
            maxDistance: this.maxBlipDistance,
        });
    }

    /**
     * Sync a specific player's blip to all relevant clients
     */
    private static syncPlayerBlip(player: PlayerMp) {
        const blipConfig = this.playerBlips.get(player.id);
        if (!blipConfig) return;

        mp.players.forEach(client => {
            if (client.id === player.id) return;

            if (this.shouldShowPlayerBlip(client, player)) {
                EventService.triggerClientEvent(client, 'players:blip:create', {
                    playerId: player.id,
                    config: blipConfig.config,
                });
            }
        });
    }

    /**
     * Sync a custom blip to all relevant clients
     */
    private static syncCustomBlip(blipData: CustomBlipData) {
        mp.players.forEach(client => {
            if (this.canPlayerSeeBlip(client, blipData.visibleTo)) {
                EventService.triggerClientEvent(client, 'players:blip:createCustom', {
                    id: blipData.id,
                    position: blipData.position,
                    config: blipData.config,
                });
            }
        });
    }

    /**
     * Check if a player should see another player's blip
     */
    private static shouldShowPlayerBlip(viewer: PlayerMp, target: PlayerMp): boolean {
        if (!this.showAllPlayers) return false;

        // Check team-only mode
        if (this.showTeamOnly) {
            const viewerTeam = this.playerTeams.get(viewer.id);
            const targetTeam = this.playerTeams.get(target.id);

            if (viewerTeam === undefined || targetTeam === undefined) return false;
            if (viewerTeam !== targetTeam) return false;
        }

        // Check distance
        if (this.maxBlipDistance > 0) {
            const distance = this.getDistance(viewer.position, target.position);
            if (distance > this.maxBlipDistance) return false;
        }

        return true;
    }

    /**
     * Check if a player can see a blip based on visibility list
     */
    private static canPlayerSeeBlip(player: PlayerMp, visibleTo: number[]): boolean {
        // Empty array means visible to everyone
        if (visibleTo.length === 0) return true;

        // Check if player is in the visibility list
        return visibleTo.includes(player.id);
    }

    /**
     * Calculate distance between two positions
     */
    private static getDistance(pos1: Vector3, pos2: Vector3): number {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = pos1.z - pos2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * Event handler for player join
     */
    private static onPlayerJoin(player: PlayerMp) {
        // Create default blip for new player
        this.setPlayerBlip(player, this.defaultConfig);

        // Sync all blips to the new player
        setTimeout(() => {
            this.syncBlipsToPlayer(player);
        }, 1000); // Small delay to ensure client is ready
    }

    /**
     * Event handler for player quit
     */
    private static onPlayerQuit(player: PlayerMp) {
        this.playerBlips.delete(player.id);
        this.playerTeams.delete(player.id);

        // Tell all clients to remove this player's blip
        mp.players.forEach(client => {
            EventService.triggerClientEvent(client, 'players:blip:remove', { playerId: player.id });
        });
    }

    /**
     * Event handler for client requesting an update
     */
    private static onClientRequestUpdate(client: PlayerMp) {
        this.syncBlipsToPlayer(client);
    }

    /**
     * Get service statistics
     */
    public static getStats() {
        return {
            playerBlipCount: this.playerBlips.size,
            customBlipCount: this.customBlips.size,
            showAllPlayers: this.showAllPlayers,
            showTeamOnly: this.showTeamOnly,
            maxBlipDistance: this.maxBlipDistance,
        };
    }

    /**
     * Make a player's blip flash for specific viewers
     */
    public static flashPlayerBlip(playerId: number, viewers: number[] = []) {
        mp.players.forEach(client => {
            if (viewers.length === 0 || viewers.includes(client.id)) {
                EventService.triggerClientEvent(client, 'players:blip:flash', { playerId });
            }
        });
    }

    /**
     * Set GPS route to a custom blip for specific players
     */
    public static setBlipRoute(blipId: string, enabled: boolean, players: number[] = []) {
        mp.players.forEach(client => {
            if (players.length === 0 || players.includes(client.id)) {
                EventService.triggerClientEvent(client, 'players:blip:setRoute', { blipId, enabled });
            }
        });
    }
}
