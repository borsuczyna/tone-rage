import TopsMale from './tops-male.json';
import TopsFemale from './tops-female.json';
import LegsMale from './legs-male.json';
import LegsFemale from './legs-female.json';
import ShoesMale from './shoes-male.json';
import ShoesFemale from './shoes-female.json';
import UndershirtsMale from './undershirts-male.json';
import UndershirtsFemale from './undershirts-female.json';
import _MaleTopsData from './male-data.json';
import _FemaleTopsData from './female-data.json';
const maleTopsData = _MaleTopsData;
const femaleTopsData = _FemaleTopsData;
export const CharacterGender = {
    Male: 'male',
    Female: 'female'
};
export const clothingData = {
    tops: {
        [CharacterGender.Male]: TopsMale,
        [CharacterGender.Female]: TopsFemale
    },
    legs: {
        [CharacterGender.Male]: LegsMale,
        [CharacterGender.Female]: LegsFemale
    },
    shoes: {
        [CharacterGender.Male]: ShoesMale,
        [CharacterGender.Female]: ShoesFemale
    },
    undershirts: {
        [CharacterGender.Male]: UndershirtsMale,
        [CharacterGender.Female]: UndershirtsFemale
    }
};
export const maleHairStyles = Array.from({ length: 83 }, (_, i) => i).filter(i => i !== 23);
export const femaleHairStyles = Array.from({ length: 87 }, (_, i) => i).filter(i => i !== 24);
export const beards = Array.from({ length: 29 }, (_, i) => i);
export const eyebrows = Array.from({ length: 34 }, (_, i) => i);
export const blemishesStyles = Array.from({ length: 24 }, (_, i) => i);
export const ageingStyles = Array.from({ length: 15 }, (_, i) => i);
export const invalidMakeup = [16, 17, 18, 19, 20, 21, 23, 25, 26, 27, 28, 29, 30, 31, 33, 35, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74];
export const makeupStyles = Array.from({ length: 75 }, (_, i) => i).filter(i => !invalidMakeup.includes(i));
export const blushStyles = Array.from({ length: 8 }, (_, i) => i);
export const complexionStyles = Array.from({ length: 12 }, (_, i) => i);
export const sunDamageStyles = Array.from({ length: 11 }, (_, i) => i);
export const lipstickStyles = Array.from({ length: 10 }, (_, i) => i);
export const frecklesStyles = Array.from({ length: 18 }, (_, i) => i);
export function isClothingValid(gender, type, id, texture) {
    if (id === 0)
        return true; // default clothing
    let data = clothingData[type][gender];
    const item = data.find(c => c.id === id);
    if (!item)
        return false;
    const textureIndex = item.textures.indexOf(texture);
    return textureIndex !== -1;
}
export function getClothingItemById(gender, category, id) {
    const categoryItems = clothingData[category][gender];
    return categoryItems.find(item => item.id === id) || null;
}
export function getRandomClothingItem(gender, type) {
    let data = clothingData[type][gender];
    const item = data[Math.floor(Math.random() * data.length)];
    const texture = item.textures[Math.floor(Math.random() * item.textures.length)];
    return { id: item.id, texture };
}
export function findBestDataForTop(gender, topId) {
    const data = gender === CharacterGender.Male ? maleTopsData : femaleTopsData;
    if (data[topId]) {
        return data[topId];
    }
    else {
        return null;
    }
}
export function getBestTorsoForTop(gender, topId) {
    const data = findBestDataForTop(gender, topId);
    return data?.torso ?? (gender == CharacterGender.Male ? 15 : 4);
}
export function getBestUndershirtsForTop(gender, topId) {
    const data = findBestDataForTop(gender, topId);
    const ids = data?.undershirts ?? (gender == CharacterGender.Male ? [0] : [15]);
    return clothingData.undershirts[gender].filter(und => ids.includes(und.id));
}
export function getTopsData(gender) {
    return clothingData.tops[gender];
}
export const hairColors = [
    { r: 28, g: 31, b: 33, hex: '#1c1f21' },
    { r: 39, g: 42, b: 44, hex: '#272a2c' },
    { r: 49, g: 46, b: 44, hex: '#312e2c' },
    { r: 53, g: 38, b: 28, hex: '#35261c' },
    { r: 75, g: 50, b: 31, hex: '#4b321f' },
    { r: 92, g: 59, b: 36, hex: '#5c3b24' },
    { r: 109, g: 76, b: 53, hex: '#6d4c35' },
    { r: 107, g: 80, b: 59, hex: '#6b503b' },
    { r: 118, g: 92, b: 69, hex: '#765c45' },
    { r: 127, g: 104, b: 78, hex: '#7f684e' },
    { r: 153, g: 129, b: 93, hex: '#99815d' },
    { r: 167, g: 147, b: 105, hex: '#a79369' },
    { r: 175, g: 156, b: 112, hex: '#af9c70' },
    { r: 187, g: 160, b: 99, hex: '#bba063' },
    { r: 214, g: 185, b: 123, hex: '#d6b97b' },
    { r: 218, g: 195, b: 142, hex: '#dac38e' },
    { r: 159, g: 127, b: 89, hex: '#9f7f59' },
    { r: 132, g: 80, b: 57, hex: '#845039' },
    { r: 104, g: 43, b: 31, hex: '#682b1f' },
    { r: 97, g: 18, b: 12, hex: '#61120c' },
    { r: 100, g: 15, b: 10, hex: '#640f0a' },
    { r: 124, g: 20, b: 15, hex: '#7c140f' },
    { r: 160, g: 46, b: 25, hex: '#a02e19' },
    { r: 182, g: 75, b: 40, hex: '#b64b28' },
    { r: 162, g: 80, b: 47, hex: '#a2502f' },
    { r: 170, g: 78, b: 43, hex: '#aa4e2b' },
    { r: 98, g: 98, b: 98, hex: '#626262' },
    { r: 128, g: 128, b: 128, hex: '#808080' },
    { r: 170, g: 170, b: 170, hex: '#aaaaaa' },
    { r: 197, g: 197, b: 197, hex: '#c5c5c5' },
    { r: 70, g: 57, b: 85, hex: '#463955' },
    { r: 90, g: 63, b: 107, hex: '#5a3f6b' },
    { r: 118, g: 60, b: 118, hex: '#763c76' },
    { r: 237, g: 116, b: 227, hex: '#ed74e3' },
    { r: 235, g: 75, b: 147, hex: '#eb4b93' },
    { r: 242, g: 153, b: 188, hex: '#f299bc' },
    { r: 4, g: 149, b: 158, hex: '#04959e' },
    { r: 2, g: 95, b: 134, hex: '#025f86' },
    { r: 2, g: 57, b: 116, hex: '#023974' },
    { r: 63, g: 161, b: 106, hex: '#3fa16a' },
    { r: 33, g: 124, b: 97, hex: '#217c61' },
    { r: 24, g: 92, b: 85, hex: '#185c55' },
    { r: 182, g: 192, b: 52, hex: '#b6c034' },
    { r: 112, g: 169, b: 11, hex: '#70a90b' },
    { r: 67, g: 157, b: 19, hex: '#439d13' },
    { r: 220, g: 184, b: 87, hex: '#dcb857' },
    { r: 229, g: 177, b: 3, hex: '#e5b103' },
    { r: 230, g: 145, b: 2, hex: '#e69102' },
    { r: 242, g: 136, b: 49, hex: '#f28831' },
    { r: 251, g: 128, b: 87, hex: '#fb8057' },
    { r: 226, g: 139, b: 88, hex: '#e28b58' },
    { r: 209, g: 89, b: 60, hex: '#d1593c' },
    { r: 206, g: 49, b: 32, hex: '#ce3120' },
    { r: 173, g: 9, b: 3, hex: '#ad0903' },
    { r: 136, g: 3, b: 2, hex: '#880302' },
    { r: 31, g: 24, b: 20, hex: '#1f1814' },
    { r: 41, g: 31, b: 25, hex: '#291f19' },
    { r: 46, g: 34, b: 27, hex: '#2e221b' },
    { r: 55, g: 41, b: 30, hex: '#37291e' },
    { r: 46, g: 34, b: 24, hex: '#2e2218' },
    { r: 35, g: 27, b: 21, hex: '#231b15' },
    { r: 2, g: 2, b: 2, hex: '#020202' },
    { r: 112, g: 108, b: 102, hex: '#706c66' },
    { r: 157, g: 122, b: 80, hex: '#9d7a50' },
];
// 31 eye colors
export const eyeColors = [
    { r: 89, g: 39, b: 25, hex: '#BFC79A' },
    { r: 89, g: 39, b: 25, hex: '#539C4D' },
    { r: 89, g: 39, b: 25, hex: '#77807B' },
    { r: 89, g: 39, b: 25, hex: '#414A5E' },
    { r: 89, g: 39, b: 25, hex: '#E6B691' },
    { r: 89, g: 39, b: 25, hex: '#533F39' },
    { r: 89, g: 39, b: 25, hex: '#A1592A' },
    { r: 89, g: 39, b: 25, hex: '#535863' },
    { r: 89, g: 39, b: 25, hex: '#797A73' },
    { r: 89, g: 39, b: 25, hex: '#DB519F' },
    { r: 89, g: 39, b: 25, hex: '#CFC133' },
    { r: 89, g: 39, b: 25, hex: '#885AB2' },
    { r: 89, g: 39, b: 25, hex: '#182030' },
    { r: 89, g: 39, b: 25, hex: '#423E3A' },
    { r: 89, g: 39, b: 25, hex: '#DBA749' },
    // { r: 89, g: 39, b: 25, hex: '#D6D52F' }, // disabled
    // { r: 89, g: 39, b: 25, hex: '#9C9992' }, // disabled
    // { r: 89, g: 39, b: 25, hex: '#D42326' }, // disabled
    // { r: 89, g: 39, b: 25, hex: '#B33737' }, // disabled
    // { r: 89, g: 39, b: 25, hex: '#BDBDB7' }, // disabled
    // { r: 89, g: 39, b: 25, hex: '#BDBDB7' }, // disabled
    // { r: 89, g: 39, b: 25, hex: '#A8D450' }, // disabled
    // { r: 89, g: 39, b: 25, hex: '#C25D39' }, // disabled
    // { r: 89, g: 39, b: 25, hex: '#5F4996' }, // disabled
    // { r: 89, g: 39, b: 25, hex: '#8C7B5A' }, // disabled
    // { r: 89, g: 39, b: 25, hex: '#F2B141' }, // disabled
    // { r: 89, g: 39, b: 25, hex: '#000000' }, // disabled
    // { r: 89, g: 39, b: 25, hex: '#ff0000' }, // disabled
    // { r: 89, g: 39, b: 25, hex: '#ff0000' }, // disabled
    // { r: 89, g: 39, b: 25, hex: '#0000ff' }, // disabled
    // { r: 89, g: 39, b: 25, hex: '#ffffff' } // disabled
];
export const maleHairOverlays = {
    0: { collection: "mpbeach_overlays", overlay: "FM_Hair_Fuzz" },
    1: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_001" },
    2: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_002" },
    3: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_003" },
    4: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_004" },
    5: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_005" },
    6: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_006" },
    7: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_007" },
    8: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_008" },
    9: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_009" },
    10: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_013" },
    11: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_002" },
    12: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_011" },
    13: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_012" },
    14: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_014" },
    15: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_015" },
    16: { collection: "multiplayer_overlays", overlay: "NGBea_M_Hair_000" },
    17: { collection: "multiplayer_overlays", overlay: "NGBea_M_Hair_001" },
    18: { collection: "multiplayer_overlays", overlay: "NGBus_M_Hair_000" },
    19: { collection: "multiplayer_overlays", overlay: "NGBus_M_Hair_001" },
    20: { collection: "multiplayer_overlays", overlay: "NGHip_M_Hair_000" },
    21: { collection: "multiplayer_overlays", overlay: "NGHip_M_Hair_001" },
    22: { collection: "multiplayer_overlays", overlay: "NGInd_M_Hair_000" },
    24: { collection: "mplowrider_overlays", overlay: "LR_M_Hair_000" },
    25: { collection: "mplowrider_overlays", overlay: "LR_M_Hair_001" },
    26: { collection: "mplowrider_overlays", overlay: "LR_M_Hair_002" },
    27: { collection: "mplowrider_overlays", overlay: "LR_M_Hair_003" },
    28: { collection: "mplowrider2_overlays", overlay: "LR_M_Hair_004" },
    29: { collection: "mplowrider2_overlays", overlay: "LR_M_Hair_005" },
    30: { collection: "mplowrider2_overlays", overlay: "LR_M_Hair_006" },
    31: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_000_M" },
    32: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_001_M" },
    33: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_002_M" },
    34: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_003_M" },
    35: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_004_M" },
    36: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_005_M" },
    37: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_001" },
    38: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_002" },
    39: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_003" },
    40: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_004" },
    41: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_005" },
    42: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_006" },
    43: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_007" },
    44: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_008" },
    45: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_009" },
    46: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_013" },
    47: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_002" },
    48: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_011" },
    49: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_012" },
    50: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_014" },
    51: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_015" },
    52: { collection: "multiplayer_overlays", overlay: "NGBea_M_Hair_000" },
    53: { collection: "multiplayer_overlays", overlay: "NGBea_M_Hair_001" },
    54: { collection: "multiplayer_overlays", overlay: "NGBus_M_Hair_000" },
    55: { collection: "multiplayer_overlays", overlay: "NGBus_M_Hair_001" },
    56: { collection: "multiplayer_overlays", overlay: "NGHip_M_Hair_000" },
    57: { collection: "multiplayer_overlays", overlay: "NGHip_M_Hair_001" },
    58: { collection: "multiplayer_overlays", overlay: "NGInd_M_Hair_000" },
    59: { collection: "mplowrider_overlays", overlay: "LR_M_Hair_000" },
    60: { collection: "mplowrider_overlays", overlay: "LR_M_Hair_001" },
    61: { collection: "mplowrider_overlays", overlay: "LR_M_Hair_002" },
    62: { collection: "mplowrider_overlays", overlay: "LR_M_Hair_003" },
    63: { collection: "mplowrider2_overlays", overlay: "LR_M_Hair_004" },
    64: { collection: "mplowrider2_overlays", overlay: "LR_M_Hair_005" },
    65: { collection: "mplowrider2_overlays", overlay: "LR_M_Hair_006" },
    66: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_000_M" },
    67: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_001_M" },
    68: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_002_M" },
    69: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_003_M" },
    70: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_004_M" },
    71: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_005_M" },
    72: {
        collection: "mpgunrunning_overlays",
        overlay: "MP_Gunrunning_Hair_M_000_M"
    },
    73: {
        collection: "mpgunrunning_overlays",
        overlay: "MP_Gunrunning_Hair_M_001_M"
    }
};
export const femaleHairOverlays = {
    0: { collection: "mpbeach_overlays", overlay: "FM_Hair_Fuzz" },
    1: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_001" },
    2: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_002" },
    3: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_003" },
    4: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_004" },
    5: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_005" },
    6: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_006" },
    7: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_007" },
    8: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_008" },
    9: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_009" },
    10: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_010" },
    11: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_011" },
    12: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_012" },
    13: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_013" },
    14: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_014" },
    15: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_015" },
    16: { collection: "multiplayer_overlays", overlay: "NGBea_F_Hair_000" },
    17: { collection: "multiplayer_overlays", overlay: "NGBea_F_Hair_001" },
    18: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_007" },
    19: { collection: "multiplayer_overlays", overlay: "NGBus_F_Hair_000" },
    20: { collection: "multiplayer_overlays", overlay: "NGBus_F_Hair_001" },
    21: { collection: "multiplayer_overlays", overlay: "NGBea_F_Hair_001" },
    22: { collection: "multiplayer_overlays", overlay: "NGHip_F_Hair_000" },
    23: { collection: "multiplayer_overlays", overlay: "NGInd_F_Hair_000" },
    25: { collection: "mplowrider_overlays", overlay: "LR_F_Hair_000" },
    26: { collection: "mplowrider_overlays", overlay: "LR_F_Hair_001" },
    27: { collection: "mplowrider_overlays", overlay: "LR_F_Hair_002" },
    28: { collection: "mplowrider2_overlays", overlay: "LR_F_Hair_003" },
    29: { collection: "mplowrider2_overlays", overlay: "LR_F_Hair_003" },
    30: { collection: "mplowrider2_overlays", overlay: "LR_F_Hair_004" },
    31: { collection: "mplowrider2_overlays", overlay: "LR_F_Hair_006" },
    32: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_000_F" },
    33: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_001_F" },
    34: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_002_F" },
    35: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_003_F" },
    36: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_003" },
    37: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_006_F" },
    38: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_004_F" },
    39: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_001" },
    40: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_002" },
    41: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_003" },
    42: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_004" },
    43: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_005" },
    44: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_006" },
    45: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_007" },
    46: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_008" },
    47: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_009" },
    48: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_010" },
    49: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_011" },
    50: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_012" },
    51: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_013" },
    52: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_014" },
    53: { collection: "multiplayer_overlays", overlay: "NG_M_Hair_015" },
    54: { collection: "multiplayer_overlays", overlay: "NGBea_F_Hair_000" },
    55: { collection: "multiplayer_overlays", overlay: "NGBea_F_Hair_001" },
    56: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_007" },
    57: { collection: "multiplayer_overlays", overlay: "NGBus_F_Hair_000" },
    58: { collection: "multiplayer_overlays", overlay: "NGBus_F_Hair_001" },
    59: { collection: "multiplayer_overlays", overlay: "NGBea_F_Hair_001" },
    60: { collection: "multiplayer_overlays", overlay: "NGHip_F_Hair_000" },
    61: { collection: "multiplayer_overlays", overlay: "NGInd_F_Hair_000" },
    62: { collection: "mplowrider_overlays", overlay: "LR_F_Hair_000" },
    63: { collection: "mplowrider_overlays", overlay: "LR_F_Hair_001" },
    64: { collection: "mplowrider_overlays", overlay: "LR_F_Hair_002" },
    65: { collection: "mplowrider2_overlays", overlay: "LR_F_Hair_003" },
    66: { collection: "mplowrider2_overlays", overlay: "LR_F_Hair_003" },
    67: { collection: "mplowrider2_overlays", overlay: "LR_F_Hair_004" },
    68: { collection: "mplowrider2_overlays", overlay: "LR_F_Hair_006" },
    69: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_000_F" },
    70: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_001_F" },
    71: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_002_F" },
    72: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_003_F" },
    73: { collection: "multiplayer_overlays", overlay: "NG_F_Hair_003" },
    74: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_006_F" },
    75: { collection: "mpbiker_overlays", overlay: "MP_Biker_Hair_004_F" },
    76: {
        collection: "mpgunrunning_overlays",
        overlay: "MP_Gunrunning_Hair_F_000_F"
    },
    77: {
        collection: "mpgunrunning_overlays",
        overlay: "MP_Gunrunning_Hair_F_001_F"
    }
};
export function validateCharacterAppearance(appearance) {
    if (!Object.values(CharacterGender).includes(appearance.gender))
        return [false, "Invalid gender"];
    if (appearance.femaleParent < 0 || appearance.femaleParent > 45)
        return [false, "Invalid female parent value"];
    if (appearance.maleParent < 0 || appearance.maleParent > 45)
        return [false, "Invalid male parent value"];
    if (appearance.faceSimilarity < 0 || appearance.faceSimilarity > 100)
        return [false, "Invalid face similarity value"];
    if (appearance.skinSimilarity < 0 || appearance.skinSimilarity > 100)
        return [false, "Invalid skin similarity value"];
    const availableStyles = appearance.gender === CharacterGender.Male ? maleHairStyles : femaleHairStyles;
    if (!availableStyles.includes(appearance.hairStyle))
        return [false, "Invalid hair style"];
    if (appearance.hairColor < 0 || appearance.hairColor >= hairColors.length)
        return [false, "Invalid hair color"];
    if (appearance.hairHighlightColor < 0 || appearance.hairHighlightColor >= hairColors.length)
        return [false, "Invalid hair highlight color"];
    if (appearance.gender === CharacterGender.Male) {
        if (!beards.includes(appearance.beardStyle))
            return [false, "Invalid beard style"];
    }
    else {
        if (appearance.beardStyle !== 0)
            return [false, "Females cannot have beards"];
    }
    if (appearance.beardColor < 0 || appearance.beardColor >= hairColors.length)
        return [false, "Invalid beard color"];
    if (appearance.gender === CharacterGender.Female && appearance.beardLength !== 0)
        return [false, "Females cannot have beard length"];
    if (appearance.beardLength < 0 || appearance.beardLength > 100)
        return [false, "Invalid beard length"];
    if (appearance.eyeColor < 0 || appearance.eyeColor >= eyeColors.length)
        return [false, "Invalid eye color"];
    if (!eyebrows.includes(appearance.eyebrowStyle))
        return [false, "Invalid eyebrow style"];
    if (appearance.eyebrowColor < 0 || appearance.eyebrowColor >= hairColors.length)
        return [false, "Invalid eyebrow color"];
    if (appearance.eyebrowLength < 0 || appearance.eyebrowLength > 100)
        return [false, "Invalid eyebrow length"];
    if (!blemishesStyles.includes(appearance.blemishesStyle))
        return [false, "Invalid blemishes style"];
    if (!ageingStyles.includes(appearance.ageingStyle))
        return [false, "Invalid ageing style"];
    if (!makeupStyles.includes(appearance.makeupStyle))
        return [false, "Invalid makeup style"];
    if (!blushStyles.includes(appearance.blushStyle))
        return [false, "Invalid blush style"];
    if (!complexionStyles.includes(appearance.complexionStyle))
        return [false, "Invalid complexion style"];
    if (!sunDamageStyles.includes(appearance.sunDamageStyle))
        return [false, "Invalid sun damage style"];
    if (!lipstickStyles.includes(appearance.lipstickStyle))
        return [false, "Invalid lipstick style"];
    if (!frecklesStyles.includes(appearance.frecklesStyle))
        return [false, "Invalid freckles style"];
    if (appearance.noseWidth < 0 || appearance.noseWidth > 100)
        return [false, "Invalid nose width"];
    if (appearance.noseHeight < 0 || appearance.noseHeight > 100)
        return [false, "Invalid nose height"];
    if (appearance.noseLength < 0 || appearance.noseLength > 100)
        return [false, "Invalid nose length"];
    if (appearance.noseBridge < 0 || appearance.noseBridge > 100)
        return [false, "Invalid nose bridge"];
    if (appearance.noseTip < 0 || appearance.noseTip > 100)
        return [false, "Invalid nose tip"];
    if (appearance.noseBridgeShift < 0 || appearance.noseBridgeShift > 100)
        return [false, "Invalid nose bridge shift"];
    if (appearance.eyebrowHeight < 0 || appearance.eyebrowHeight > 100)
        return [false, "Invalid eyebrow height"];
    if (appearance.eyebrowWidth < 0 || appearance.eyebrowWidth > 100)
        return [false, "Invalid eyebrow width"];
    if (appearance.cheekboneHeight < 0 || appearance.cheekboneHeight > 100)
        return [false, "Invalid cheekbone height"];
    if (appearance.cheekboneWidth < 0 || appearance.cheekboneWidth > 100)
        return [false, "Invalid cheekbone width"];
    if (appearance.cheeksWidth < 0 || appearance.cheeksWidth > 100)
        return [false, "Invalid cheeks width"];
    if (appearance.eyesOpening < 0 || appearance.eyesOpening > 100)
        return [false, "Invalid eyes opening"];
    if (appearance.lipsThickness < 0 || appearance.lipsThickness > 100)
        return [false, "Invalid lips thickness"];
    if (appearance.jawWidth < 0 || appearance.jawWidth > 100)
        return [false, "Invalid jaw width"];
    if (appearance.jawHeight < 0 || appearance.jawHeight > 100)
        return [false, "Invalid jaw height"];
    if (appearance.chinLength < 0 || appearance.chinLength > 100)
        return [false, "Invalid chin length"];
    if (appearance.chinPosition < 0 || appearance.chinPosition > 100)
        return [false, "Invalid chin position"];
    if (appearance.chinWidth < 0 || appearance.chinWidth > 100)
        return [false, "Invalid chin width"];
    if (appearance.chinShape < 0 || appearance.chinShape > 100)
        return [false, "Invalid chin shape"];
    if (appearance.neckWidth < 0 || appearance.neckWidth > 100)
        return [false, "Invalid neck width"];
    if (appearance.blemishesOpacity < 0 || appearance.blemishesOpacity > 100)
        return [false, "Invalid blemishes opacity"];
    if (appearance.ageingOpacity < 0 || appearance.ageingOpacity > 100)
        return [false, "Invalid ageing opacity"];
    if (appearance.makeupOpacity < 0 || appearance.makeupOpacity > 100)
        return [false, "Invalid makeup opacity"];
    if (appearance.blushOpacity < 0 || appearance.blushOpacity > 100)
        return [false, "Invalid blush opacity"];
    if (appearance.complexionOpacity < 0 || appearance.complexionOpacity > 100)
        return [false, "Invalid complexion opacity"];
    if (appearance.sunDamageOpacity < 0 || appearance.sunDamageOpacity > 100)
        return [false, "Invalid sun damage opacity"];
    if (appearance.lipstickOpacity < 0 || appearance.lipstickOpacity > 100)
        return [false, "Invalid lipstick opacity"];
    if (appearance.frecklesOpacity < 0 || appearance.frecklesOpacity > 100)
        return [false, "Invalid freckles opacity"];
    if (appearance.blushColor < 0 || appearance.blushColor >= hairColors.length)
        return [false, "Invalid blush color"];
    if (appearance.lipstickColor < 0 || appearance.lipstickColor >= hairColors.length)
        return [false, "Invalid lipstick color"];
    if (!isClothingValid(appearance.gender, 'tops', appearance.topStyle, appearance.topTexture))
        return [false, "Invalid top clothing"];
    if (!isClothingValid(appearance.gender, 'shoes', appearance.shoesStyle, appearance.shoesTexture))
        return [false, "Invalid shoe clothing"];
    if (!isClothingValid(appearance.gender, 'legs', appearance.legsStyle, appearance.legsTexture))
        return [false, "Invalid legs clothing"];
    const undershirts = getBestUndershirtsForTop(appearance.gender, appearance.topStyle);
    const hasUndershirt = undershirts.some((item) => item.id === appearance.undershirtStyle && item.textures.includes(appearance.undershirtTexture));
    if (!hasUndershirt)
        return [false, "Invalid undershirt for selected top"];
    return [true, "Valid appearance"];
}
const getRandomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const getRandomArrayItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};
export function randomizeDNA(appearance) {
    return {
        ...appearance,
        femaleParent: getRandomValue(0, 45),
        maleParent: getRandomValue(0, 45),
        faceSimilarity: getRandomValue(0, 100),
        skinSimilarity: getRandomValue(0, 100),
    };
}
export function randomizeHair(appearance) {
    const availableHairStyles = appearance.gender === CharacterGender.Male ? maleHairStyles : femaleHairStyles;
    const hairColor = getRandomValue(0, hairColors.length - 1);
    const hairHighlightColor = getRandomValue(0, hairColors.length - 1);
    return {
        ...appearance,
        hairStyle: getRandomArrayItem(availableHairStyles),
        hairColor: hairColor,
        beardColor: hairColor,
        hairHighlightColor: hairHighlightColor,
        blushColor: hairColor,
    };
}
export function randomizeFacialHair(appearance) {
    const hairColor = appearance.hairColor;
    return {
        ...appearance,
        beardStyle: appearance.gender === CharacterGender.Male ? getRandomArrayItem(beards) : 0,
        beardColor: hairColor,
        beardLength: appearance.gender === CharacterGender.Male ? getRandomValue(0, 100) : 0,
    };
}
export function randomizeEyes(appearance) {
    return {
        ...appearance,
        eyeColor: eyeColors.indexOf(getRandomArrayItem(eyeColors)),
        eyebrowStyle: getRandomArrayItem(eyebrows),
        eyebrowColor: 0, // Default to black,
        eyebrowLength: getRandomValue(70, 100),
    };
}
export function randomizeFace(appearance) {
    const hairColor = appearance.hairColor;
    return {
        ...appearance,
        blemishesStyle: getRandomArrayItem(blemishesStyles),
        ageingStyle: getRandomArrayItem(ageingStyles),
        makeupStyle: getRandomArrayItem(makeupStyles),
        blushStyle: getRandomArrayItem(blushStyles),
        complexionStyle: getRandomArrayItem(complexionStyles),
        sunDamageStyle: getRandomArrayItem(sunDamageStyles),
        lipstickStyle: getRandomArrayItem(lipstickStyles),
        frecklesStyle: getRandomArrayItem(frecklesStyles),
        noseWidth: getRandomValue(0, 100),
        noseHeight: getRandomValue(0, 100),
        noseLength: getRandomValue(0, 100),
        noseBridge: getRandomValue(0, 100),
        noseTip: getRandomValue(0, 100),
        noseBridgeShift: getRandomValue(0, 100),
        eyebrowHeight: getRandomValue(0, 100),
        eyebrowWidth: getRandomValue(0, 100),
        cheekboneHeight: getRandomValue(0, 100),
        cheekboneWidth: getRandomValue(0, 100),
        cheeksWidth: getRandomValue(0, 100),
        eyesOpening: getRandomValue(0, 100),
        lipsThickness: getRandomValue(0, 100),
        jawWidth: getRandomValue(0, 100),
        jawHeight: getRandomValue(0, 100),
        chinLength: getRandomValue(0, 100),
        chinPosition: getRandomValue(0, 100),
        chinWidth: getRandomValue(0, 100),
        chinShape: getRandomValue(0, 100),
        neckWidth: getRandomValue(0, 100),
        blemishesOpacity: getRandomValue(0, 40),
        ageingOpacity: getRandomValue(0, 40),
        makeupOpacity: getRandomValue(0, 100),
        blushOpacity: getRandomValue(0, 100),
        complexionOpacity: getRandomValue(0, 100),
        sunDamageOpacity: getRandomValue(0, 100),
        lipstickOpacity: getRandomValue(0, 100),
        frecklesOpacity: getRandomValue(0, 100),
        blushColor: hairColor,
        lipstickColor: getRandomValue(0, hairColors.length - 1),
    };
}
export function randomizeClothes(appearance) {
    const randomTop = getRandomClothingItem(appearance.gender, 'tops');
    const randomLegs = getRandomClothingItem(appearance.gender, 'legs');
    const randomShoes = getRandomClothingItem(appearance.gender, 'shoes');
    const undershirts = getBestUndershirtsForTop(appearance.gender, randomTop.id);
    const randomUndershirt = getRandomArrayItem(undershirts);
    return {
        ...appearance,
        topStyle: randomTop.id,
        topTexture: randomTop.texture,
        legsStyle: randomLegs.id,
        legsTexture: randomLegs.texture,
        shoesStyle: randomShoes.id,
        shoesTexture: randomShoes.texture,
        undershirtStyle: randomUndershirt.id,
        undershirtTexture: getRandomArrayItem(randomUndershirt.textures),
    };
}
export function getRandomAppearance(gender) {
    let appearance = {
        gender: gender
    };
    appearance = randomizeDNA(appearance);
    appearance = randomizeHair(appearance);
    appearance = randomizeFacialHair(appearance);
    appearance = randomizeEyes(appearance);
    appearance = randomizeFace(appearance);
    appearance = randomizeClothes(appearance);
    return appearance;
}
export function getDefaultAppearance() {
    return {
        gender: CharacterGender.Male,
        femaleParent: 0,
        maleParent: 0,
        faceSimilarity: 50,
        skinSimilarity: 50,
        hairStyle: 0,
        hairColor: 0,
        hairHighlightColor: 0,
        beardStyle: 0,
        beardColor: 0,
        beardLength: 0,
        eyeColor: 0,
        eyebrowStyle: 0,
        eyebrowColor: 0,
        eyebrowLength: 50,
        blemishesStyle: 0,
        ageingStyle: 0,
        makeupStyle: 0,
        blushStyle: 0,
        blushColor: 0,
        complexionStyle: 0,
        sunDamageStyle: 0,
        lipstickStyle: 0,
        lipstickColor: 0,
        frecklesStyle: 0,
        noseWidth: 50,
        noseHeight: 50,
        noseLength: 50,
        noseBridge: 50,
        noseBridgeShift: 50,
        noseTip: 50,
        eyebrowHeight: 50,
        eyebrowWidth: 50,
        cheekboneHeight: 50,
        cheekboneWidth: 50,
        cheeksWidth: 50,
        eyesOpening: 50,
        lipsThickness: 50,
        jawWidth: 50,
        jawHeight: 50,
        chinLength: 50,
        chinPosition: 50,
        chinWidth: 50,
        chinShape: 50,
        neckWidth: 50,
        blemishesOpacity: 50,
        ageingOpacity: 50,
        makeupOpacity: 50,
        blushOpacity: 50,
        complexionOpacity: 50,
        sunDamageOpacity: 50,
        lipstickOpacity: 50,
        frecklesOpacity: 50,
        topStyle: 0,
        topTexture: 0,
        legsStyle: 0,
        legsTexture: 0,
        shoesStyle: 0,
        shoesTexture: 0,
        undershirtStyle: 15,
        undershirtTexture: 0,
    };
}
export function encodeCharacterAppearance(appearance) {
    const jsonString = JSON.stringify(appearance);
    let encoded;
    if (typeof btoa === 'function') {
        // @ts-ignore
        encoded = btoa(jsonString);
    }
    else {
        // @ts-ignore
        encoded = Buffer.from(jsonString, 'utf-8').toString('base64');
    }
    // Add simple obfuscation by reversing and adding prefix/suffix
    return `CC_${encoded.split('').reverse().join('')}_DATA`;
}
;
export function decodeCharacterAppearance(encodedData) {
    try {
        // Remove prefix/suffix and reverse
        if (!encodedData.startsWith('CC_') || !encodedData.endsWith('_DATA')) {
            console.warn("Encoded data has invalid format");
            return null;
        }
        const cleaned = encodedData.slice(3, -5); // Remove CC_ and _DATA
        const reversed = cleaned.split('').reverse().join('');
        let decoded;
        if (typeof atob === 'function') {
            // @ts-ignore
            decoded = atob(reversed);
        }
        else {
            // @ts-ignore
            decoded = Buffer.from(reversed, 'base64').toString('utf-8');
        }
        const appearance = JSON.parse(decoded);
        // Validate the decoded appearance
        const [isValid] = validateCharacterAppearance(appearance);
        if (isValid) {
            return appearance;
        }
        return null;
    }
    catch (error) {
        return null;
    }
}
;
