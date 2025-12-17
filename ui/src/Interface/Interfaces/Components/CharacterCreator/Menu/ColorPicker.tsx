import styles from '../../../Styles/CharacterCreatorInterface.module.css';

interface ColorPickerProps {
    selectedColor: string;
    onColorChange: (color: string) => void;
    colors: string[];
}

export default function ColorPicker({ selectedColor, onColorChange, colors }: ColorPickerProps) {
    return (
        <div className={styles.colorGrid}>
            {colors.map((color, index) => (
                <div
                    key={index}
                    className={`${styles.colorBox} ${selectedColor === color ? styles.active : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => onColorChange(color)}
                />
            ))}
        </div>
    );
}