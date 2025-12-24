import { type CharacterAppearance, CharacterGender, eyebrows, eyeColors, hairColors } from '@shared/Models/Character/Character';
import ColorPicker from './ColorPicker';
import ImageSelector from './ImageSelector';
import CustomSlider from './CustomSlider';
import translate from '@shared/Translation/Translation';
import CategoryName from './CategoryName';
import CreatorInfo from './CreatorInfo';
import OptionLabel from './OptionLabel';

interface EyesCategoryProps {
    characterAppearance: CharacterAppearance;
    setCharacterAppearance: (values: [keyof CharacterAppearance, any][]) => void;
}

export default function EyesCategory({
    characterAppearance,
    setCharacterAppearance,
}: EyesCategoryProps) {
    return (
        <>
            <CategoryName name={translate('character.creator.eyes.title')} />
            <CreatorInfo />
            
            <OptionLabel label={translate('character.creator.eyes.color')} marginTop />
            <ColorPicker 
                selectedColor={eyeColors[characterAppearance.eyeColor].hex}
                onColorChange={(colorHex) => {
                    const colorIndex = eyeColors.findIndex(c => c.hex === colorHex);
                    if (colorIndex !== -1) {
                        setCharacterAppearance([['eyeColor', colorIndex]]);
                    }
                }}
                colors={eyeColors.map(c => c.hex)}
            />

            <OptionLabel label={translate('character.creator.facial.hair.eyebrows')} marginTop />
            <ImageSelector 
                path={'/creator/heads'}
                selectedStyle={characterAppearance.eyebrowStyle}
                onStyleChange={(style) => setCharacterAppearance([['eyebrowStyle', style]])}
                availableStyles={eyebrows}
                gender={CharacterGender.Male}
                component={2}
                isOverlay={true}
            />

            <OptionLabel label={translate('character.creator.hair.color')} marginTop />
            <ColorPicker 
                selectedColor={hairColors[characterAppearance.eyebrowColor].hex}
                onColorChange={(colorHex) => {
                    const colorIndex = hairColors.findIndex(c => c.hex === colorHex);
                    if (colorIndex !== -1) {
                        setCharacterAppearance([['eyebrowColor', colorIndex]]);
                    }
                }}
                colors={hairColors.map(c => c.hex)}
            />

            <CustomSlider 
                label={translate('character.creator.eyebrow.length')}
                value={characterAppearance.eyebrowLength}
                onChange={(length) => setCharacterAppearance([['eyebrowLength', length]])}
                min={0}
                max={100}
                valueLabelCallback={(value) => `${value}%`}
            />
        </>
    );
}