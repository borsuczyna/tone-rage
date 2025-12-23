import EventService from '@/Services/Infrastructure/EventService';
import InterfaceService from '@/Services/Infrastructure/InterfaceService';
import RenderService from '@/Services/Rendering/RenderService';
import { spawnData, SpawnLocation } from '@shared/SpawnsData';
import Hud from '@/Features/Hud/Hud';
import Chat from '../Chat/Chat';

export default class SpawnPanel {
	private static selectedSpawn: SpawnLocation | null = null;
	private static camera: CameraMp | null = null;

	// Bound function references for proper event removal
	private static boundHandleSpawnPreview = this.handleSpawnPreview.bind(this);
	private static boundHandleSpawnSelect = this.handleSpawnSelect.bind(this);
	private static boundRenderLoop = this.renderLoop.bind(this);

	public static async setVisible(visible: boolean) {
		InterfaceService.setInterfaceVisible('SpawnSelectionInterface', visible);
		InterfaceService.setCursorVisible(visible, visible);

		if (visible) {
			EventService.registerEventHandler('spawn:preview', this.boundHandleSpawnPreview);
			EventService.registerEventHandler('spawn:select', this.boundHandleSpawnSelect);
			mp.events.add('render', this.boundRenderLoop);

			this.camera = mp.cameras.new('spawnCamera', new mp.Vector3(0, 0, 300), new mp.Vector3(0, 0, 0), 60);
			this.camera.setActive(true);
			mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
		} else {
			EventService.removeEventHandler('spawn:preview', this.boundHandleSpawnPreview);
			EventService.removeEventHandler('spawn:select', this.boundHandleSpawnSelect);
			mp.events.remove('render', this.boundRenderLoop);

			if (this.camera) {
				this.camera.setActive(false);
				this.camera.destroy();
				this.camera = null;
			}
			mp.game.cam.renderScriptCams(false, false, 0, true, false, 0);
		}

		mp.game.ui.displayHud(!visible);
		mp.game.ui.displayRadar(!visible);
		mp.players.local.setAlpha(visible ? 0 : 255);
	}

	private static handleSpawnPreview([categoryId, locationId]: [number, number]) {
		const spawn = spawnData[categoryId]?.locations[locationId];
		this.selectedSpawn = spawn;
	}

	private static handleSpawnSelect() {
		this.setVisible(false);
		Hud.setVisible(true);
		Chat.setVisible(true);
	}

	private static renderLoop() {
		if (this.camera == null) return;

		if (this.selectedSpawn == null) {
			this.camera.setCoord(0, 0, 100);
			this.camera.pointAtCoord(10, 0, 100);
			return;
		}

		// get current camera position
		const camPos = this.camera.getCoord();
		const gameTick = mp.game.gameplay.getGameTimer();
		const lookAtPos = new mp.Vector3(this.selectedSpawn.position[0], this.selectedSpawn.position[1], this.selectedSpawn.position[2]);

		let targetPos: Vector3 = lookAtPos.add(
			new mp.Vector3(Math.sin(gameTick * 0.0001) * 70, Math.cos(gameTick * 0.0001) * 70, this.selectedSpawn.cameraHeight ?? 70)
		);

		// Smoothly interpolate camera position towards target spawn position
		const lerpFactor = RenderService.deltaTime * 0.001;
		const newCamPos = this.lerpVectors(camPos, targetPos, lerpFactor);

		// get ground Z level at target position
		const groundZ = mp.game.gameplay.getGroundZFor3dCoord(newCamPos.x, newCamPos.y, newCamPos.z + 1000, false, false);

		if (newCamPos.z < groundZ + 30) {
			newCamPos.z = groundZ + 30;
		}

		this.camera.setCoord(newCamPos.x, newCamPos.y, newCamPos.z);
		this.camera.pointAtCoord(lookAtPos.x, lookAtPos.y, lookAtPos.z);
	}

	private static lerpVectors(start: Vector3, end: Vector3, factor: number): Vector3 {
		return new mp.Vector3(start.x + (end.x - start.x) * factor, start.y + (end.y - start.y) * factor, start.z + (end.z - start.z) * factor);
	}
}
