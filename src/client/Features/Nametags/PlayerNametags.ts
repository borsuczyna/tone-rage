import ElementDataService from "@/Services/Infrastructure/ElementDataService";
import DrawingService from "@/Services/Rendering/DrawingService";
import SharedConfig from "@shared/SharedConfig";

export default class PlayerNametags {
    private static gameplayCamera: CameraMp;

    public static init() {
        mp.events.add('render', this.renderNametags.bind(this));
		this.gameplayCamera = mp.cameras.new('gameplay');
        mp.nametags.enabled = false;
    }

    private static renderNametags() {
        const localPlayerDimension = mp.players.local.dimension;
        const isInCharacterCreator = ElementDataService.get(mp.players.local, 'inCharacterCreation');
        if (isInCharacterCreator) return;

        mp.players.forEachInStreamRange((player: PlayerMp) => {
            if (player.dimension !== localPlayerDimension) return;

            const userId = ElementDataService.get(player, 'userId');
            if (!userId) return;

            this.drawNametagForPlayer(player);
        });
    }

    private static drawNametagForPlayer(player: PlayerMp) {
        const bonePosition = player.getBoneCoords(12844, 0, 0, 0); // Head bone
        const screenPos = DrawingService.getScreenFromWorldPosition(bonePosition.add(new mp.Vector3(0, 0, 0.4)));
        if (!screenPos) return;

        const nametagTexture = DrawingService.getPlayerNametagTexture(player);
        if (!nametagTexture) return;

		const camPos = this.gameplayCamera ? this.gameplayCamera.getCoord() : mp.players.local.position;
        const distance = camPos.subtract(bonePosition).length();
        const scale = Math.max(0.15, 1 - (distance / 30));
        if (scale <= 0) return;

        const aspectRatio = SharedConfig.PlayerNametagTextureWidth / SharedConfig.PlayerNametagTextureHeight;
        const nametagHeight = 48;
        const nametagWidth = (nametagHeight * aspectRatio) * scale;

        DrawingService.drawSprite(screenPos.x - nametagWidth / 2, screenPos.y - (nametagHeight * scale) / 2, nametagWidth, nametagHeight * scale, nametagTexture);
    }
}