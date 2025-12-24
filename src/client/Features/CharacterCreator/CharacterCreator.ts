import Matrix from "@/Helpers/Matrix";
import { updateEntityHairOverlay } from "@/Prototypes/player";
import EventService from "@/Services/Infrastructure/EventService";
import InterfaceService from "@/Services/Infrastructure/InterfaceService";
import KeyboardService, { KeyState } from "@/Services/Utility/KeyboardService";
import { InputKey } from "@shared/KeyMap";
import { CharacterAppearance, CharacterGender, getBestTorsoForTop, getBestUndershirtsForTop, getDefaultAppearance } from "@shared/Models/Character/Character";
import TimerService from "@shared/Services/TimerService";
import SpawnPanel from "../Spawn/SpawnPanel";
import DrawingService from "@/Services/Rendering/DrawingService";
import { characterCreationPosition } from "@shared/SpawnsData";

export default class CharacterCreator {
    private static cameraFov: number = 70;
    private static cameraOffset: Vector3 = new mp.Vector3(0, 4, 1.5);
    private static cameraLookAtOffset: Vector3 = new mp.Vector3(0, 0, 0.5);
    private static camera: CameraMp | null = null;
    private static playerMatrix: Matrix | null = null;
    private static zoomLevel: number = 0;
    private static isCursorInGrabBox: boolean = true;
    private static rotatingPed: [number, number] | null = null;
    private static cameraY: number = 0;
    private static category: number = 0;
    private static tableObject: ObjectMp | null = null;

    // Bound function references for proper event removal
    private static boundUpdateHairOverlay = CharacterCreator.updateHairOverlay.bind(CharacterCreator);
    private static boundOnEntityStreamIn = CharacterCreator.onEntityStreamIn.bind(CharacterCreator);
    private static boundRenderLoop = CharacterCreator.renderLoop.bind(CharacterCreator);
    private static boundOnClick = CharacterCreator.onClick.bind(CharacterCreator);
    private static boundOnScroll = CharacterCreator.onScroll.bind(CharacterCreator);
    private static boundOnUpdateAppearance = CharacterCreator.onUpdateAppearance.bind(CharacterCreator);
    private static boundOnCursorEnterGrabBox = CharacterCreator.onCursorEnterExitGrabBox.bind(CharacterCreator, true);
    private static boundOnCursorLeaveGrabBox = CharacterCreator.onCursorEnterExitGrabBox.bind(CharacterCreator, false);
    private static boundOnCategoryChanged = CharacterCreator.onCategoryChanged.bind(CharacterCreator);
    private static boundFinished = CharacterCreator.finished.bind(CharacterCreator);

    public static init() {
        EventService.registerEventHandler('characterCreator:updateHairOverlay', this.boundUpdateHairOverlay);
        mp.events.add('entityStreamIn', this.boundOnEntityStreamIn);
    }

    public static setVisible(visible: boolean) {
        InterfaceService.setInterfaceVisible('CharacterCreatorInterface', visible);
        InterfaceService.setCursorVisible(visible, visible);
        mp.game.ui.displayHud(false);
        mp.game.ui.displayRadar(false);

        if (visible) {
			mp.events.add('render', this.boundRenderLoop);
            mp.events.add('click', this.boundOnClick);
            
            this.camera = mp.cameras.new('spawnCamera', new mp.Vector3(0, 0, 300), new mp.Vector3(0, 0, 0), 60);
			this.camera.setActive(true);
			mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);

            const creatorPosition = characterCreationPosition;
            mp.players.local.position = new mp.Vector3(creatorPosition[0], creatorPosition[1], creatorPosition[2]);
            mp.players.local.heading = creatorPosition[3] || 0;

            // Spawn table prop under player
            this.tableObject = mp.objects.new(mp.game.joaat('prop_tablesmall_01'), 
                new mp.Vector3(creatorPosition[0], creatorPosition[1], creatorPosition[2] - 2), 
                { rotation: new mp.Vector3(0, 0, 0), alpha: 0, dimension: mp.players.local.dimension });

            this.playerMatrix = new Matrix(mp.players.local);
            this.playerMatrix.dontUpdate = true;

            KeyboardService.registerKeyHandler('MouseWheelDown', this.boundOnScroll);
            KeyboardService.registerKeyHandler('MouseWheelUp', this.boundOnScroll);

            EventService.registerEventHandler('characterCreator:updateAppearance', this.boundOnUpdateAppearance);
            EventService.registerEventHandler('characterCreator:cursorEnterGrabBox', this.boundOnCursorEnterGrabBox);
            EventService.registerEventHandler('characterCreator:cursorLeaveGrabBox', this.boundOnCursorLeaveGrabBox);
            EventService.registerEventHandler('characterCreator:categoryChanged', this.boundOnCategoryChanged);
            EventService.registerEventHandler('characterCreator:finished', this.boundFinished);
        } else {
            mp.events.remove('render', this.boundRenderLoop);

            if (this.camera) {
                this.camera.setActive(false);
                this.camera.destroy();
                this.camera = null;
            }

            mp.game.cam.renderScriptCams(false, false, 0, true, false, 0);

            // Destroy table prop
            if (this.tableObject) {
                this.tableObject.destroy();
                this.tableObject = null;
            }

            this.playerMatrix = null;

            KeyboardService.unregisterKeyHandler('MouseWheelDown', this.boundOnScroll);
            KeyboardService.unregisterKeyHandler('MouseWheelUp', this.boundOnScroll);

            EventService.removeEventHandler('characterCreator:updateAppearance', this.boundOnUpdateAppearance);
            EventService.removeEventHandler('characterCreator:cursorEnterGrabBox', this.boundOnCursorEnterGrabBox);
            EventService.removeEventHandler('characterCreator:cursorLeaveGrabBox', this.boundOnCursorLeaveGrabBox);
            EventService.removeEventHandler('characterCreator:categoryChanged', this.boundOnCategoryChanged);
            EventService.removeEventHandler('characterCreator:finished', this.boundFinished);

            this.onUpdateAppearance(getDefaultAppearance());
        }
    }

    private static updateHairOverlay(playerId: number) {
        const player = mp.players.atRemoteId(playerId);
        if (player) {
            updateEntityHairOverlay(player);
        }
    }

    private static onEntityStreamIn(entity: EntityMp) {
        if (entity.type === "player") {
            updateEntityHairOverlay(entity as PlayerMp);
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

        mp.game.time.setTime(18, 0, 0);
        mp.game.misc.setWeatherTypeNowPersist('CLEAR');
        mp.players.local.freezePosition(true);
        mp.players.local.setBlockingOfNonTemporaryEvents(true);
        mp.players.local.taskSetBlockingOfNonTemporaryEvents(true);

        const characterPosition = mp.players.local.position;
        const s = 10;
        const a = characterPosition.add(new mp.Vector3(-s, -s, 0));
        const b = characterPosition.add(new mp.Vector3(s, -s, 0));
        const c = characterPosition.add(new mp.Vector3(s, s, 0));
        const d = characterPosition.add(new mp.Vector3(-s, s, 0));
        const e = characterPosition.add(new mp.Vector3(-s, 0, -s));
        const f = characterPosition.add(new mp.Vector3(s, 0, -s));
        const g = characterPosition.add(new mp.Vector3(-s, 0, s));
        const h = characterPosition.add(new mp.Vector3(s, 0, s));
        DrawingService.drawPlane3D(a, b, characterPosition, s*2, '/creator/background.png', undefined, false, 512, 512);
        DrawingService.drawPlane3D(c, d, characterPosition, s*2, '/creator/background.png', undefined, false, 512, 512);
        DrawingService.drawPlane3D(b, c, characterPosition, s*2, '/creator/background.png', undefined, false, 512, 512);
        DrawingService.drawPlane3D(d, a, characterPosition, s*2, '/creator/background.png', undefined, false, 512, 512);
        DrawingService.drawPlane3D(e, f, characterPosition, s*2, '/creator/background.png', undefined, false, 512, 512);
        DrawingService.drawPlane3D(g, h, characterPosition, s*2, '/creator/background.png', undefined, false, 512, 512);
    
        // draw cyan on front left and pink on front right
        const lightA = this.playerMatrix.getOffsetPosition(new mp.Vector3(-1, 0, 0.5));
        const lightB = this.playerMatrix.getOffsetPosition(new mp.Vector3(1, 0, 0.5));
        mp.game.graphics.drawLightWithRange(lightA.x, lightA.y, lightA.z, 255, 0, 166, 10, 20);
        mp.game.graphics.drawLightWithRange(lightB.x, lightB.y, lightB.z, 0, 140, 255, 10, 20);
    }

    private static getCameraTargetPosition(): [Vector3, Vector3, number] {
        if (this.category === 4) { // Clothes
            return [
                new mp.Vector3(0, 1.25, 0.25 + this.cameraY/10 * this.zoomLevel),
                new mp.Vector3(0, 0, -0.05 + this.cameraY/15 * this.zoomLevel),
                80 - this.zoomLevel * 40
            ];
        }
        
        return [
            new mp.Vector3(0, 0.72, 0.7 + this.cameraY/45 * this.zoomLevel),
            new mp.Vector3(0, 0, 0.67 + this.cameraY/55 * this.zoomLevel),
            70 - this.zoomLevel * 40
        ];
    }

    private static onUpdateAppearance(appearance: CharacterAppearance) {
        mp.console.logError('call');
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