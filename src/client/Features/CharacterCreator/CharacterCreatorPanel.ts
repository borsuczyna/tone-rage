import Matrix from "@/Helpers/Matrix";
import { updateEntityHairOverlay } from "@/Prototypes/player";
import EventService from "@/Services/Infrastructure/EventService";
import InterfaceService from "@/Services/Infrastructure/InterfaceService";
import KeyboardService, { KeyState } from "@/Services/Utility/KeyboardService";
import { InputKey } from "@shared/KeyMap";
import { CharacterAppearance, CharacterGender, femaleHairOverlays, getBestTorsoForTop, getBestUndershirtsForTop, getDefaultAppearance, maleHairOverlays } from "@shared/Models/Character/Character";
import TimerService from "@shared/Services/TimerService";
import SpawnPanel from "../Spawn/SpawnPanel";

export default class CharacterCreatorPanel {
    private static cameraFov: number = 70;
    private static cameraOffset: Vector3 = new mp.Vector3(0, 4, 1.5);
    private static cameraLookAtOffset: Vector3 = new mp.Vector3(0, 0, 0.5);
    private static camera: CameraMp | null = null;
    private static playerMatrix: Matrix | null = null;
    private static zoomLevel: number = 0;
    private static isCursorInGrabBox: boolean = false;
    private static rotatingPed: [number, number] | null = null;
    private static cameraY: number = 0;
    private static category: number = 0;

    public static setVisible(visible: boolean) {
        InterfaceService.setInterfaceVisible('CharacterCreatorInterface', visible);
        InterfaceService.setCursorVisible(visible, visible);
        mp.game.ui.displayHud(false);
        mp.game.ui.displayRadar(false);

        if (visible) {
			mp.events.add('render', this.renderLoop.bind(this));
            mp.events.add('click', this.onClick.bind(this));
            
            this.camera = mp.cameras.new('spawnCamera', new mp.Vector3(0, 0, 300), new mp.Vector3(0, 0, 0), 60);
			this.camera.setActive(true);
			mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);

            this.playerMatrix = new Matrix(mp.players.local);
            this.playerMatrix.dontUpdate = true;

            KeyboardService.registerKeyHandler('MouseWheelDown', this.onScroll.bind(this));
            KeyboardService.registerKeyHandler('MouseWheelUp', this.onScroll.bind(this));

            EventService.registerEventHandler('characterCreator:updateAppearance', this.onUpdateAppearance.bind(this));
            EventService.registerEventHandler('characterCreator:cursorEnterGrabBox', this.onCursorEnterExitGrabBox.bind(this, true).bind(this));
            EventService.registerEventHandler('characterCreator:cursorLeaveGrabBox', this.onCursorEnterExitGrabBox.bind(this, false).bind(this));
            EventService.registerEventHandler('characterCreator:categoryChanged', this.onCategoryChanged.bind(this));
            EventService.registerEventHandler('characterCreator:finished', this.finished.bind(this));
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
            EventService.removeEventHandler('characterCreator:cursorEnterGrabBox', this.onCursorEnterExitGrabBox.bind(this, true).bind(this));
            EventService.removeEventHandler('characterCreator:cursorLeaveGrabBox', this.onCursorEnterExitGrabBox.bind(this, false).bind(this));
            EventService.removeEventHandler('characterCreator:categoryChanged', this.onCategoryChanged.bind(this));
            EventService.removeEventHandler('characterCreator:finished', this.finished.bind(this));

            this.onUpdateAppearance(getDefaultAppearance());
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

        if (this.rotatingPed !== null) {
            const [cursorX, cursorY] = mp.gui.cursor.position;
            const deltaX = cursorX - this.rotatingPed[0];
            const deltaY = cursorY - this.rotatingPed[1];
            const rotationSpeed = 0.2;
            mp.players.local.setHeading(mp.players.local.getHeading() + deltaX * rotationSpeed);
            this.cameraY = Math.max(-10, Math.min(10, this.cameraY + deltaY * rotationSpeed * 0.1));
            this.rotatingPed = [cursorX, cursorY];
        }

        mp.game.time.setTime(12, 0, 0);
        mp.players.local.freezePosition(true);
        mp.players.local.setBlockingOfNonTemporaryEvents(true);
        mp.players.local.taskSetBlockingOfNonTemporaryEvents(true);
    }

    private static getCameraTargetPosition(): [Vector3, Vector3, number] {
        const isFemale = mp.players.local.model === mp.game.joaat('mp_f_freemode_01');
        const femaleZ = isFemale ? 0.09 : 0;

        if (this.category === 5) { // Clothes
            return [
                new mp.Vector3(0, 1.25, 0.25 + this.cameraY/10 * this.zoomLevel),
                new mp.Vector3(0, 0, -0.05 + this.cameraY/15 * this.zoomLevel),
                80 - this.zoomLevel * 40
            ];
        }
        
        return [
            new mp.Vector3(0, 0.72, 0.7 + femaleZ + this.cameraY/45 * this.zoomLevel),
            new mp.Vector3(0, 0, 0.67 + femaleZ + this.cameraY/55 * this.zoomLevel),
            70 - this.zoomLevel * 40
        ];
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

        if (appearance.gender === CharacterGender.Male) {
            if (maleHairOverlays[appearance.hairStyle] && maleHairOverlays[appearance.hairStyle].collection && maleHairOverlays[appearance.hairStyle].overlay) {
                // @ts-ignore
                mp.players.local.addDecorationFromHashes(
                    mp.game.gameplay.getHashKey(maleHairOverlays[appearance.hairStyle].collection),
                    mp.game.gameplay.getHashKey(maleHairOverlays[appearance.hairStyle].overlay)
                );
            }
        } else {
            if (femaleHairOverlays[appearance.hairStyle] && femaleHairOverlays[appearance.hairStyle].collection && femaleHairOverlays[appearance.hairStyle].overlay) {
                // @ts-ignore
                mp.players.local.addDecorationFromHashes(
                    mp.game.gameplay.getHashKey(femaleHairOverlays[appearance.hairStyle].collection),
                    mp.game.gameplay.getHashKey(femaleHairOverlays[appearance.hairStyle].overlay)
                );
            }
        }

        const bestTorso = getBestTorsoForTop(appearance.gender, appearance.topStyle);
        const bestUndershirts = getBestUndershirtsForTop(appearance.gender, appearance.topStyle);
        mp.players.local.setComponentVariation(2, appearance.hairStyle, 0, 1);
        mp.players.local.setComponentVariation(4, appearance.legsStyle, appearance.legsTexture, 2);
        mp.players.local.setComponentVariation(6, appearance.shoesStyle, appearance.shoesTexture, 2);
        mp.players.local.setComponentVariation(3, bestTorso, 0, 2);
        mp.players.local.setComponentVariation(8, appearance.undershirtStyle ?? bestUndershirts[0].id, appearance.undershirtTexture ?? bestUndershirts[0].textures[0], 2);
        mp.players.local.setComponentVariation(11, appearance.topStyle, appearance.topTexture, 2);
        mp.players.local.setHairColor(appearance.hairColor, appearance.hairHighlightColor);
        updateEntityHairOverlay(mp.players.local);

        this.setHeadOverlay(0, appearance.blemishesStyle, appearance.blemishesOpacity / 100, 0, 0);
        this.setHeadOverlay(1, appearance.beardStyle, appearance.beardLength / 100, appearance.beardColor, appearance.beardColor);
        this.setHeadOverlay(2, appearance.eyebrowStyle, appearance.eyebrowLength / 100, appearance.eyebrowColor, appearance.eyebrowColor);
        this.setHeadOverlay(3, appearance.ageingStyle, appearance.ageingOpacity / 100, 0, 0);
        this.setHeadOverlay(4, appearance.makeupStyle, appearance.makeupOpacity / 100, 0, 0);
        this.setHeadOverlay(5, appearance.blushStyle, appearance.blushOpacity / 100, appearance.blushColor, appearance.blushColor);
        this.setHeadOverlay(6, appearance.complexionStyle, appearance.complexionOpacity / 100, 0, 0);
        this.setHeadOverlay(7, appearance.sunDamageStyle, appearance.sunDamageOpacity / 100, 0, 0);
        this.setHeadOverlay(8, appearance.lipstickStyle, appearance.lipstickOpacity / 100, appearance.lipstickColor, appearance.lipstickColor);
        this.setHeadOverlay(9, appearance.frecklesStyle, appearance.frecklesOpacity / 100, 0, 0);
        mp.players.local.setEyeColor(appearance.eyeColor);

        mp.players.local.setFaceFeature(0, (appearance.noseWidth - 50) / 50); // Nose Width
        mp.players.local.setFaceFeature(1, (appearance.noseHeight - 50) / 50); // Nose Height
        mp.players.local.setFaceFeature(2, (appearance.noseLength - 50) / 50); // Nose Length
        mp.players.local.setFaceFeature(3, (appearance.noseBridge - 50) / 50); // Nose Bridge
        mp.players.local.setFaceFeature(4, (appearance.noseTip - 50) / 50); // Nose Tip
        mp.players.local.setFaceFeature(5, (appearance.noseBridgeShift - 50) / 50); // Nose Bridge Shift
        mp.players.local.setFaceFeature(6, (appearance.eyebrowHeight - 50) / 50); // Eyebrow Height
        mp.players.local.setFaceFeature(7, (appearance.eyebrowWidth - 50) / 50); // Eyebrow Width
        mp.players.local.setFaceFeature(8, (appearance.cheekboneHeight - 50) / 50); // Cheekbone Height
        mp.players.local.setFaceFeature(9, (appearance.cheekboneWidth - 50) / 50); // Cheekbone Width
        mp.players.local.setFaceFeature(10, (appearance.cheeksWidth - 50) / 50); // Cheeks Width
        mp.players.local.setFaceFeature(11, (appearance.eyesOpening - 50) / 50); // Eyes Opening
        mp.players.local.setFaceFeature(12, (appearance.lipsThickness - 50) / 50); // Lips Thickness
        mp.players.local.setFaceFeature(13, (appearance.jawWidth - 50) / 50); // Jaw Width
        mp.players.local.setFaceFeature(14, (appearance.jawHeight - 50) / 50);
        mp.players.local.setFaceFeature(15, (appearance.chinLength - 50) / 50); // Chin Length
        mp.players.local.setFaceFeature(16, (appearance.chinPosition - 50) / 50); // Chin Position
        mp.players.local.setFaceFeature(17, (appearance.chinWidth - 50) / 50); // Chin Width
        mp.players.local.setFaceFeature(18, (appearance.chinShape - 50) / 50); // Chin Shape
        mp.players.local.setFaceFeature(19, (appearance.neckWidth - 50) / 50); // Neck Width
    }

    private static setHeadOverlay(index: number, style: number, opacity: number, color1: number, color2: number) {
        if (style == 0) style = 255; // Clear overlay if style is 0
        mp.players.local.setHeadOverlay(index, style, opacity, color1, color2);
    }

    private static interpolateVector3(start: Vector3, end: Vector3, t: number): Vector3 {
        return new mp.Vector3(
            start.x + (end.x - start.x) * t,
            start.y + (end.y - start.y) * t,
            start.z + (end.z - start.z) * t
        );
    }

    private static onScroll(state: KeyState, _holdTime?: number, key?: InputKey) {
        if (state !== KeyState.Down || !this.isCursorInGrabBox) return;

        if (key === 'MouseWheelUp') {
            this.zoomLevel = Math.min(1, this.zoomLevel + 0.1);
        } else if (key === 'MouseWheelDown') {
            this.zoomLevel = Math.max(0, this.zoomLevel - 0.1);
        }
    }

    private static onCursorEnterExitGrabBox(isEntering: boolean) {
        this.isCursorInGrabBox = isEntering;
    }

    private static onCategoryChanged(category: number) {
        this.category = category;
    }

    private static finished() {
        TimerService.setTimer(this.finishedFinal.bind(this), 800, 1);
    }

    private static finishedFinal() {
        this.setVisible(false);
        SpawnPanel.setVisible(true);
    }

    private static onClick(absoluteX: number, absoluteY: number, upOrDown: "up" | "down", leftOrRight: "left" | "right", _relativeX: number, _relativeY: number, _worldPosition: Vector3, _hitEntity: number) {
        if (leftOrRight !== "left") return;

        if (upOrDown === "down" && this.isCursorInGrabBox && this.rotatingPed === null) {
            this.rotatingPed = [absoluteX, absoluteY];
        } else if (upOrDown === "up" && this.rotatingPed !== null) {
            this.rotatingPed = null;
        }
    }
}