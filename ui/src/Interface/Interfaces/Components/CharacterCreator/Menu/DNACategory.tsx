import csx from 'src/Utils/MergeClass';
import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import { CharacterGender } from '@shared/Models/Character';
import { useState } from 'react';
import Parents from './Parents';
import GenderSelector from './GenderSelector';
import CustomSlider from './CustomSlider';

interface DNACategoryProps {
    gender: CharacterGender;
    setGender: (gender: CharacterGender) => void;
    femaleParent: number;
    setFemaleParent: (parent: number) => void;
    maleParent: number;
    setMaleParent: (parent: number) => void;
    faceSimilarity: number;
    setFaceSimilarity: (similarity: number) => void;
    skinSimilarity: number;
    setSkinSimilarity: (similarity: number) => void;
}

export default function DNACategory({
    gender,
    setGender,
    femaleParent,
    setFemaleParent,
    maleParent,
    setMaleParent,
    faceSimilarity,
    setFaceSimilarity,
    skinSimilarity,
    setSkinSimilarity
}: DNACategoryProps) {
    const [parentOption, setParentOption] = useState<CharacterGender>(CharacterGender.Female);
    const femaleParents = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];
    const maleParents = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];

    return (
        <>
            <GenderSelector gender={gender} setGender={setGender} />

            <div className={styles.label} style={{ marginTop: '1rem' }}>Parents</div>
            <div className={styles.parentsMenu}>
                <div className={styles.parentsOptions}>
                    <div className={csx(styles.parentOption, parentOption === CharacterGender.Female && styles.active)} onClick={() => setParentOption(CharacterGender.Female)}>Mother</div>
                    <div className={csx(styles.parentOption, parentOption === CharacterGender.Male && styles.active)} onClick={() => setParentOption(CharacterGender.Male)}>Father</div>
                </div>
                
                <Parents gender={parentOption} options={parentOption === CharacterGender.Female ? femaleParents : maleParents} selected={parentOption === CharacterGender.Female ? femaleParent : maleParent} setSelected={parentOption === CharacterGender.Female ? setFemaleParent : setMaleParent} />
            </div>

            <div className={styles.label} style={{ marginTop: '1rem' }}>Similarity</div>
            
            <CustomSlider 
                label="Face"
                value={faceSimilarity}
                onChange={setFaceSimilarity}
                min={0}
                max={100}
            />

            <CustomSlider 
                label="Skin"
                value={skinSimilarity}
                onChange={setSkinSimilarity}
                min={0}
                max={100}
            />
        </>
    );
}