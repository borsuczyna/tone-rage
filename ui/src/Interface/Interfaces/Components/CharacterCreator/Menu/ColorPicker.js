import styles from '../../../Styles/CharacterCreatorInterface.module.css';
export default function ColorPicker({ selectedColor, onColorChange, colors }) {
    return (<div className={styles.colorGrid}>
            {colors.map((color, index) => (<div key={index} className={`${styles.colorBox} ${selectedColor === color ? styles.active : ''}`} style={{ backgroundColor: color }} onClick={() => onColorChange(color)}/>))}
        </div>);
}
