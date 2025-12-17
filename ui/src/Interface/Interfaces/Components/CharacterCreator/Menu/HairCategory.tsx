import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import { CharacterGender, femaleHairStyles, hairColors, maleHairStyles } from '@shared/Models/Character';
// import CustomSlider from './CustomSlider';
// import ColorPicker from './ColorPicker';
import HairStyleSelector from './HairStyleSelector';
import ColorPicker from './ColorPicker';

interface HairCategoryProps {
    gender: CharacterGender;
    hairStyle: number;
    setHairStyle: (style: number) => void;
    hairColor: number;
    setHairColor: (color: number) => void;
    hairHighlightColor: number;
    setHairHighlightColor: (color: number) => void;
    // hairLength: number;
    // setHairLength: (length: number) => void;
    // hairOpacity: number;
    // setHairOpacity: (opacity: number) => void;
}

export default function HairCategory({
    gender,
    hairStyle,
    setHairStyle,
    hairColor,
    setHairColor,
    hairHighlightColor,
    setHairHighlightColor,
//     hairLength,
//     setHairLength,
//     hairOpacity,
//     setHairOpacity
}: HairCategoryProps) {
    const availableStyles = gender === CharacterGender.Male ? maleHairStyles : femaleHairStyles;

    return (
        <>
            <div className={styles.label}>Hair Style</div>
            <HairStyleSelector 
                selectedStyle={hairStyle}
                onStyleChange={setHairStyle}
                availableStyles={availableStyles}
                gender={gender}
            />

            <div className={styles.smallLabel}>Color</div>
            <ColorPicker 
                selectedColor={hairColors[hairColor].hex}
                onColorChange={(colorHex) => {
                    const colorIndex = hairColors.findIndex(c => c.hex === colorHex);
                    if (colorIndex !== -1) {
                        setHairColor(colorIndex);
                    }
                }}
                colors={hairColors.map(c => c.hex)}
            />

            <div className={styles.smallLabel}>Highlight Color</div>
            <ColorPicker 
                selectedColor={hairColors[hairHighlightColor].hex}
                onColorChange={(colorHex) => {
                    const colorIndex = hairColors.findIndex(c => c.hex === colorHex);
                    if (colorIndex !== -1) {
                        setHairHighlightColor(colorIndex);
                    }
                }}
                colors={hairColors.map(c => c.hex)}
            />

            {/* <div className={styles.label} style={{ marginTop: '1rem' }}>Hair Settings</div>
            
            <CustomSlider 
                label="Length"
                value={hairLength}
                onChange={setHairLength}
                min={0}
                max={100}
            />

            <CustomSlider 
                label="Opacity"
                value={hairOpacity}
                onChange={setHairOpacity}
                min={0}
                max={100}
            /> */}
        </>
    );
}