import csx from 'src/Utils/MergeClass';
import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import { CharacterGender } from '@shared/Models/Character/Character';
import { useState } from 'react';
import Parents from './Parents';
import GenderSelector from './GenderSelector';
import CustomSlider from './CustomSlider';
import RandomizeButton from './RandomizeButton';
import translate from '@shared/Translation/Translation';
export default function DNACategory({ characterAppearance, setCharacterAppearance, randomize }) {
    const [parentOption, setParentOption] = useState(CharacterGender.Female);
    const femaleParents = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];
    const maleParents = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];
    return (<>
            <GenderSelector gender={characterAppearance.gender} setGender={(gender) => setCharacterAppearance([['gender', gender]])}/>

            <div className={styles.label} style={{ marginTop: '1rem' }}>{translate('character.creator.dna.parents')}</div>
            <div className={styles.parentsMenu}>
                <div className={styles.parentsOptions}>
                    <div className={csx(styles.parentOption, parentOption === CharacterGender.Female && styles.active)} onClick={() => setParentOption(CharacterGender.Female)}>{translate('character.creator.dna.mother')}</div>
                    <div className={csx(styles.parentOption, parentOption === CharacterGender.Male && styles.active)} onClick={() => setParentOption(CharacterGender.Male)}>{translate('character.creator.dna.father')}</div>
                </div>
                
                <Parents gender={parentOption} options={parentOption === CharacterGender.Female ? femaleParents : maleParents} selected={parentOption === CharacterGender.Female ? characterAppearance.femaleParent : characterAppearance.maleParent} setSelected={parentOption === CharacterGender.Female ? (parent) => setCharacterAppearance([['femaleParent', parent]]) : (parent) => setCharacterAppearance([['maleParent', parent]])}/>
            </div>

            <div className={styles.label} style={{ marginTop: '1rem' }}>{translate('character.creator.dna.similarity')}</div>
            
            <CustomSlider label={translate('character.creator.dna.face')} value={characterAppearance.faceSimilarity} onChange={(similarity) => setCharacterAppearance([['faceSimilarity', similarity]])} min={0} max={100}/>

            <CustomSlider label={translate('character.creator.dna.skin')} value={characterAppearance.skinSimilarity} onChange={(similarity) => setCharacterAppearance([['skinSimilarity', similarity]])} min={0} max={100}/>

            <RandomizeButton style={{ marginTop: '0.5rem' }} onClick={randomize}/>
        </>);
}
