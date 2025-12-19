import { type CharacterAppearance, eyebrows, eyeColors, hairColors } from '@shared/Models/Character';
import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import ColorPicker from './ColorPicker';
import ImageSelector from './HairStyleSelector';
import CustomSlider from './CustomSlider';

interface EyesCategoryProps {
    characterAppearance: CharacterAppearance;
    setCharacterAppearance: (values: [keyof CharacterAppearance, any][]) => void;
}

export default function EyesCategory({
    characterAppearance,
    setCharacterAppearance
}: EyesCategoryProps) {
    return (
        <>
            <div className={styles.label}>Eyes</div>
            <div className={styles.smallLabel}>Eyebrows</div>
            <ImageSelector 
                selectedStyle={characterAppearance.eyebrowStyle}
                onStyleChange={(style) => setCharacterAppearance([['eyebrowStyle', style]])}
                availableStyles={eyebrows}
                gender={characterAppearance.gender}
                component={2}
                isOverlay={true}
            />
            <div className={styles.smallLabel}>Color</div>

            <ColorPicker 
                selectedColor={hairColors[characterAppearance.eyebrowColor].hex}
                onColorChange={(colorHex) => {
                    const colorIndex = hairColors.findIndex(c => c.hex === colorHex);
                    if (colorIndex !== -1) {
                        setCharacterAppearance([['eyebrowColor', colorIndex]]);
                    }
                }}
                colors={hairColors.map(c => c.hex)}
            />

            <CustomSlider 
                label="Length"
                value={characterAppearance.eyebrowLength}
                onChange={(length) => setCharacterAppearance([['eyebrowLength', length]])}
                min={0}
                max={100}
            />
            
            <div className={styles.smallLabel}>Eye color</div>
            <ColorPicker 
                selectedColor={eyeColors[characterAppearance.eyeColor].hex}
                onColorChange={(colorHex) => {
                    const colorIndex = eyeColors.findIndex(c => c.hex === colorHex);
                    if (colorIndex !== -1) {
                        setCharacterAppearance([['eyeColor', colorIndex]]);
                    }
                }}
                colors={eyeColors.map(c => c.hex)}
            />
        </>
    );
}