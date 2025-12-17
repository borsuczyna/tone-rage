import { useState, useEffect } from 'react';
import styles from './Styles/CharacterCreatorInterface.module.css';
import csx from 'src/Utils/MergeClass';
import Categories from './Components/CharacterCreator/Categories';
import RightMenu from './Components/CharacterCreator/RightMenu';
import DNACategory from './Components/CharacterCreator/Menu/DNACategory';
import HairCategory from './Components/CharacterCreator/Menu/HairCategory';
import FacialHairCategory from './Components/CharacterCreator/Menu/FacialHairCategory';
import EyesCategory from './Components/CharacterCreator/Menu/EyesCategory';
import FaceShapeCategory from './Components/CharacterCreator/Menu/FaceShapeCategory';
import { CharacterGender } from '@shared/Models/Character';

export default function CharacterCreatorInterface() {
    const [hiding, _setHiding] = useState(false);
    const [activeCategory, setActiveCategory] = useState(0);
    const [displayedCategory, setDisplayedCategory] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [gender, setGender] = useState<CharacterGender>(CharacterGender.Male);
    const [femaleParent, setFemaleParent] = useState<number>(0);
    const [maleParent, setMaleParent] = useState<number>(0);
    const [faceSimilarity, setFaceSimilarity] = useState<number>(50);
    const [skinSimilarity, setSkinSimilarity] = useState<number>(50);
    
    // Hair states
    const [hairStyle, setHairStyle] = useState<number>(0);
    const [hairColor, setHairColor] = useState<string>('#2c1b18');
    const [hairHighlightColor, setHairHighlightColor] = useState<string>('#5d4037');
    const [hairLength, setHairLength] = useState<number>(50);
    const [hairOpacity, setHairOpacity] = useState<number>(100);
    
    // Facial Hair states
    const [beardStyle, setBeardStyle] = useState<number>(0);
    const [beardColor, setBeardColor] = useState<string>('#2c1b18');
    const [beardSize, setBeardSize] = useState<number>(50);
    
    // Eyes states
    const [squinting, setSquinting] = useState<number>(0);
    const [eyeColor, setEyeColor] = useState<string>('#8B4513');
    const [eyebrowType, setEyebrowType] = useState<number>(0);
    const [eyebrowSize, setEyebrowSize] = useState<number>(50);
    const [eyebrowColor, setEyebrowColor] = useState<string>('#2c1b18');
    const [eyebrowHeight, setEyebrowHeight] = useState<number>(50);
    const [eyebrowDepth, setEyebrowDepth] = useState<number>(50);
    
    // Face Shape states
    const [noseWidth, setNoseWidth] = useState<number>(50);
    const [noseHeight, setNoseHeight] = useState<number>(50);
    const [noseLength, setNoseLength] = useState<number>(50);
    const [noseBridgeDepth, setNoseBridgeDepth] = useState<number>(50);
    const [noseTipHeight, setNoseTipHeight] = useState<number>(50);
    const [noseBreakage, setNoseBreakage] = useState<number>(50);
    const [cheekbonesHeight, setCheekbonesHeight] = useState<number>(50);
    const [cheekbonesWidth, setCheekbonesWidth] = useState<number>(50);
    const [cheekbonesDepth, setCheekbonesDepth] = useState<number>(50);
    const [jawWidth, setJawWidth] = useState<number>(50);
    const [jawDepth, setJawDepth] = useState<number>(50);
    const [chinHeight, setChinHeight] = useState<number>(50);
    const [chinLength, setChinLength] = useState<number>(50);
    const [chinWidth, setChinWidth] = useState<number>(50);
    const [chinHoleSize, setChinHoleSize] = useState<number>(0);
    const [lipsThickness, setLipsThickness] = useState<number>(50);
    
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
    }, []);
    
    return (
        <div className={csx(styles.container, hiding && styles.hiding)}>
            <Categories isTransitioning={isTransitioning} activeCategory={activeCategory} setActiveCategory={handleCategoryChange} />

            <RightMenu>
                <div className={csx(styles.categoryContent, isTransitioning && styles.transitioning)}>
                    {displayedCategory == 0 && <DNACategory
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
                    {displayedCategory == 1 && <HairCategory
                        gender={gender}
                        hairStyle={hairStyle}
                        setHairStyle={setHairStyle}
                        hairColor={hairColor}
                        setHairColor={setHairColor}
                        hairHighlightColor={hairHighlightColor}
                        setHairHighlightColor={setHairHighlightColor}
                        hairLength={hairLength}
                        setHairLength={setHairLength}
                        hairOpacity={hairOpacity}
                        setHairOpacity={setHairOpacity}
                    />}
                    {displayedCategory == 2 && <FacialHairCategory
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
                    />}
                </div>
            </RightMenu>
        </div>
    );
}