import { useState, useEffect } from 'react';
import styles from './Styles/CharacterCreatorInterface.module.css';
import csx from 'src/Utils/MergeClass';
import Categories from './Components/CharacterCreator/Categories';
import RightMenu from './Components/CharacterCreator/RightMenu';
import DNACategory from './Components/CharacterCreator/Menu/DNACategory';
import HairCategory from './Components/CharacterCreator/Menu/HairCategory';
import { type CharacterAppearance, CharacterGender } from '@shared/Models/Character';
import { triggerEvent } from 'src/Hooks/Fetch';

export default function CharacterCreatorInterface() {
    const [hiding, _setHiding] = useState(false);
    const [activeCategory, setActiveCategory] = useState(0);
    const [displayedCategory, setDisplayedCategory] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [characterAppearance, _setCharacterAppearance] = useState<CharacterAppearance>({
        gender: CharacterGender.Male,
        femaleParent: 0,
        maleParent: 0,
        faceSimilarity: 50,
        skinSimilarity: 50,
        hairStyle: 0,
        hairColor: 0,
        hairHighlightColor: 0,
    });

    const setCharacterAppearance = (key: keyof CharacterAppearance, value: any) => {
        const appearance = { ...characterAppearance, [key]: value };
        _setCharacterAppearance(appearance);
        triggerEvent('characterCreator:updateAppearance', appearance);
    }

    // Handle category transitions with smooth fade effect
    const handleCategoryChange = (newCategory: number) => {
        if (newCategory === activeCategory) return;
        
        setIsTransitioning(true);
        
        // Fade out current category
        setTimeout(() => {
            setDisplayedCategory(newCategory);
            setActiveCategory(newCategory);
        }, 220); // Half of transition duration
        
        // Fade in new category
        setTimeout(() => {
            setIsTransitioning(false);
        }, 440); // Full transition duration
    };
    
    // Initialize displayed category
    useEffect(() => {
        setDisplayedCategory(activeCategory);
        setCharacterAppearance('hairStyle', 0); // Reset appearance on mount
    }, []);
    
    return (
        <div className={csx(styles.container, hiding && styles.hiding)}>
            <Categories isTransitioning={isTransitioning} activeCategory={activeCategory} setActiveCategory={handleCategoryChange} />

            <RightMenu>
                <div className={csx(styles.categoryContent, isTransitioning && styles.transitioning)}>
                    {displayedCategory == 0 && <DNACategory
                        gender={characterAppearance.gender}
                        setGender={(gender) => setCharacterAppearance('gender', gender)}
                        femaleParent={characterAppearance.femaleParent}
                        setFemaleParent={(femaleParent) => setCharacterAppearance('femaleParent', femaleParent)}
                        maleParent={characterAppearance.maleParent}
                        setMaleParent={(maleParent) => setCharacterAppearance('maleParent', maleParent)}
                        faceSimilarity={characterAppearance.faceSimilarity}
                        setFaceSimilarity={(faceSimilarity) => setCharacterAppearance('faceSimilarity', faceSimilarity)}
                        skinSimilarity={characterAppearance.skinSimilarity}
                        setSkinSimilarity={(skinSimilarity) => setCharacterAppearance('skinSimilarity', skinSimilarity)}
                    />}
                    {displayedCategory == 1 && <HairCategory
                        gender={characterAppearance.gender}
                        hairStyle={characterAppearance.hairStyle}
                        setHairStyle={(style) => setCharacterAppearance('hairStyle', style)}
                        hairColor={characterAppearance.hairColor}
                        setHairColor={(color) => setCharacterAppearance('hairColor', color)}
                        hairHighlightColor={characterAppearance.hairHighlightColor}
                        setHairHighlightColor={(color) => setCharacterAppearance('hairHighlightColor', color)}
                        // hairLength={hairLength}
                        // setHairLength={setHairLength}
                        // hairOpacity={hairOpacity}
                        // setHairOpacity={setHairOpacity}
                    />}
                    {/* {displayedCategory == 2 && <FacialHairCategory
                        gender={gender}
                        beardStyle={beardStyle}
                        setBeardStyle={setBeardStyle}
                        beardColor={beardColor}
                        setBeardColor={setBeardColor}
                        beardSize={beardSize}
                        setBeardSize={setBeardSize}
                    />}
                    {displayedCategory == 3 && <EyesCategory
                        gender={gender}
                        squinting={squinting}
                        setSquinting={setSquinting}
                        eyeColor={eyeColor}
                        setEyeColor={setEyeColor}
                        eyebrowType={eyebrowType}
                        setEyebrowType={setEyebrowType}
                        eyebrowSize={eyebrowSize}
                        setEyebrowSize={setEyebrowSize}
                        eyebrowColor={eyebrowColor}
                        setEyebrowColor={setEyebrowColor}
                        eyebrowHeight={eyebrowHeight}
                        setEyebrowHeight={setEyebrowHeight}
                        eyebrowDepth={eyebrowDepth}
                        setEyebrowDepth={setEyebrowDepth}
                    />}
                    {displayedCategory == 4 && <FaceShapeCategory
                    noseWidth={noseWidth}
                    setNoseWidth={setNoseWidth}
                    noseHeight={noseHeight}
                    setNoseHeight={setNoseHeight}
                    noseLength={noseLength}
                    setNoseLength={setNoseLength}
                    noseBridgeDepth={noseBridgeDepth}
                    setNoseBridgeDepth={setNoseBridgeDepth}
                    noseTipHeight={noseTipHeight}
                    setNoseTipHeight={setNoseTipHeight}
                    noseBreakage={noseBreakage}
                    setNoseBreakage={setNoseBreakage}
                    cheekbonesHeight={cheekbonesHeight}
                    setCheekbonesHeight={setCheekbonesHeight}
                    cheekbonesWidth={cheekbonesWidth}
                    setCheekbonesWidth={setCheekbonesWidth}
                    cheekbonesDepth={cheekbonesDepth}
                    setCheekbonesDepth={setCheekbonesDepth}
                    jawWidth={jawWidth}
                    setJawWidth={setJawWidth}
                    jawDepth={jawDepth}
                    setJawDepth={setJawDepth}
                    chinHeight={chinHeight}
                    setChinHeight={setChinHeight}
                    chinLength={chinLength}
                    setChinLength={setChinLength}
                    chinWidth={chinWidth}
                    setChinWidth={setChinWidth}
                    chinHoleSize={chinHoleSize}
                    setChinHoleSize={setChinHoleSize}
                    lipsThickness={lipsThickness}
                        setLipsThickness={setLipsThickness}
                    />} */}
                </div>
            </RightMenu>
        </div>
    );
}