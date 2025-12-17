import { useState } from 'react';
import styles from './Styles/CharacterCreatorInterface.module.css';
import csx from 'src/Utils/MergeClass';
import Categories from './Components/CharacterCreator/Categories';
import RightMenu from './Components/CharacterCreator/RightMenu';
import DNACategory from './Components/CharacterCreator/Menu/DNACategory';
import { CharacterGender } from '@shared/Models/Character';

export default function CharacterCreatorInterface() {
    const [hiding, _setHiding] = useState(false);
    const [activeCategory, setActiveCategory] = useState(0);
    const [gender, setGender] = useState<CharacterGender>(CharacterGender.Male);
    const [femaleParent, setFemaleParent] = useState<number>(0);
    const [maleParent, setMaleParent] = useState<number>(0);
    const [faceSimilarity, setFaceSimilarity] = useState<number>(50);
    const [skinSimilarity, setSkinSimilarity] = useState<number>(50);
    
    return (
        <div className={csx(styles.container, hiding && styles.hiding)}>
            <Categories activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

            <RightMenu>
                {activeCategory == 0 && <DNACategory
                    gender={gender}
                    setGender={setGender}
                    femaleParent={femaleParent}
                    setFemaleParent={setFemaleParent}
                    maleParent={maleParent}
                    setMaleParent={setMaleParent}
                    faceSimilarity={faceSimilarity}
                    setFaceSimilarity={setFaceSimilarity}
                    skinSimilarity={skinSimilarity}
                    setSkinSimilarity={setSkinSimilarity}
                />}
            </RightMenu>
        </div>
    );
}