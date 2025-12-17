export const CharacterGender = {
    Male: 'male',
    Female: 'female'
} as const;

export type CharacterGender = typeof CharacterGender[keyof typeof CharacterGender];

export const maleHairStyles = Array.from({ length: 82 }, (_, i) => i).filter(i => i !== 23);
export const femaleHairStyles = Array.from({ length: 86 }, (_, i) => i).filter(i => i !== 24);