export const CharacterGender = {
    Male: 'male',
    Female: 'female'
} as const;

export type CharacterGender = typeof CharacterGender[keyof typeof CharacterGender];

export const maleHairStyles = Array.from({ length: 82 }, (_, i) => i).filter(i => i !== 23);
export const femaleHairStyles = Array.from({ length: 86 }, (_, i) => i).filter(i => i !== 24);

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

export interface CharacterAppearance {
    gender: CharacterGender;
    femaleParent: number;
    maleParent: number;
    faceSimilarity: number;
    skinSimilarity: number;
    hairStyle: number;
    hairColor: number;
    hairHighlightColor: number;
}

export function validateCharacterAppearance(appearance: CharacterAppearance): boolean {
    if (!Object.values(CharacterGender).includes(appearance.gender)) return false;
    if (appearance.femaleParent < 0 || appearance.femaleParent > 45) return false;
    if (appearance.maleParent < 0 || appearance.maleParent > 45) return false;
    if (appearance.faceSimilarity < 0 || appearance.faceSimilarity > 100) return false;
    if (appearance.skinSimilarity < 0 || appearance.skinSimilarity > 100) return false;

    const availableStyles = appearance.gender === CharacterGender.Male ? maleHairStyles : femaleHairStyles;
    if (!availableStyles.includes(appearance.hairStyle)) return false;

    if (appearance.hairColor < 0 || appearance.hairColor >= hairColors.length) return false;
    if (appearance.hairHighlightColor < 0 || appearance.hairHighlightColor >= hairColors.length) return false;

    return true;
}