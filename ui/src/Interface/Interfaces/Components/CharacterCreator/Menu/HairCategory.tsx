import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import { CharacterGender, type CharacterAppearance, femaleHairStyles, hairColors, maleHairStyles } from '@shared/Models/Character/Character';
import ImageSelector from './ImageSelector';
import ColorPicker from './ColorPicker';

interface HairCategoryProps {
    characterAppearance: CharacterAppearance;
    setCharacterAppearance: (values: [keyof CharacterAppearance, any][]) => void;
}

export default function HairCategory({
    characterAppearance,
    setCharacterAppearance,
}: HairCategoryProps) {
    const availableStyles = characterAppearance.gender === CharacterGender.Male ? maleHairStyles : femaleHairStyles;

    return (
        <>
            <div className={styles.label}>Hair Style</div>
            <ImageSelector 
                path={'/creator/heads'}
                selectedStyle={characterAppearance.hairStyle}
                onStyleChange={(style) => setCharacterAppearance([['hairStyle', style]])}
                availableStyles={availableStyles}
                gender={characterAppearance.gender}
            />

            <div className={styles.smallLabel}>Color</div>
            <ColorPicker 
                selectedColor={hairColors[characterAppearance.hairColor].hex}
                onColorChange={(colorHex) => {
                    const colorIndex = hairColors.findIndex(c => c.hex === colorHex);
                    if (colorIndex !== -1) {
                        setCharacterAppearance([['hairColor', colorIndex]]);
                    }
                }}
                colors={hairColors.map(c => c.hex)}
            />

            <div className={styles.smallLabel}>Highlight Color</div>
            <ColorPicker 
                selectedColor={hairColors[characterAppearance.hairHighlightColor].hex}
                onColorChange={(colorHex) => {
                    const colorIndex = hairColors.findIndex(c => c.hex === colorHex);
                    if (colorIndex !== -1) {
                        setCharacterAppearance([['hairHighlightColor', colorIndex]]);
                    }
                }}
                colors={hairColors.map(c => c.hex)}
            />
        </>
    );
}