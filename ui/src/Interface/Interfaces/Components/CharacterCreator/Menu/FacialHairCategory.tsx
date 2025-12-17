import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import { CharacterGender } from '@shared/Models/Character';
import CustomSlider from './CustomSlider';
import ColorPicker from './ColorPicker';
import NavigatorSelector from './NavigatorSelector';

interface FacialHairCategoryProps {
    gender: CharacterGender;
    beardStyle: number;
    setBeardStyle: (style: number) => void;
    beardColor: string;
    setBeardColor: (color: string) => void;
    beardSize: number;
    setBeardSize: (size: number) => void;
}

export default function FacialHairCategory({
    gender,
    beardStyle,
    setBeardStyle,
    beardColor,
    setBeardColor,
    beardSize,
    setBeardSize
}: FacialHairCategoryProps) {
    // Hair colors array (reusing from hair category)
    const hairColors = [
        '#000000', '#2c1b18', '#5d4037', '#8d6e63', '#a1887f', '#d7ccc8',
        '#ffcc80', '#fff59d', '#ffecb3', '#f44336', '#e91e63', '#9c27b0',
        '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#4caf50', '#cddc39',
        '#ffeb3b', '#ff9800', '#795548', '#607d8b', '#9e9e9e', '#ffffff'
    ];

    // Available beard styles (0-28 for males, 0 for females typically)
    const maleBeardStyles = Array.from({ length: 29 }, (_, i) => i); // 0-28
    const femaleBeardStyles = [0]; // Usually no facial hair for females
    
    const availableStyles = gender === CharacterGender.Male ? maleBeardStyles : femaleBeardStyles;

    return (
        <>
            <div className={styles.label}>Facial Hair Style</div>
            <NavigatorSelector
                label="Style"
                selectedValue={beardStyle}
                onValueChange={setBeardStyle}
                availableValues={availableStyles}
            />

            <div className={styles.smallLabel}>Color</div>
            <ColorPicker 
                selectedColor={beardColor}
                onColorChange={setBeardColor}
                colors={hairColors}
            />

            <CustomSlider 
                label="Size"
                value={beardSize}
                onChange={setBeardSize}
                min={0}
                max={100}
            />
        </>
    );
}