import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import { CharacterGender, type CharacterAppearance, femaleHairStyles, hairColors, maleHairStyles, beards } from '@shared/Models/Character/Character';
import ImageSelector from './ImageSelector';
import ColorPicker from './ColorPicker';
import translate from '@shared/Translation/Translation';
import CategoryName from './CategoryName';
import OptionLabel from './OptionLabel';
import CreatorInfo from './CreatorInfo';
import CustomSlider from './CustomSlider';

interface HairCategoryProps {
    characterAppearance: CharacterAppearance;
    setCharacterAppearance: (values: [keyof CharacterAppearance, any][]) => void;
}

export default function HairCategory({
    characterAppearance,
    setCharacterAppearance,
}: HairCategoryProps) {
    const availableStyles = characterAppearance.gender === CharacterGender.Male ? maleHairStyles : femaleHairStyles;

    return (
        <>
            <CategoryName name={translate('character.creator.hair.title')} />
            <CreatorInfo />
            
            <OptionLabel label={translate('character.creator.hair.style')} marginTop />
            <ImageSelector 
                path={'/creator/heads'}
                selectedStyle={characterAppearance.hairStyle}
                onStyleChange={(style) => setCharacterAppearance([['hairStyle', style]])}
                availableStyles={availableStyles}
                gender={characterAppearance.gender}
            />

            <OptionLabel label={translate('character.creator.hair.color')} marginTop />
            <ColorPicker 
                selectedColor={hairColors[characterAppearance.hairColor].hex}
                onColorChange={(colorHex) => {
                    const colorIndex = hairColors.findIndex(c => c.hex === colorHex);
                    if (colorIndex !== -1) {
                        setCharacterAppearance([['hairColor', colorIndex]]);
                    }
                }}
                colors={hairColors.map(c => c.hex)}
            />

            <OptionLabel label={translate('character.creator.hair.highlight')} marginTop />
            <ColorPicker 
                selectedColor={hairColors[characterAppearance.hairHighlightColor].hex}
                onColorChange={(colorHex) => {
                    const colorIndex = hairColors.findIndex(c => c.hex === colorHex);
                    if (colorIndex !== -1) {
                        setCharacterAppearance([['hairHighlightColor', colorIndex]]);
                    }
                }}
                colors={hairColors.map(c => c.hex)}
            />

            <OptionLabel label={translate('character.creator.facial.hair.style')} marginTop />
            <ImageSelector 
                path={'/creator/heads'}
                selectedStyle={characterAppearance.beardStyle}
                onStyleChange={(style) => setCharacterAppearance([['beardStyle', style]])}
                availableStyles={beards}
                gender={CharacterGender.Male}
                component={1}
                isOverlay={true}
            />

            <div className={styles.smallLabel}>{translate('character.creator.facial.hair.color')}</div>
            <ColorPicker 
                selectedColor={hairColors[characterAppearance.beardColor].hex}
                onColorChange={(colorHex) => {
                    const colorIndex = hairColors.findIndex(c => c.hex === colorHex);
                    if (colorIndex !== -1) {
                        setCharacterAppearance([['beardColor', colorIndex]]);
                    }
                }}
                colors={hairColors.map(c => c.hex)}
            />

            <CustomSlider 
                label={translate('character.creator.facial.hair.length')}
                value={characterAppearance.beardLength}
                onChange={(length) => setCharacterAppearance([['beardLength', length]])}
                min={0}
                max={100}
                valueLabelCallback={(value) => `${value}%`}
            />
        </>
    );
}