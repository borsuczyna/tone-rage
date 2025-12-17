import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import { CharacterGender } from '@shared/Models/Character';
import CustomSlider from './CustomSlider';
import Control2D from './Control2D';
import ColorPicker from './ColorPicker';
import NavigatorSelector from './NavigatorSelector';

interface EyesCategoryProps {
    gender: CharacterGender;
    squinting: number;
    setSquinting: (value: number) => void;
    eyeColor: string;
    setEyeColor: (color: string) => void;
    eyebrowType: number;
    setEyebrowType: (type: number) => void;
    eyebrowSize: number;
    setEyebrowSize: (size: number) => void;
    eyebrowColor: string;
    setEyebrowColor: (color: string) => void;
    eyebrowHeight: number;
    setEyebrowHeight: (height: number) => void;
    eyebrowDepth: number;
    setEyebrowDepth: (depth: number) => void;
}

export default function EyesCategory({
    gender,
    squinting,
    setSquinting,
    eyeColor,
    setEyeColor,
    eyebrowType,
    setEyebrowType,
    eyebrowSize,
    setEyebrowSize,
    eyebrowColor,
    setEyebrowColor,
    eyebrowHeight,
    setEyebrowHeight,
    eyebrowDepth,
    setEyebrowDepth
}: EyesCategoryProps) {
    // Eye colors
    const eyeColors = [
        '#8B4513', // Brown
        '#654321', // Dark Brown  
        '#4A4A4A', // Dark Gray
        '#228B22', // Green
        '#006400', // Dark Green
        '#32CD32', // Light Green
        '#0000FF', // Blue
        '#000080', // Navy Blue
        '#87CEEB', // Sky Blue
        '#800080', // Purple
        '#4B0082', // Indigo
        '#FF69B4', // Pink
        '#8A2BE2', // Blue Violet
        '#FFD700', // Gold
        '#FFA500', // Orange
        '#DC143C', // Crimson
        '#000000', // Black
        '#2F4F4F'  // Dark Slate Gray
    ];

    // Hair colors for eyebrows
    const hairColors = [
        '#000000', '#2c1b18', '#5d4037', '#8d6e63', '#a1887f', '#d7ccc8',
        '#ffcc80', '#fff59d', '#ffecb3', '#f44336', '#e91e63', '#9c27b0',
        '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#4caf50', '#cddc39',
        '#ffeb3b', '#ff9800', '#795548', '#607d8b', '#9e9e9e', '#ffffff'
    ];

    // Available eyebrow types
    const maleEyebrowTypes = Array.from({ length: 34 }, (_, i) => i); // 0-33
    const femaleEyebrowTypes = Array.from({ length: 34 }, (_, i) => i); // 0-33
    
    const availableEyebrowTypes = gender === CharacterGender.Male ? maleEyebrowTypes : femaleEyebrowTypes;

    return (
        <>
            <div className={styles.label}>Eyes</div>
            <CustomSlider 
                label="Squinting"
                value={squinting}
                onChange={setSquinting}
                min={0}
                max={100}
            />

            <div className={styles.smallLabel} style={{ marginTop: '1rem' }}>Eye Color</div>
            <ColorPicker 
                selectedColor={eyeColor}
                onColorChange={setEyeColor}
                colors={eyeColors}
            />

            <div className={styles.label} style={{ marginTop: '1rem' }}>Eyebrows</div>
            
            <NavigatorSelector
                label="Type"
                selectedValue={eyebrowType}
                onValueChange={setEyebrowType}
                availableValues={availableEyebrowTypes}
            />

            <CustomSlider 
                label="Size"
                value={eyebrowSize}
                onChange={setEyebrowSize}
                min={0}
                max={100}
            />

            <div className={styles.smallLabel} style={{ marginTop: '1rem' }}>Color</div>
            <ColorPicker 
                selectedColor={eyebrowColor}
                onColorChange={setEyebrowColor}
                colors={hairColors}
            />

            <Control2D
                labelX="Height"
                labelY="Depth"
                valueX={eyebrowHeight}
                valueY={eyebrowDepth}
                onChangeX={setEyebrowHeight}
                onChangeY={setEyebrowDepth}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />
        </>
    );
}