import csx from 'src/Utils/MergeClass';
import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import { CharacterGender } from '@shared/Models/Character/Character';
import { isInBrowser } from 'src/Interface/Main';

interface ImageSelectorProps {
    path: string;
    selectedStyle: number;
    onStyleChange: (style: number, index: number) => void;
    availableStyles: number[] | [number, number][];
    gender: CharacterGender;
    component?: number;
    isOverlay?: boolean;
}

export default function ImageSelector({ path, selectedStyle, onStyleChange, availableStyles, gender, component = 2, isOverlay = false }: ImageSelectorProps) {
    const imageName = isOverlay ?
        `headOverlay_${component}_o{id}_f${gender === CharacterGender.Male ? '' : '_f'}.png` :
        `component_${component}_d{id}_t{texture}_f${gender === CharacterGender.Male ? '' : '_f'}.png`;

    const pathUrl = isInBrowser() ? `/package2${path}` : `package2:/${path}`;

    const optionAsStr = (option: number | [number, number]) => {
        if (Array.isArray(option)) {
            return `${option[0]}_${option[1]}`;
        }
        return option;
    }

    const optionData = (option: number | [number, number]) => {
        if (Array.isArray(option)) {
            return option[0];
        }
        return option;
    }

    const optionTexture = (option: number | [number, number]) => {
        if (Array.isArray(option)) {
            return option[1];
        }
        return 0;
    }

    const getName = (option: number | [number, number]) => {
        let url = imageName
            .replace('{id}', optionData(option).toString())
            .replace('{texture}', optionTexture(option).toString());

        return url;
    }

    return (
        <div className={styles.parentsMenu}>
            <div className={styles.parentsList}>
                {availableStyles.map((option, index) => (
                    <div key={optionAsStr(option)} className={csx(styles.parentItem, selectedStyle === option && styles.active)} onClick={() => onStyleChange(optionData(option), index)}>
                        <img loading="lazy" src={`${pathUrl}/${getName(option)}`} width={64} height={64} />
                    </div>
                ))}
            </div>
        </div>
    );
}