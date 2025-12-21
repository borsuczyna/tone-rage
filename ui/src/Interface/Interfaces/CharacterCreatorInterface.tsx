import { useState, useEffect, useRef } from 'react';
import styles from './Styles/CharacterCreatorInterface.module.css';
import csx from 'src/Utils/MergeClass';
import Categories from './Components/CharacterCreator/Categories';
import RightMenu from './Components/CharacterCreator/RightMenu';
import DNACategory from './Components/CharacterCreator/Menu/DNACategory';
import HairCategory from './Components/CharacterCreator/Menu/HairCategory';
import { type CharacterAppearance, getDefaultAppearance, getRandomAppearance } from '@shared/Models/Character/Character';
import { triggerEvent } from 'src/Hooks/Fetch';
import FacialHairCategory from './Components/CharacterCreator/Menu/FacialHairCategory';
import Toolbar from './Components/CharacterCreator/Toolbar';
import EyesCategory from './Components/CharacterCreator/Menu/EyesCategory';
import FaceShapeCategory from './Components/CharacterCreator/Menu/FaceShapeCategory';
import ClothesCategory from './Components/CharacterCreator/Menu/ClothesCategory';
import { useRageEvent } from 'src/Hooks/RageEventProvider';

// function skinMenu:getDrawableList(component)
//     local list = {}
//     for i = 0, GetNumberOfPedDrawableVariations(GetPlayerPed(-1), component) do
//         local cmp               = component
//         list[i]                 = {}
//         list[i].name            = "Item n°".. i
//         list[i].id              = i
//         list[i].max             = false
//         if GetNumberOfPedTextureVariations(GetPlayerPed(-1), cmp, i) - 1 ~= nil or GetNumberOfPedTextureVariations(GetPlayerPed(-1), cmp, i) - 1 > 0 then
//             list[i].max         = GetNumberOfPedTextureVariations(GetPlayerPed(-1), cmp, i) - 1
//         end
//         list[i].onClick         = function()
//             skinMenu:saveItem( skinMenu.currentmenu, i, skinMenu.menu[skinMenu.currentmenu].userSelectVariation )
//             BuyItem({collection = "component", id = cmp}, {value = i, texture_value = skinMenu.menu[skinMenu.currentmenu].userSelectVariation})
            
//         end
//         list[i].onLeft          = function()
//             if skinMenu.menu[skinMenu.currentmenu].userSelectVariation > 0 then
//                 skinMenu:setCurrentVariation("left", skinMenu.currentmenu)
//                 SetPedComponentVariation(GetPlayerPed(-1), cmp, i, skinMenu.menu[skinMenu.currentmenu].userSelectVariation, 4)

//             end
//         end
//         list[i].onRight         = function()
//             if  skinMenu.menu[skinMenu.currentmenu].userSelectVariation < ( GetNumberOfPedTextureVariations(GetPlayerPed(-1), cmp, i) - 1 ) then
//                 skinMenu:setCurrentVariation("right", skinMenu.currentmenu)
//                 SetPedComponentVariation(GetPlayerPed(-1), cmp, i, skinMenu.menu[skinMenu.currentmenu].userSelectVariation, 4)
//             end
//         end
//         list[i].onSelected      = function()
//             skinMenu.menu[skinMenu.currentmenu].userSelect = i
//             SetPedComponentVariation(GetPlayerPed(-1), cmp, i, skinMenu.menu[skinMenu.currentmenu].userSelectVariation, 0)
//         end
//         list[i].onBack          = function()
//             skinMenu:toMenu(skinMenu:getLastMenu())
//         end
//     end
//     return list
// end

export default function CharacterCreatorInterface() {
    const [hiding, _setHiding] = useState(false);
    const [activeCategory, setActiveCategory] = useState(0);
    const [displayedCategory, setDisplayedCategory] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const grabBoxRef = useRef<HTMLDivElement>(null);
    const [characterAppearance, _setCharacterAppearance] = useState<CharacterAppearance>(getDefaultAppearance());

    const changeAppearance = (key: keyof CharacterAppearance, value: any, appearance: CharacterAppearance) => {
        appearance = { ...appearance, [key]: value };

        if (key === 'gender') {
            // Reset dependent features when gender changes
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
        <div className={csx(styles.container, hiding && styles.hiding)}>
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
                    {displayedCategory == 2 && <FacialHairCategory
                        characterAppearance={characterAppearance}
                        setCharacterAppearance={setCharacterAppearance}
                    />}
                    {displayedCategory == 3 && <EyesCategory
                        characterAppearance={characterAppearance}
                        setCharacterAppearance={setCharacterAppearance}
                    />}
                    {displayedCategory == 4 && <FaceShapeCategory
                        characterAppearance={characterAppearance}
                        setCharacterAppearance={setCharacterAppearance}
                    />}
                    {displayedCategory == 5 && <ClothesCategory
                        characterAppearance={characterAppearance}
                        setCharacterAppearance={setCharacterAppearance}
                    />}
                </div>
            </RightMenu>

            <div className={styles.grabBox} ref={grabBoxRef}></div>
            
            <Toolbar 
                characterAppearance={characterAppearance}
                randomizeAppearance={randomizeAppearance}
                onFullUpdate={updateFullCharacterAppearance}
            />
        </div>
    );
}