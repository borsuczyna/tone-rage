import csx from 'src/Utils/MergeClass';
import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import { PakImage } from '../../PakImage';
import { CharacterGender } from '@shared/Models/Character';

interface HairStyleSelectorProps {
    selectedStyle: number;
    onStyleChange: (style: number) => void;
    availableStyles: number[];
    gender: CharacterGender;
}

export default function HairStyleSelector({ selectedStyle, onStyleChange, availableStyles, gender }: HairStyleSelectorProps) {
    const imageUrl = `component_2_d{id}_t0${gender === CharacterGender.Male ? '' : '_f'}.png`;

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