import CommandService from "@/Services/Infrastructure/CommandService";
import NotificationService from "@/Services/Infrastructure/NotificationService";
import DrawingService from "@/Services/Rendering/DrawingService";

interface GreenScreenItem {
    name: string;
    camera: {
        height: number,
        headingOffset: number,
        fov: number,
        distance: number,
        greenScreenSize: number
    },
    hideHead?: boolean;
    element: () => EntityMp | null;

    getPossibleList: (element: EntityMp) => any[];
    applyItem: (element: EntityMp, itemData: any, data: GreenScreenItem) => void;
    filename: (itemData: any) => string;
}

function clothesListCallback(componentId: number) {
    return (element: EntityMp) => {
        const result: any[] = [];
        const ped = element as PedMp;

        const drawableCount = ped.getNumberOfDrawableVariations(componentId);
        for (let i = 0; i < drawableCount; i++) {
            for (let j = 0; j < ped.getNumberOfTextureVariations(componentId, i); j++) {
                result.push({ drawable: i, texture: j });
            }
        }

        return result;
    }
}

function clothesApplyCallback(componentId: number) {
    return (element: EntityMp, itemData: any, data: GreenScreenItem) => {
        const ped = element as PedMp;
        GreenScreen.hideBodyParts(element as PedMp, true);

        ped.setComponentVariation(componentId, itemData.drawable, itemData.texture, 2);
    }
}

function clothesFilenameCallback(componentId: number) {
    return (itemData: any) => {
        return `component_${componentId}_d${itemData.drawable}_t${itemData.texture}`;
    }
}

function createArray(start: number, end: number) {
    return (element: EntityMp) => {
        const result: number[] = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    }
}

function headOverlayApplyCallback(overlayId: number) {
    return (element: EntityMp, itemData: any, data: GreenScreenItem) => {
        const ped = element as PedMp;
        GreenScreen.hideBodyParts(element as PedMp, data.hideHead || false);
        // @ts-ignore
        ped.setHeadOverlay(overlayId, itemData, 1.0, 56, 56);
    }
}

function headOverlayFilenameCallback(overlayId: number) {
    return (itemData: any) => {
        return `headOverlay_${overlayId}_o${itemData}`;
    }
}

export default class GreenScreen {
    private static activeGreenScreen: {
        item: GreenScreenItem,
        camera: CameraMp,
    } | null = null;
    private static greenScreenData: GreenScreenItem[] = [
        {
            name: 'masks',
            camera: {
                height: 0.65,
                headingOffset: 25,
                fov: 40,
                distance: 0.85,
                greenScreenSize: 3,
            },
            hideHead: false,

            element: () => mp.players.local,
            getPossibleList: clothesListCallback(1),
            applyItem: clothesApplyCallback(1),
            filename: clothesFilenameCallback(1)
        },
        {
            name: 'hair',
            camera: {
                height: 0.8,
                headingOffset: 30,
                fov: 40,
                distance: 0.72,
                greenScreenSize: 3,
            },
            hideHead: false,

            element: () => mp.players.local,
            getPossibleList: clothesListCallback(2),
            applyItem: clothesApplyCallback(2),
            filename: clothesFilenameCallback(2)
        },
        {
            name: 'torso',
            camera: {
                height: 0.2,
                headingOffset: 0,
                fov: 40,
                distance: 1.2,
                greenScreenSize: 3,
            },
            hideHead: true,

            element: () => mp.players.local,
            getPossibleList: clothesListCallback(3),
            applyItem: clothesApplyCallback(3),
            filename: clothesFilenameCallback(3)
        },
        {
            name: 'legs',
            camera: {
                height: -0.25,
                headingOffset: 25,
                fov: 40,
                distance: 2.5,
                greenScreenSize: 3,
            },
            hideHead: true,

            element: () => mp.players.local,
            getPossibleList: clothesListCallback(4),
            applyItem: clothesApplyCallback(4),
            filename: clothesFilenameCallback(4)
        },
        {
            name: 'bags',
            camera: {
                height: 0.3,
                headingOffset: 150,
                fov: 40,
                distance: 1.4,
                greenScreenSize: 3,
            },
            hideHead: true,

            element: () => mp.players.local,
            getPossibleList: clothesListCallback(5),
            applyItem: clothesApplyCallback(5),
            filename: clothesFilenameCallback(5)
        },
        {
            name: 'hair',
            camera: {
                height: 0.8,
                headingOffset: 30,
                fov: 40,
                distance: 0.72,
                greenScreenSize: 3,
            },
            hideHead: false,

            element: () => mp.players.local,
            getPossibleList: clothesListCallback(2),
            applyItem: clothesApplyCallback(2),
            filename: clothesFilenameCallback(2)
        },
        {
            name: 'hair',
            camera: {
                height: 0.8,
                headingOffset: 30,
                fov: 40,
                distance: 0.72,
                greenScreenSize: 3,
            },
            hideHead: false,

            element: () => mp.players.local,
            getPossibleList: clothesListCallback(2),
            applyItem: clothesApplyCallback(2),
            filename: clothesFilenameCallback(2)
        },
        {
            name: 'blemishes',
            camera: {
                height: 0.8,
                headingOffset: 30,
                fov: 40,
                distance: 0.72,
                greenScreenSize: 3,
            },
            hideHead: false,
            element: () => mp.players.local,
            getPossibleList: createArray(0, 23),
            applyItem: headOverlayApplyCallback(0),
            filename: headOverlayFilenameCallback(0)
        },
        {
            name: 'beard',
            camera: {
                height: 0.8,
                headingOffset: 30,
                fov: 40,
                distance: 0.72,
                greenScreenSize: 3,
            },
            hideHead: false,
            element: () => mp.players.local,
            getPossibleList: createArray(0, 28),
            applyItem: headOverlayApplyCallback(1),
            filename: headOverlayFilenameCallback(1)
        },
        {
            name: 'eyebrows',
            camera: {
                height: 0.8,
                headingOffset: 30,
                fov: 40,
                distance: 0.72,
                greenScreenSize: 3,
            },
            hideHead: false,
            element: () => mp.players.local,
            getPossibleList: createArray(0, 33),
            applyItem: headOverlayApplyCallback(2),
            filename: headOverlayFilenameCallback(2)
        },
        {
            name: 'ageing',
            camera: {
                height: 0.8,
                headingOffset: 30,
                fov: 40,
                distance: 0.72,
                greenScreenSize: 3,
            },
            hideHead: false,
            element: () => mp.players.local,
            getPossibleList: createArray(0, 14),
            applyItem: headOverlayApplyCallback(3),
            filename: headOverlayFilenameCallback(3)
        },
        {
            name: 'makeup',
            camera: {
                height: 0.8,
                headingOffset: 30,
                fov: 40,
                distance: 0.72,
                greenScreenSize: 3,
            },
            hideHead: false,
            element: () => mp.players.local,
            getPossibleList: createArray(0, 74),
            applyItem: headOverlayApplyCallback(4),
            filename: headOverlayFilenameCallback(4)
        },
        {
            name: 'blush',
            camera: {
                height: 0.8,
                headingOffset: 30,
                fov: 40,
                distance: 0.72,
                greenScreenSize: 3,
            },
            hideHead: false,
            element: () => mp.players.local,
            getPossibleList: createArray(0, 32),
            applyItem: headOverlayApplyCallback(5),
            filename: headOverlayFilenameCallback(5)
        },
        {
            name: 'complexion',
            camera: {
                height: 0.8,
                headingOffset: 30,
                fov: 40,
                distance: 0.72,
                greenScreenSize: 3,
            },
            hideHead: false,
            element: () => mp.players.local,
            getPossibleList: createArray(0, 11),
            applyItem: headOverlayApplyCallback(6),
            filename: headOverlayFilenameCallback(6)
        },
        {
            name: 'sundamage',
            camera: {
                height: 0.8,
                headingOffset: 30,
                fov: 40,
                distance: 0.72,
                greenScreenSize: 3,
            },
            hideHead: false,
            element: () => mp.players.local,
            getPossibleList: createArray(0, 10),
            applyItem: headOverlayApplyCallback(7),
            filename: headOverlayFilenameCallback(7)
        },
        {
            name: 'lipstick',
            camera: {
                height: 0.8,
                headingOffset: 30,
                fov: 40,
                distance: 0.72,
                greenScreenSize: 3,
            },
            hideHead: false,
            element: () => mp.players.local,
            getPossibleList: createArray(0, 9),
            applyItem: headOverlayApplyCallback(8),
            filename: headOverlayFilenameCallback(8)
        },
        {
            name: 'freckles',
            camera: {
                height: 0.8,
                headingOffset: 30,
                fov: 40,
                distance: 0.72,
                greenScreenSize: 3,
            },
            hideHead: false,
            element: () => mp.players.local,
            getPossibleList: createArray(0, 17),
            applyItem: headOverlayApplyCallback(9),
            filename: headOverlayFilenameCallback(9)
        },
    ];
    
    public static init() {
        CommandService.registerCommandHandler({
            command: '/greenscreen',
            description: 'Toggle green screen mode for screenshots',
            params: [
                { name: 'type', type: 'string' }
            ]
        }, (type: string) => {
            this.toggleGreenScreen(type);
        });

        mp.events.add('render', this.update.bind(this));
    }

    private static toggleGreenScreen(type: string) {
        const item = this.greenScreenData.find(gs => gs.name.toLowerCase() === type.toLowerCase());
        if (!item) {
            NotificationService.addNotification('error', 'Green screen', `No green screen found for type: ${type}`);
            return;
        }

        const viewEntity = item.element();
        if (!viewEntity) {
            NotificationService.addNotification('error', 'Green screen', `Could not get entity for green screen type: ${type}`);
            return;
        }

        viewEntity.freezePosition(true);
        const camera = this.createCamera(viewEntity, item);

        this.activeGreenScreen = {
            item,
            camera
        };

        this.takeScreenshots();
    }

    private static async takeScreenshots() {
        if (!this.activeGreenScreen) return;

        const element = this.activeGreenScreen.item.element();
        if (!element) return;
        
        mp.players.local.clearTasks();
        mp.players.local.clearTasksImmediately();
        await mp.game.waitAsync(200);

        const list = this.activeGreenScreen.item.getPossibleList(element);
        for (let item of list) {
            this.activeGreenScreen.item.applyItem(element, item, this.activeGreenScreen.item);

            // Wait a bit for the changes to apply
            await mp.game.waitAsync(100);
            const fileName = this.activeGreenScreen.item.filename(item);
            await this.takeScreenshot(element as PedMp, fileName);
        }
    }

    private static createCamera(viewEntity: EntityMp, data: GreenScreenItem) {
        const playerHeading = viewEntity.getHeading();
        const cameraSettings = data.camera;
        const playerFrontPosition = this.xyInFrontOfPos(viewEntity.position, playerHeading, cameraSettings.distance);

        const cameraPosition = new mp.Vector3(
            playerFrontPosition.x,
            playerFrontPosition.y,
            playerFrontPosition.z + cameraSettings.height
        );

        const pointAtCoord = new mp.Vector3(
            viewEntity.position.x,
            viewEntity.position.y,
            viewEntity.position.z + cameraSettings.height
        );

        const camera = mp.cameras.new(
            'default',
            cameraPosition,
            new mp.Vector3(0, 0, 0),
            cameraSettings.fov
        );

        camera.pointAtCoord(pointAtCoord.x, pointAtCoord.y, pointAtCoord.z);
        camera.setActive(true);
        mp.game.cam.renderScriptCams(true, false, 0, true, false);
        viewEntity.setHeading(playerHeading + cameraSettings.headingOffset);

        return camera;
    }

    private static update() {
        if (!this.activeGreenScreen) return;

        const position = this.activeGreenScreen.camera.getCoord();
        this.drawGreenScreenBox(position, this.activeGreenScreen.item.camera.greenScreenSize, [0, 255, 0, 255]);
    }

    private static drawGreenScreenBox(position: Vector3, size: number, color: [number, number, number, number]) {
        const a = new mp.Vector3(position.x - size / 2, position.y - size / 2, position.z);
        const b = new mp.Vector3(position.x + size / 2, position.y - size / 2, position.z);
        const c = new mp.Vector3(position.x + size / 2, position.y + size / 2, position.z);
        const d = new mp.Vector3(position.x - size / 2, position.y + size / 2, position.z);

        // roof
        const ra = new mp.Vector3(position.x - size / 2, position.y, position.z + size/2);
        const rb = new mp.Vector3(position.x + size / 2, position.y, position.z + size/2);

        DrawingService.drawPlane3D(a, b, position, size, '/white.png', color, true, 100, 100);
        DrawingService.drawPlane3D(b, c, position, size, '/white.png', color, true, 100, 100);
        DrawingService.drawPlane3D(c, d, position, size, '/white.png', color, true, 100, 100);
        DrawingService.drawPlane3D(d, a, position, size, '/white.png', color, true, 100, 100);
        DrawingService.drawPlane3D(ra, rb, position, size, '/white.png', color, true, 100, 100);
    }

    public static hideBodyParts(ped: PedMp, hideHead: boolean) {    
        mp.game.ped.setComponentVariation(ped.handle, 0, hideHead ? -1 : 0, 0, 0);
        mp.game.ped.setComponentVariation(ped.handle, 1, -1, -1, 0);
        mp.game.ped.setComponentVariation(ped.handle, 2, -1, -1, 0);
        mp.game.ped.setComponentVariation(ped.handle, 3, -1, -1, 0);
        mp.game.ped.setComponentVariation(ped.handle, 4, -1, -1, 0);
        mp.game.ped.setComponentVariation(ped.handle, 5, -1, -1, 0);
        mp.game.ped.setComponentVariation(ped.handle, 6, -1, -1, 0);
        mp.game.ped.setComponentVariation(ped.handle, 7, -1, -1, 0);
        mp.game.ped.setComponentVariation(ped.handle, 8, -1, -1, 0);
        mp.game.ped.setComponentVariation(ped.handle, 9, -1, -1, 0);
        mp.game.ped.setComponentVariation(ped.handle, 10, -1, -1, 0);
        mp.game.ped.setComponentVariation(ped.handle, 11, -1, -1, 0);

        mp.game.ped.clearAllProps(ped.handle);
    }

    private static async takeScreenshot(ped: PedMp, fileName: string) {
        ped.clearTasks();
        ped.clearTasksImmediately();

        mp.game.time.setTime(12, 0, 0);

        await mp.game.waitAsync(200);
        mp.gui.takeScreenshot(fileName, 1, 100, 0);
    }

    private static xyInFrontOfPos(pos: Vector3, heading: number, dist: number): Vector3 {
        heading *= Math.PI / 180;
        pos.x += (dist * Math.sin(-heading));
        pos.y += (dist * Math.cos(-heading));
        return pos;
    }
}