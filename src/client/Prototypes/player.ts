import { femaleHairOverlays, maleHairOverlays } from "@shared/Models/Character/Character";

let weaponWheel: any;
// Natives
const GET_HASH_NAME_FOR_COMPONENT = "0x0368B3A838070348";
const GET_SHOP_PED_APPAREL_FORCED_COMPONENT_COUNT = "0xC6B9DB42C04DD8C3";
const GET_FORCED_COMPONENT = "0x6C93ED8C2F74859B";

// Constants
const JENKINS_ZERO = mp.game.joaat("0") >> 0;
const freemodeMaleModel = mp.game.joaat("mp_m_freemode_01") >> 0;
const freemodeFemaleModel = mp.game.joaat("mp_f_freemode_01") >> 0;
const defaultCollection = mp.game.joaat("mpbeach_overlays") >> 0;
const defaultPreset = mp.game.joaat("fm_hair_fuzz") >> 0;
const charFreemodeMale = 3;
const charFreemodeFemale = 4;
const hairComponentIndex = 2;
const decalComponentIndex = 10;

// Maps
const freemodeMaleOverlays = new Map(); // preset hash -> collection hash
const freemodeFemaleOverlays = new Map(); // preset hash -> collection hash
const hairOverlayCache = new Map(); // hair component hash -> { collection, preset }

function findHairOverlay(hairHash: number, characterIndex: number) {
    if (hairOverlayCache.has(hairHash)) {
        return hairOverlayCache.get(hairHash);
    }

    let outForcedComponent = {
        hash: [0],
        index: [0],
        type: [0]
    };

    let outHairOverlay = {
        collection: defaultCollection,
        preset: defaultPreset
    };

    for (let i = 0, max = mp.game.invoke(GET_SHOP_PED_APPAREL_FORCED_COMPONENT_COUNT, hairHash); i < max; i++) {
        mp.game.invoke(GET_FORCED_COMPONENT, hairHash, i, outForcedComponent.hash, outForcedComponent.index, outForcedComponent.type);

        if (outForcedComponent.type[0] !== decalComponentIndex || outForcedComponent.hash[0] === -1 || outForcedComponent.hash[0] === 0 || outForcedComponent.hash[0] === JENKINS_ZERO) {
            continue;
        }

        const overlay = (characterIndex === charFreemodeMale ? freemodeMaleOverlays : freemodeFemaleOverlays).get(outForcedComponent.hash[0]);
        if (overlay) {
            outHairOverlay = {
                collection: overlay,
                preset: outForcedComponent.hash[0]
            };

            break;
        }
    }

    hairOverlayCache.set(hairHash, outHairOverlay);
    return outHairOverlay;
}

export function applyHairOverlayToEntity(entity: PlayerMp | PedMp, hairIndex: number) {
    if (!entity) {
        return;
    }

    const entityModel = entity.model >> 0;
    if (entityModel === freemodeMaleModel || entityModel === freemodeFemaleModel) {
        const hairHash = mp.game.invoke(GET_HASH_NAME_FOR_COMPONENT, entity.handle, hairComponentIndex, hairIndex, 0) >> 0;
        const { collection, preset } = findHairOverlay(hairHash, entityModel === freemodeMaleModel ? charFreemodeMale : charFreemodeFemale);

        entity.clearFacialDecorations();
        entity.setFacialDecoration(collection, preset);
    }
}

export function updateEntityHairOverlay(entity: PlayerMp | PedMp) {
    if (!entity) {
        return;
    }

    addHairDecorations(entity);
    
    const hairIndex = entity.getDrawableVariation(hairComponentIndex);
    applyHairOverlayToEntity(entity, hairIndex);
}

export function addHairDecorations(player: PlayerMp | PedMp) {
    const gender = player.model >> 0 === freemodeMaleModel ? 'male' : 'female';
    const hairStyle = player.getDrawableVariation(hairComponentIndex);
    
    if (gender === 'male') {
        if (maleHairOverlays[hairStyle] && maleHairOverlays[hairStyle].collection && maleHairOverlays[hairStyle].overlay) {
            // @ts-ignore
            mp.players.local.addDecorationFromHashes(
                mp.game.gameplay.getHashKey(maleHairOverlays[hairStyle].collection),
                mp.game.gameplay.getHashKey(maleHairOverlays[hairStyle].overlay)
            );
        }
    } else {
        if (femaleHairOverlays[hairStyle] && femaleHairOverlays[hairStyle].collection && femaleHairOverlays[hairStyle].overlay) {
            // @ts-ignore
            mp.players.local.addDecorationFromHashes(
                mp.game.gameplay.getHashKey(femaleHairOverlays[hairStyle].collection),
                mp.game.gameplay.getHashKey(femaleHairOverlays[hairStyle].overlay)
            );
        }
    }
}

// ---------------------------------------------------------------
//@ts-ignore
mp.Player.prototype.setWeaponWheel = function (status: boolean) {
    if (status) {
        weaponWheel = setInterval(() => {
            mp.game.ui.weaponWheelIgnoreSelection();
            mp.game.controls.disableControlAction(0, 37, true);
        });
    } else {
        if (weaponWheel) clearInterval(weaponWheel);
        mp.game.controls.disableControlAction(0, 37, false);
        weaponWheel = undefined;
    }
};

// ---------------------------------------------------------------
// Events
mp.events.add("entityStreamIn", (entity) => {
    if (entity.type === "object") {
        mp.console.logWarning(`Object streamed successfully! IsItem: ${entity.getVariable("is_item")}`);
    }

    if (entity.type === "player") {
        //@ts-ignore
        updateEntityHairOverlay(entity);
    }
});

mp.events.add("hairOverlay::update", (player, newHairIndex) => {
    applyHairOverlayToEntity(player, newHairIndex);
});
// ---------------------------------------------------------------