import csx from 'src/Utils/MergeClass';
import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import { PakImage } from '../../PakImage';
import { CharacterGender } from '@shared/Models/Character';

interface ImageSelectorProps {
    selectedStyle: number;
    onStyleChange: (style: number) => void;
    availableStyles: number[];
    gender: CharacterGender;
    component?: number;
    isOverlay?: boolean;
}

export default function ImageSelector({ selectedStyle, onStyleChange, availableStyles, gender, component = 2, isOverlay = false }: ImageSelectorProps) {
    const imageUrl = isOverlay ?
        `headOverlay_${component}_o{id}.png` :
        `component_${component}_d{id}_t0${gender === CharacterGender.Male ? '' : '_f'}.png`;

    return (
        <div className={styles.parentsMenu}>
            <div className={styles.parentsList}>
                {availableStyles.map((option) => (
                    <div key={option} className={csx(styles.parentItem, selectedStyle === option && styles.active)} onClick={() => onStyleChange(option)}>
                        <PakImage pak="/heads.pak" name={imageUrl.replace('{id}', option.toString())} width={64} height={64} />
                    </div>
                ))}
            </div>
        </div>
    );
}