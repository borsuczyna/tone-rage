import { type CharacterAppearance, CharacterGender, eyebrows, eyeColors, hairColors } from '@shared/Models/Character/Character';
import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import ColorPicker from './ColorPicker';
import ImageSelector from './ImageSelector';
import CustomSlider from './CustomSlider';
import RandomizeButton from './RandomizeButton';

interface EyesCategoryProps {
    characterAppearance: CharacterAppearance;
    setCharacterAppearance: (values: [keyof CharacterAppearance, any][]) => void;
    randomize: () => void;
}

export default function EyesCategory({
    characterAppearance,
    setCharacterAppearance,
    randomize
}: EyesCategoryProps) {
    return (
        <>
            <div className={styles.label}>Eyes</div>
            <div className={styles.smallLabel}>Eyebrows</div>
            <ImageSelector 
                path={'/creator/heads'}
                selectedStyle={characterAppearance.eyebrowStyle}
                onStyleChange={(style) => setCharacterAppearance([['eyebrowStyle', style]])}
                availableStyles={eyebrows}
                gender={CharacterGender.Male}
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

            <RandomizeButton style={{marginTop: '0.5rem'}} onClick={randomize} />
        </>
    );
}