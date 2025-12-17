import Matrix from "@/Helpers/Matrix";
import EventService from "@/Services/Infrastructure/EventService";
import InterfaceService from "@/Services/Infrastructure/InterfaceService";
import KeyboardService, { KeyState } from "@/Services/Utility/KeyboardService";
import { InputKey } from "@shared/KeyMap";
import { CharacterAppearance, CharacterGender } from "@shared/Models/Character";

export default class CharacterCreatorPanel {
    private static cameraFov: number = 70;
    private static cameraOffset: Vector3 = new mp.Vector3(0, 4, 1.5);
    private static cameraLookAtOffset: Vector3 = new mp.Vector3(0, 0, 0.5);
    private static camera: CameraMp | null = null;
    private static playerMatrix: Matrix | null = null;
    private static zoomLevel: number = 0;

    public static setVisible(visible: boolean) {
        InterfaceService.setInterfaceVisible('CharacterCreatorInterface', visible);
        InterfaceService.setCursorVisible(visible, visible);
        mp.game.ui.displayHud(false);
        mp.game.ui.displayRadar(false);

        if (visible) {
			mp.events.add('render', this.renderLoop.bind(this));

            this.camera = mp.cameras.new('spawnCamera', new mp.Vector3(0, 0, 300), new mp.Vector3(0, 0, 0), 60);
			this.camera.setActive(true);
			mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);

            this.playerMatrix = new Matrix(mp.players.local);

            KeyboardService.registerKeyHandler('MouseWheelDown', this.onScroll.bind(this));
            KeyboardService.registerKeyHandler('MouseWheelUp', this.onScroll.bind(this));

            EventService.registerEventHandler('characterCreator:updateAppearance', this.onUpdateAppearance.bind(this));
        } else {
            mp.events.remove('render', this.renderLoop.bind(this));

            if (this.camera) {
                this.camera.setActive(false);
                this.camera.destroy();
                this.camera = null;
            }

            mp.game.cam.renderScriptCams(false, false, 0, true, false, 0);

            this.playerMatrix = null;

            KeyboardService.unregisterKeyHandler('MouseWheelDown', this.onScroll.bind(this));
            KeyboardService.unregisterKeyHandler('MouseWheelUp', this.onScroll.bind(this));

            EventService.removeEventHandler('characterCreator:updateAppearance', this.onUpdateAppearance.bind(this));
        }
    }

    private static renderLoop() {
        if (this.camera == null || this.playerMatrix == null) return;

        const cameraPosition = this.playerMatrix.getOffsetPosition(this.cameraOffset);
        const cameraLookAt = this.playerMatrix.getOffsetPosition(this.cameraLookAtOffset);

        this.camera.setFov(this.cameraFov);
        this.camera.setCoord(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        this.camera.pointAtCoord(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z);

        const [targetOffset, targetLookAtOffset, targetFov] = this.getCameraTargetPosition();
        this.cameraFov += (targetFov - this.cameraFov) * 0.03;
        this.cameraOffset = this.interpolateVector3(this.cameraOffset, targetOffset, 0.03);
        this.cameraLookAtOffset = this.interpolateVector3(this.cameraLookAtOffset, targetLookAtOffset, 0.03);
    }

    private static getCameraTargetPosition(): [Vector3, Vector3, number] {
        return [
            new mp.Vector3(0, 0.72, 0.7),
            new mp.Vector3(0, 0, 0.67),
            70 - this.zoomLevel * 30
        ]
    }

    private static onUpdateAppearance(appearance: CharacterAppearance) {
        const targetModel = appearance.gender === CharacterGender.Male ? mp.game.joaat('mp_m_freemode_01') : mp.game.joaat('mp_f_freemode_01');
        if (mp.players.local.model !== targetModel) {
            mp.players.local.model = targetModel;
        }

        mp.players.local.setHeadBlendData(
            appearance.maleParent,
            appearance.femaleParent,
            0,
            appearance.maleParent,
            appearance.femaleParent,
            0,
            1 - (appearance.faceSimilarity / 100),
            1 - (appearance.skinSimilarity / 100),
            0,
            false
        );

        mp.players.local.setComponentVariation(2, appearance.hairStyle, 0, 1);
        mp.players.local.setHairColor(appearance.hairColor, appearance.hairHighlightColor);
    }

    private static interpolateVector3(start: Vector3, end: Vector3, t: number): Vector3 {
        return new mp.Vector3(
            start.x + (end.x - start.x) * t,
            start.y + (end.y - start.y) * t,
            start.z + (end.z - start.z) * t
        );
    }

    private static onScroll(state: KeyState, _holdTime?: number, key?: InputKey) {
        if (state !== KeyState.Down) return;

        if (key === 'MouseWheelUp') {
            this.zoomLevel = Math.min(1, this.zoomLevel + 0.1);
        } else if (key === 'MouseWheelDown') {
            this.zoomLevel = Math.max(0, this.zoomLevel - 0.1);
        }
    }
}