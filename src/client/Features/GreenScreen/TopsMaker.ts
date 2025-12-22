import InterfaceService from "@/Services/Infrastructure/InterfaceService";
import EventService from "@/Services/Infrastructure/EventService";
import NotificationService from "@/Services/Infrastructure/NotificationService";

export default class TopsMaker {
    private static data: Map<number, {undershirt?: number, undershirts?: number[], torso?: number}> = new Map();
    private static index = 0;
    private static clothes: { drawable: number; texture: number }[] = [];

    public static init() {
        InterfaceService.setInterfaceVisible('TopsMakerInterface', true);
        this.clothes = this.clothesListCallback(11);
        EventService.registerEventHandler('TopsMakerInterface:SetActiveUndershirt', this.setActiveUndershirt.bind(this));
        EventService.registerEventHandler('TopsMakerInterface:SetActiveTorso', this.setActiveTorso.bind(this));
        EventService.registerEventHandler('TopsMakerInterface:Next', this.next.bind(this));
        EventService.registerEventHandler('TopsMakerInterface:Prev', this.prev.bind(this));
        EventService.registerEventHandler('TopsMakerInterface:CopyToClipboard', this.copyToClipboard.bind(this));
        this.clothesApplyCallback(11, this.index);
    }

    private static clothesListCallback(componentId: number) {
        const result: any[] = [];
        const ped = mp.players.local;
        const drawableCount = ped.getNumberOfDrawableVariations(componentId);

        for (let i = 0; i < drawableCount; i++) {
            // for (let j = 0; j < ped.getNumberOfTextureVariations(componentId, i); j++) {
            //     result.push({ drawable: i, texture: j });
            // }
            
            result.push({ drawable: i, texture: 0 });
        }

        return result;
    }

    private static clothesApplyCallback(componentId: number, index: number) {
        const ped = mp.players.local as unknown as PedMp;
        ped.model = mp.game.joaat('mp_m_freemode_01');

        const itemData = this.clothes[index];
        if (!itemData) return;

        ped.setComponentVariation(componentId, itemData.drawable, itemData.texture, 2);
        const data = this.data.get(itemData.drawable);
        ped.setComponentVariation(8, data?.undershirt ?? 0, 0, 2); // 15 female
        ped.setComponentVariation(3, data?.torso ?? 15, 0, 2); // 4 female
    
    }

    private static setActiveUndershirt({ itemId }: { itemId: number }) {
        const cloth = this.clothes[this.index];
        mp.console.logInfo(`Setting active undershirt to ${itemId} for drawable ${cloth?.drawable}`);
        if (!cloth) return;
        const existingData = this.data.get(cloth.drawable) ?? {};
        existingData.undershirt = itemId;
        if (!existingData.undershirts) {
            existingData.undershirts = [];
        }
        if (!existingData.undershirts.includes(itemId)) {
            existingData.undershirts.push(itemId);
        } else {
            existingData.undershirts = existingData.undershirts.filter(id => id !== itemId);
        }
        this.data.set(cloth.drawable, existingData);
        this.clothesApplyCallback(11, this.index);
        this.sendUpdate();
    }

    private static setActiveTorso({ itemId }: { itemId: number }) {
        const cloth = this.clothes[this.index];
        mp.console.logInfo(`Setting active torso to ${itemId} for drawable ${cloth?.drawable}`);
        if (!cloth) return;
        const existingData = this.data.get(cloth.drawable) ?? {};
        existingData.torso = itemId;
        this.data.set(cloth.drawable, existingData);
        this.clothesApplyCallback(11, this.index);
        this.sendUpdate();
    }

    private static next() {
        if (this.index < this.clothes.length - 1) {
            this.index++;
            this.clothesApplyCallback(11, this.index);
            this.sendUpdate();
            NotificationService.addNotification('info', 'tops maker', `changed to top ${this.index + 1} of ${this.clothes.length}`);
        } else {
            NotificationService.addNotification('error', 'tops maker', 'no more tops available');
        }
    }

    private static prev() {
        if (this.index > 0) {
            this.index--;
            this.clothesApplyCallback(11, this.index);
            this.sendUpdate();
        }
    }

    private static sendUpdate() {
        InterfaceService.callInterfaceEvent('TopsMakerInterface:SetActiveUndershirt', { itemId: this.data.get(this.clothes[this.index].drawable)?.undershirt ?? 0 });
        InterfaceService.callInterfaceEvent('TopsMakerInterface:SetActiveTorso', { itemId: this.data.get(this.clothes[this.index].drawable)?.torso ?? 15 });
        InterfaceService.callInterfaceEvent('TopsMakerInterface:SetUndershirts', { itemIds: this.data.get(this.clothes[this.index].drawable)?.undershirts ?? [] });
    }

    private static copyToClipboard() {
        // InterfaceService.callInterfaceEvent('Clipboard:CopyText', { text: JSON.stringify(this.data) });
        const data: Record<number, { undershirt?: number; torso?: number }> = {};
        this.data.forEach((value, key) => {
            data[key] = value;
        });
        InterfaceService.callInterfaceEvent('Clipboard:CopyText', { text: JSON.stringify(data) });
        NotificationService.addNotification('success', 'tops maker', 'clothes data copied to clipboard');
    }
}