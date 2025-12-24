import { type CharacterAppearance } from '@shared/Models/Character/Character';
import GenderSelector from './GenderSelector';
import CustomSlider from './CustomSlider';
import translate from '@shared/Translation/Translation';
import CategoryName from './CategoryName';
import OptionLabel from './OptionLabel';
import HorizontalImageSelector from './HorizontalImageSelector';
import CreatorInfo from './CreatorInfo';

interface DNACategoryProps {
    characterAppearance: CharacterAppearance;
    setCharacterAppearance: (values: [keyof CharacterAppearance, any][]) => void;
}

export default function DNACategory({
    characterAppearance,
    setCharacterAppearance
}: DNACategoryProps) {
    const femaleParents = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];
    const maleParents = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];

    return (
        <>
            <CategoryName name={translate('character.creator.dna.title')} />
            <CreatorInfo />
            <GenderSelector gender={characterAppearance.gender} setGender={(gender) => setCharacterAppearance([['gender', gender]])} />

            <OptionLabel label={translate('character.creator.dna.parents')} marginTop />
            <HorizontalImageSelector options={femaleParents} path={'/creator/female/{id}.png'} selected={characterAppearance.femaleParent} setSelected={(parent) => setCharacterAppearance([['femaleParent', parent]])} />
            <HorizontalImageSelector options={maleParents} path={'/creator/male/{id}.png'} selected={characterAppearance.maleParent} setSelected={(parent) => setCharacterAppearance([['maleParent', parent]])} />

            <OptionLabel label={translate('character.creator.dna.similarity')} marginTop />
            
            <CustomSlider 
                label={translate('character.creator.dna.face')}
                value={characterAppearance.faceSimilarity}
                onChange={(similarity) => setCharacterAppearance([['faceSimilarity', similarity]])}
                min={0}
                max={100}
                valueLabelCallback={(value) => `${value}%`}
            />

            <CustomSlider 
                label={translate('character.creator.dna.skin')}
                value={characterAppearance.skinSimilarity}
                onChange={(similarity) => setCharacterAppearance([['skinSimilarity', similarity]])}
                min={0}
                max={100}
                valueLabelCallback={(value) => `${value}%`}
            />
        </>
    );
}