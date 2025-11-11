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

interface BlipConfig {
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

interface PlayerBlipData {
    blip: BlipMp;
    config: BlipConfig;
    lastUpdate: number;
}

interface CustomBlipData {
    blip: BlipMp;
    config: BlipConfig;
}

/**
 * Client-side blip service
 * Receives blip data from server and displays them on the radar
 * Server has full control over which blips are visible
 */
export default class PlayersBlipsService {
    private static logger: Logger = Logger.getLogger(PlayersBlipsService);
    private static playerBlips: Map<number, PlayerBlipData> = new Map(); // playerId -> PlayerBlipData
    private static customBlips: Map<string, CustomBlipData> = new Map(); // customId -> CustomBlipData
    private static enabled: boolean = true;
    private static showPlayerBlips: boolean = true;
    private static maxBlipDistance: number = 0; // Set by server

    /**
     * Initialize the blip service
     */
    public static init() {
        this.logger.info('Initializing client-side PlayersBlipsService...');

        // Register event handlers for server-controlled blips
        EventService.registerEventHandler('players:blip:syncAll', this.onSyncAll.bind(this));
        EventService.registerEventHandler('players:blip:create', this.onBlipCreate.bind(this));
        EventService.registerEventHandler('players:blip:update', this.onBlipUpdate.bind(this));
        EventService.registerEventHandler('players:blip:remove', this.onBlipRemove.bind(this));
        EventService.registerEventHandler('players:blip:createCustom', this.onCustomBlipCreate.bind(this));
        EventService.registerEventHandler('players:blip:removeCustom', this.onCustomBlipRemove.bind(this));
        EventService.registerEventHandler('players:blip:setEnabled', this.setEnabled.bind(this));
        EventService.registerEventHandler('players:blip:setPlayerBlipsEnabled', this.setPlayerBlipsEnabled.bind(this));
        EventService.registerEventHandler('players:blip:flash', this.onFlashBlip.bind(this));
        EventService.registerEventHandler('players:blip:setRoute', this.onSetRoute.bind(this));

        // Register RAGE MP events
        mp.events.add('playerQuit', this.onPlayerQuit.bind(this));
        mp.events.add('render', this.onRender.bind(this));

        // Enable radar display
        mp.game.ui.displayRadar(true);

        this.logger.info('Client-side PlayersBlipsService initialized successfully');
    }

    /**
     * Render event - update blip positions every frame
     */
    private static onRender() {
        this.updateBlipPositions();
    }

    /**
     * Sync all blips from server
     */
    private static onSyncAll(data: { blips: any[]; maxDistance: number }) {
        this.logger.debug(`Syncing ${data.blips.length} blips from server`);

        // Clear existing blips
        this.removeAllPlayerBlips();
        this.removeAllCustomBlips();

        // Update max distance
        this.maxBlipDistance = data.maxDistance;

        // Create blips from server data
        data.blips.forEach((blipData: any) => {
            if (blipData.type === 'player') {
                const player = mp.players.atRemoteId(blipData.playerId);
                if (player) {
                    this.createPlayerBlip(player, blipData.config);
                }
            } else if (blipData.type === 'custom') {
                this.createCustomBlipInternal(blipData.id, blipData.position, blipData.config);
            }
        });
    }

    /**
     * Create a blip for a player
     */
    private static createPlayerBlip(player: PlayerMp, config: BlipConfig): BlipMp | null {
        if (!this.enabled || !this.showPlayerBlips) return null;
        if (!player || !player.handle) {
            this.logger.error('Cannot create blip for invalid player');
            return null;
        }

        const playerId = player.remoteId;

        // Remove existing blip if any
        if (this.playerBlips.has(playerId)) {
            this.removePlayerBlip(playerId);
        }

        try {
            // Create the blip
            const blip = mp.blips.new(config.sprite, player.position, {
                color: config.color,
                scale: config.scale || 0.8,
                alpha: config.alpha || 255,
                shortRange: config.shortRange !== false,
                name: config.name || player.name,
                dimension: player.dimension,
            });

            // Set blip name to player name
            if (player.name) {
                blip.setNameToPlayerName(player);
            }

            // Apply category if specified
            if (config.category !== undefined) blip.setCategory(config.category); 

            // Show heading indicator if specified
            if (config.showHeading !== undefined) blip.setShowHeadingIndicator(config.showHeading);

            // Store blip data
            this.playerBlips.set(playerId, {
                blip: blip,
                config: config,
                lastUpdate: Date.now(),
            });

            this.logger.debug(`Created blip for player ${player.name} (${playerId})`);
            return blip;
        } catch (error) {
            this.logger.error(`Error creating blip for player ${playerId}:`, error);
            return null;
        }
    }

    /**
     * Create a custom blip at a position
     */
    private static createCustomBlipInternal(
        id: string,
        position: Vector3,
        config: BlipConfig
    ): BlipMp | null {
        if (!this.enabled) return null;

        // Remove existing blip with same ID
        if (this.customBlips.has(id)) {
            this.removeCustomBlip(id);
        }

        try {
            const blip = mp.blips.new(config.sprite, position, {
                color: config.color,
                scale: config.scale || 0.8,
                alpha: config.alpha || 255,
                shortRange: config.shortRange !== false,
                name: config.name,
            });

            // Apply category if specified
            if (config.category !== undefined) blip.setCategory(config.category); 

            // Show heading indicator if specified (doesn't make sense for static blips, but included for completeness)
            if (config.showHeading !== undefined) blip.setShowHeadingIndicator(config.showHeading); 

            this.customBlips.set(id, { blip, config });
            this.logger.debug(`Created custom blip with ID: ${id}`);
            return blip;
        } catch (error) {
            this.logger.error(`Error creating custom blip ${id}:`, error);
            return null;
        }
    }

    /**
     * Update blip positions (called from render loop if needed)
     */
    public static updateBlipPositions() {
        if (!this.enabled || !this.showPlayerBlips) return;

        this.playerBlips.forEach((blipData, playerId) => {
            try {
                const player = mp.players.atRemoteId(playerId);
                if (player && player.handle) {
                    blipData.blip.setCoords(player.position);
                    blipData.lastUpdate = Date.now();
                } else {
                    // Player no longer exists, remove blip
                    this.removePlayerBlip(playerId);
                }
            } catch (error) {
                this.logger.error(`Error updating blip position for player ${playerId}:`, error);
            }
        });
    }

    /**
     * Get a player's blip
     */
    public static getPlayerBlip(playerId: number): BlipMp | null {
        const blipData = this.playerBlips.get(playerId);
        return blipData ? blipData.blip : null;
    }

    /**
     * Get a custom blip by ID
     */
    public static getCustomBlip(id: string): BlipMp | null {
        const data = this.customBlips.get(id);
        return data ? data.blip : null;
    }

    /**
     * Remove a player's blip
     */
    private static removePlayerBlip(playerId: number): boolean {
        const blipData = this.playerBlips.get(playerId);
        if (blipData) {
            try {
                if (blipData.blip && blipData.blip.destroy) {
                    blipData.blip.destroy();
                }
                this.playerBlips.delete(playerId);
                this.logger.debug(`Removed blip for player ${playerId}`);
                return true;
            } catch (error) {
                this.logger.error(`Error removing blip for player ${playerId}:`, error);
                this.playerBlips.delete(playerId);
                return false;
            }
        }
        return false;
    }

    /**
     * Remove a custom blip
     */
    private static removeCustomBlip(id: string): boolean {
        const data = this.customBlips.get(id);
        if (data) {
            try {
                data.blip.destroy();
                this.customBlips.delete(id);
                this.logger.debug(`Removed custom blip: ${id}`);
                return true;
            } catch (error) {
                this.logger.error(`Error removing custom blip ${id}:`, error);
                this.customBlips.delete(id);
                return false;
            }
        }
        return false;
    }

    /**
     * Remove all player blips
     */
    private static removeAllPlayerBlips() {
        const playerIds = Array.from(this.playerBlips.keys());
        playerIds.forEach(playerId => this.removePlayerBlip(playerId));
        this.logger.debug('Removed all player blips');
    }

    /**
     * Remove all custom blips
     */
    private static removeAllCustomBlips() {
        const blipIds = Array.from(this.customBlips.keys());
        blipIds.forEach(id => this.removeCustomBlip(id));
        this.logger.debug('Removed all custom blips');
    }

    /**
     * Update a player blip's config
     */
    private static updatePlayerBlipConfig(playerId: number, config: Partial<BlipConfig>) {
        const blipData = this.playerBlips.get(playerId);
        if (blipData) {
            const blip = blipData.blip;

            if (config.sprite !== undefined) blip.setSprite(config.sprite);
            if (config.color !== undefined) blip.setColour(config.color);
            if (config.scale !== undefined) blip.setScale(config.scale);
            if (config.alpha !== undefined) blip.setAlpha(config.alpha);
            if (config.shortRange !== undefined) blip.setAsShortRange(config.shortRange);
            if (config.category !== undefined) blip.setCategory(config.category);
            if (config.showHeading !== undefined) blip.setShowHeadingIndicator(config.showHeading);

            // Update stored config
            blipData.config = { ...blipData.config, ...config };

            this.logger.debug(`Updated blip config for player ${playerId}`);
        }
    }

    /**
     * Enable or disable the entire blip system
     */
    private static setEnabled(enabled: boolean) {
        this.enabled = enabled;

        if (enabled) {
            mp.game.ui.displayRadar(true);
            this.logger.info('Blip system enabled');
            // Request update from server
            EventService.triggerServerEvent('players:blip:requestUpdate');
        } else {
            this.removeAllPlayerBlips();
            this.removeAllCustomBlips();
            this.logger.info('Blip system disabled');
        }
    }

    /**
     * Enable or disable player blips specifically
     */
    private static setPlayerBlipsEnabled(enabled: boolean) {
        this.showPlayerBlips = enabled;

        if (!enabled) {
            this.removeAllPlayerBlips();
        } else {
            // Request update from server
            EventService.triggerServerEvent('players:blip:requestUpdate');
        }

        this.logger.info(`Player blips ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Show or hide the radar
     */
    public static setRadarVisible(visible: boolean) {
        mp.game.ui.displayRadar(visible);
    }

    /**
     * Request update from server
     */
    public static requestUpdate() {
        EventService.triggerServerEvent('players:blip:requestUpdate');
    }

    /**
     * Event handler for server-controlled blip creation
     */
    private static onBlipCreate(data: { playerId: number; config: BlipConfig }) {
        const player = mp.players.atRemoteId(data.playerId);
        if (player) {
            this.createPlayerBlip(player, data.config);
        }
    }

    /**
     * Event handler for server-controlled blip updates
     */
    private static onBlipUpdate(data: { playerId: number; config: Partial<BlipConfig> }) {
        this.updatePlayerBlipConfig(data.playerId, data.config);
    }

    /**
     * Event handler for server-controlled blip removal
     */
    private static onBlipRemove(data: { playerId: number }) {
        this.removePlayerBlip(data.playerId);
    }

    /**
     * Event handler for custom blip creation
     */
    private static onCustomBlipCreate(data: { id: string; position: Vector3; config: BlipConfig }) {
        this.createCustomBlipInternal(data.id, data.position, data.config);
    }

    /**
     * Event handler for custom blip removal
     */
    private static onCustomBlipRemove(data: { id: string }) {
        this.removeCustomBlip(data.id);
    }

    /**
     * Event handler for flashing a blip
     */
    private static onFlashBlip(data: { playerId: number }) {
        const blipData = this.playerBlips.get(data.playerId);
        if (blipData && blipData.blip) {
            blipData.blip.pulse();
        }
    }

    /**
     * Event handler for setting route to a blip
     */
    private static onSetRoute(data: { blipId: string; enabled: boolean }) {
        const customData = this.customBlips.get(data.blipId);
        if (customData && customData.blip) {
            customData.blip.setRoute(data.enabled);
        }
    }

    /**
     * Event handler for player quit
     */
    private static onPlayerQuit(player: PlayerMp) {
        if (player) {
            this.removePlayerBlip(player.remoteId);
        }
    }

    /**
     * Get service statistics
     */
    public static getStats() {
        return {
            enabled: this.enabled,
            showPlayerBlips: this.showPlayerBlips,
            playerBlipCount: this.playerBlips.size,
            customBlipCount: this.customBlips.size,
            maxBlipDistance: this.maxBlipDistance,
        };
    }
}
