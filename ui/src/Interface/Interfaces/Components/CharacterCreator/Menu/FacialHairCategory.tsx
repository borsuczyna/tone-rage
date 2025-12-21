import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import { beards, type CharacterAppearance, CharacterGender, hairColors } from '@shared/Models/Character/Character';
import ImageSelector from './ImageSelector';
import ColorPicker from './ColorPicker';
import CustomSlider from './CustomSlider';

interface FacialHairCategoryProps {
    characterAppearance: CharacterAppearance;
    setCharacterAppearance: (values: [keyof CharacterAppearance, any][]) => void;
}

export default function FacialHairCategory({
    characterAppearance,
    setCharacterAppearance
}: FacialHairCategoryProps) {
    return (
        <>
            <div className={styles.label}>Facial Hair Style</div>
            <ImageSelector 
                path={'/creator/heads'}
                selectedStyle={characterAppearance.beardStyle}
                onStyleChange={(style) => setCharacterAppearance([['beardStyle', style]])}
                availableStyles={beards}
                gender={CharacterGender.Male}
                component={1}
                isOverlay={true}
            />

            <div className={styles.smallLabel}>Color</div>
            <ColorPicker 
                selectedColor={hairColors[characterAppearance.beardColor].hex}
                onColorChange={(colorHex) => {
                    const colorIndex = hairColors.findIndex(c => c.hex === colorHex);
                    if (colorIndex !== -1) {
                        setCharacterAppearance([['beardColor', colorIndex]]);
                    }
                }}
                colors={hairColors.map(c => c.hex)}
            />

            <CustomSlider 
                label="Length"
                value={characterAppearance.beardLength}
                onChange={(length) => setCharacterAppearance([['beardLength', length]])}
                min={0}
                max={100}
            />
        </>
    );
}