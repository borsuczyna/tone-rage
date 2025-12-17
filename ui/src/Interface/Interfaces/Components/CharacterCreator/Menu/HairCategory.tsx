import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import { CharacterGender } from '@shared/Models/Character';
import CustomSlider from './CustomSlider';
import ColorPicker from './ColorPicker';
import HairStyleSelector from './HairStyleSelector';

interface HairCategoryProps {
    gender: CharacterGender;
    hairStyle: number;
    setHairStyle: (style: number) => void;
    hairColor: string;
    setHairColor: (color: string) => void;
    hairHighlightColor: string;
    setHairHighlightColor: (color: string) => void;
    hairLength: number;
    setHairLength: (length: number) => void;
    hairOpacity: number;
    setHairOpacity: (opacity: number) => void;
}

export default function HairCategory({
    gender,
    hairStyle,
    setHairStyle,
    hairColor,
    setHairColor,
    hairHighlightColor,
    setHairHighlightColor,
    hairLength,
    setHairLength,
    hairOpacity,
    setHairOpacity
}: HairCategoryProps) {
    // Hair colors array with common hair colors
    const hairColors = [
        '#000000', // Black
        '#2c1b18', // Dark Brown
        '#5d4037', // Brown
        '#8d6e63', // Light Brown
        '#a1887f', // Ash Brown
        '#d7ccc8', // Light Ash
        '#ffcc80', // Blonde
        '#fff59d', // Light Blonde
        '#ffecb3', // Platinum Blonde
        '#f44336', // Red
        '#e91e63', // Pink
        '#9c27b0', // Purple
        '#673ab7', // Deep Purple
        '#3f51b5', // Indigo
        '#2196f3', // Blue
        '#00bcd4', // Cyan
        '#4caf50', // Green
        '#cddc39', // Lime
        '#ffeb3b', // Yellow
        '#ff9800', // Orange
        '#795548', // Auburn
        '#607d8b', // Blue Grey
        '#9e9e9e', // Grey
        '#ffffff'  // White
    ];

    // Available hair styles (0-indexed, will display as 1-indexed)
    const maleHairStyles = Array.from({ length: 25 }, (_, i) => i); // 0-24
    const femaleHairStyles = Array.from({ length: 25 }, (_, i) => i); // 0-24

    const availableStyles = gender === CharacterGender.Male ? maleHairStyles : femaleHairStyles;

    return (
        <>
            <div className={styles.label}>Hair Style</div>
            <HairStyleSelector 
                selectedStyle={hairStyle}
                onStyleChange={setHairStyle}
                availableStyles={availableStyles}
            />

            <div className={styles.smallLabel}>Color</div>
            <ColorPicker 
                selectedColor={hairColor}
                onColorChange={setHairColor}
                colors={hairColors}
            />

            <div className={styles.smallLabel}>Highlight Color</div>
            <ColorPicker 
                selectedColor={hairHighlightColor}
                onColorChange={setHairHighlightColor}
                colors={hairColors}
            />

            <div className={styles.label} style={{ marginTop: '1rem' }}>Hair Settings</div>
            
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
            />
        </>
    );
}