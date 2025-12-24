import { useState, useEffect, useRef } from 'react';
import styles from './Styles/CharacterCreatorInterface.module.css';
import csx from 'src/Utils/MergeClass';
import Categories from './Components/CharacterCreator/Categories';
import RightMenu from './Components/CharacterCreator/RightMenu';
import DNACategory from './Components/CharacterCreator/Menu/DNACategory';
import HairCategory from './Components/CharacterCreator/Menu/HairCategory';
import { type CharacterAppearance, getBestUndershirtsForTop, getDefaultAppearance, getRandomAppearance, randomizeClothes, randomizeDNA, randomizeEyes, randomizeFace, randomizeFacialHair, randomizeHair, type SaveCharacterAppearanceResponse } from '@shared/Models/Character/Character';
import { fetchServerData, triggerEvent } from 'src/Hooks/Fetch';
import Toolbar from './Components/CharacterCreator/Toolbar';
import EyesCategory from './Components/CharacterCreator/Menu/EyesCategory';
import FaceShapeCategory from './Components/CharacterCreator/Menu/FaceShapeCategory';
import ClothesCategory from './Components/CharacterCreator/Menu/ClothesCategory';
import { useRageEvent } from 'src/Hooks/RageEventProvider';
import { useNotifications } from 'src/Hooks/NotificationsProvider';
import ConfirmationModal from './Components/CharacterCreator/ConfirmationModal';
import translate from '@shared/Translation/Translation';
import Button from './Components/Button';

export default function CharacterCreatorInterface() {
    const [hiding, _setHiding] = useState(false);
    const [activeCategory, _setActiveCategory] = useState(0);
    const [displayedCategory, setDisplayedCategory] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const grabBoxRef = useRef<HTMLDivElement>(null);
    const [characterAppearance, _setCharacterAppearance] = useState<CharacterAppearance>(getDefaultAppearance());
    const [isSaving, setIsSaving] = useState(false);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [hidingInterface, setHidingInterface] = useState(false);
    const { addNotification } = useNotifications();

    const changeAppearance = (key: keyof CharacterAppearance, value: any, appearance: CharacterAppearance) => {
        appearance = { ...appearance, [key]: value };

        if (key === 'gender') {
            appearance.hairStyle = 0;
            appearance.hairColor = 0;
            appearance.hairHighlightColor = 0;
            appearance.beardStyle = 0;
            appearance.beardColor = 0;
            appearance.beardLength = 0;
            appearance.topStyle = 0;
            appearance.topTexture = 0;
            appearance.legsStyle = 0;
            appearance.legsTexture = 0;
            appearance.shoesStyle = 0;
            appearance.shoesTexture = 0;
        } else if (key == 'beardStyle') {
            if (value == 0) {
                appearance.beardLength = 0;
            } else if (appearance.beardLength == 0 && value != 0) {
                appearance.beardLength = 50;
            }
        } else if (key == 'topStyle') {
            const undershirtsData = getBestUndershirtsForTop(characterAppearance.gender, value);
            if (!undershirtsData.find(item => item.id === appearance.undershirtStyle)) {
                const bestUndershirt = undershirtsData[0];
                appearance.undershirtStyle = bestUndershirt.id;
                appearance.undershirtTexture = bestUndershirt.textures[0];
            }
        }

        return appearance;
    }

    const setCharacterAppearance = (values: [keyof CharacterAppearance, any][]) => {
        let appearance = { ...characterAppearance };
        for (const [key, value] of values) {
            appearance = changeAppearance(key, value, appearance);
        }

        _setCharacterAppearance(appearance);
        triggerEvent('characterCreator:updateAppearance', appearance);
    }

    const updateFullCharacterAppearance = (appearance: CharacterAppearance) => {
        _setCharacterAppearance(appearance);
        triggerEvent('characterCreator:updateAppearance', appearance);
    }

    const setActiveCategory = (category: number) => {
        _setActiveCategory(category);
        triggerEvent('characterCreator:categoryChanged', category);
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

    const randomizeAppearance = () => {
        updateFullCharacterAppearance(getRandomAppearance(characterAppearance.gender));
    };

    const randomizeCategoryAppearance = () => {
        let appearance = { ...characterAppearance };
        switch (activeCategory) {
            case 0: // DNA
                appearance = randomizeDNA(appearance);
                break;
            case 1: // Hair
                appearance = randomizeHair(appearance);
                appearance = randomizeFacialHair(appearance);
                break;
            case 2: // Eyes
                appearance = randomizeEyes(appearance);
                break;
            case 3: // Face Shape
                appearance = randomizeFace(appearance);
                break;
            case 4: // Clothes
                appearance = randomizeClothes(appearance);
                break;
            default:
                break;
        }

        updateFullCharacterAppearance(appearance);
    }

    const saveCharacter = async () => {
        setIsSaving(true);
        setConfirmationModalOpen(false);

        try {
            const result = await fetchServerData<SaveCharacterAppearanceResponse>('characterCreator:saveCharacter', characterAppearance);
            addNotification(translate('character.creator.title'), result.message ?? translate('character.creator.feedback.save.error'), result.success ? 'success' : 'error');

            if (result.success) {
                setHidingInterface(true);
                triggerEvent('characterCreator:finished');
            }
        } catch (error) {
            addNotification(translate('character.creator.title'), translate('character.creator.feedback.save.error'), 'error');
        }

        setIsSaving(false);
    }
    
    // Initialize displayed category
    useEffect(() => {
        setDisplayedCategory(activeCategory);
        setCharacterAppearance([['hairStyle', 0]]); // Reset appearance on mount
    }, []);

    // Send event when cursor enters/leaves grab box
    useEffect(() => {
        const grabBox = grabBoxRef.current;
        if (!grabBox) return;

        const handleMouseEnter = () => {
            triggerEvent('characterCreator:cursorEnterGrabBox');
        };

        const handleMouseLeave = () => {
            triggerEvent('characterCreator:cursorLeaveGrabBox');
        };

        grabBox.addEventListener('mouseenter', handleMouseEnter);
        grabBox.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            grabBox.removeEventListener('mouseenter', handleMouseEnter);
            grabBox.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    useRageEvent('dumpTopsData', (topsData: any) => {
        const data = JSON.stringify(topsData, null, 2);
        const input = document.createElement('textarea');
        input.value = data;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    });
    
    return (
        <div className={csx(styles.container, hiding && styles.hiding, hidingInterface && styles.hidingInterface)}>
            <Categories isTransitioning={isTransitioning} activeCategory={activeCategory} setActiveCategory={handleCategoryChange} />

            <RightMenu isTransitioning={isTransitioning}>
                <div className={styles.categoryContent}>
                    {displayedCategory == 0 && <DNACategory
                        characterAppearance={characterAppearance}
                        setCharacterAppearance={setCharacterAppearance}
                    />}
                    {displayedCategory == 1 && <HairCategory
                        characterAppearance={characterAppearance}
                        setCharacterAppearance={setCharacterAppearance}
                    />}
                    {displayedCategory == 2 && <EyesCategory
                        characterAppearance={characterAppearance}
                        setCharacterAppearance={setCharacterAppearance}
                    />}
                    {displayedCategory == 3 && <FaceShapeCategory
                        characterAppearance={characterAppearance}
                        setCharacterAppearance={setCharacterAppearance}
                    />}
                    {displayedCategory == 4 && <ClothesCategory
                        characterAppearance={characterAppearance}
                        setCharacterAppearance={setCharacterAppearance}
                    />}
                </div>

                <div className={styles.rightMenuOptions}>
                    <Button
                        variant='glass'
                        size='medium'
                        onClick={randomizeCategoryAppearance}
                    >
                        {translate('character.creator.randomize.category')}
                    </Button>

                    <Button
                        variant='primary'
                        size='medium'
                        onClick={() => {
                            if (activeCategory == 4) {
                                setConfirmationModalOpen(true);
                            } else {
                                handleCategoryChange(activeCategory + 1);
                            }
                        }}
                        fullWidth
                    >
                        {activeCategory == 4 ? translate('character.creator.finish') : translate('character.creator.next')}
                    </Button>
                </div>
            </RightMenu>

            <div className={styles.grabBox} ref={grabBoxRef}></div>
            
            <Toolbar 
                characterAppearance={characterAppearance}
                randomizeAppearance={randomizeAppearance}
                onFullUpdate={updateFullCharacterAppearance}
                saveCharacter={() => setConfirmationModalOpen(true)}
                isSaving={isSaving}
            />

            {confirmationModalOpen && (
                <ConfirmationModal
                    onConfirm={saveCharacter}
                    onCancel={() => setConfirmationModalOpen(false)}
                />
            )}
        </div>
    );
}