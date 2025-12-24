import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import { beards, CharacterGender, hairColors } from '@shared/Models/Character/Character';
import ImageSelector from './ImageSelector';
import ColorPicker from './ColorPicker';
import CustomSlider from './CustomSlider';
import RandomizeButton from './RandomizeButton';
import translate from '@shared/Translation/Translation';
export default function FacialHairCategory({ characterAppearance, setCharacterAppearance, randomize }) {
    if (characterAppearance.gender !== CharacterGender.Male) {
        return <div className={styles.label}>{translate('character.creator.no.facial.hair.female')}</div>;
    }
    return (<>
            <div className={styles.label}>{translate('character.creator.facial.hair.style')}</div>
            <ImageSelector path={'/creator/heads'} selectedStyle={characterAppearance.beardStyle} onStyleChange={(style) => setCharacterAppearance([['beardStyle', style]])} availableStyles={beards} gender={CharacterGender.Male} component={1} isOverlay={true}/>

            <div className={styles.smallLabel}>{translate('character.creator.facial.hair.color')}</div>
            <ColorPicker selectedColor={hairColors[characterAppearance.beardColor].hex} onColorChange={(colorHex) => {
            const colorIndex = hairColors.findIndex(c => c.hex === colorHex);
            if (colorIndex !== -1) {
                setCharacterAppearance([['beardColor', colorIndex]]);
            }
        }} colors={hairColors.map(c => c.hex)}/>

            <CustomSlider label={translate('character.creator.facial.hair.length')} value={characterAppearance.beardLength} onChange={(length) => setCharacterAppearance([['beardLength', length]])} min={0} max={100}/>

            <RandomizeButton style={{ marginTop: '0.5rem' }} onClick={randomize}/>
        </>);
}
