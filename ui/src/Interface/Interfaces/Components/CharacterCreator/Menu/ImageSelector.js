import csx from 'src/Utils/MergeClass';
import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import { CharacterGender } from '@shared/Models/Character/Character';
import PakImage from '../../PakImage';
export default function ImageSelector({ path, selectedStyle, onStyleChange, availableStyles, gender, component = 2, isOverlay = false }) {
    const imageName = isOverlay ?
        `headOverlay_${component}_o{id}_f${gender === CharacterGender.Male ? '' : '_f'}.png` :
        `component_${component}_d{id}_t{texture}_f${gender === CharacterGender.Male ? '' : '_f'}.png`;
    const pathUrl = `${path}.pak`;
    const optionAsStr = (option) => {
        if (Array.isArray(option)) {
            return `${option[0]}_${option[1]}`;
        }
        return option;
    };
    const optionData = (option) => {
        if (Array.isArray(option)) {
            return option[0];
        }
        return option;
    };
    const optionTexture = (option) => {
        if (Array.isArray(option)) {
            return option[1];
        }
        return 0;
    };
    const getName = (option) => {
        let url = imageName
            .replace('{id}', optionData(option).toString())
            .replace('{texture}', optionTexture(option).toString());
        return url;
    };
    const optionValue = (option) => {
        if (Array.isArray(option)) {
            return `${option[0]}_${option[1]}`;
        }
        return option;
    };
    return (<div className={styles.parentsMenu}>
            <div className={styles.parentsList}>
                {availableStyles.map((option, index) => (<div key={optionAsStr(option)} className={csx(styles.parentItem, optionValue(selectedStyle) === optionValue(option) && styles.active)} onClick={() => onStyleChange(optionData(option), index)}>
                        {/* <img loading="lazy" src={`${pathUrl}/${getName(option)}`} width={64} height={64} /> */}
                        <PakImage pak={pathUrl} image={getName(option)} width={64} height={64}/>
                    </div>))}
            </div>
        </div>);
}
