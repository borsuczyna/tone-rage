import { clothingData, getBestUndershirtsForTop, type CharacterAppearance } from "@shared/Models/Character/Character";
import ImageSelector from "./ImageSelector";
import translate from '@shared/Translation/Translation';
import CategoryName from "./CategoryName";
import CreatorInfo from "./CreatorInfo";
import OptionLabel from "./OptionLabel";

interface ClothesCategoryProps {
    characterAppearance: CharacterAppearance;
    setCharacterAppearance: (values: [keyof CharacterAppearance, any][]) => void;
}

export default function ClothesCategory({
    characterAppearance,
    setCharacterAppearance,
}: ClothesCategoryProps) {
    const topsData = clothingData.tops[characterAppearance.gender];
    const tops: [number, number][] = [];
    let selectedTop: [number, number] | null = null;
    topsData.forEach((item) => {
        for (let texture of item.textures) {
            if (item.id === characterAppearance.topStyle && texture === characterAppearance.topTexture) {
                selectedTop = [item.id, texture];
            }
            tops.push([item.id, texture]);
        }
    });

    const undershirtsData = getBestUndershirtsForTop(characterAppearance.gender, characterAppearance.topStyle);
    const undershirts: [number, number][] = [];
    let selectedUndershirt: [number, number] | null = null;
    undershirtsData.forEach((item) => {
        for (let texture of item.textures) {
            if (item.id === characterAppearance.undershirtStyle && texture === characterAppearance.undershirtTexture) {
                selectedUndershirt = [item.id, texture];
            }
            undershirts.push([item.id, texture]);
        }
    });

    const legsData = clothingData.legs[characterAppearance.gender];
    const legs: [number, number][] = [];
    let selectedLegs: [number, number] | null = null;
    legsData.forEach((item) => {
        for (let texture of item.textures) {
            if (item.id === characterAppearance.legsStyle && texture === characterAppearance.legsTexture) {
                selectedLegs = [item.id, texture];
            }
            legs.push([item.id, texture]);
        }
    });

    const shoesData = clothingData.shoes[characterAppearance.gender];
    const shoes: [number, number][] = [];
    let selectedShoes: [number, number] | null = null;
    shoesData.forEach((item) => {
        for (let texture of item.textures) {
            if (item.id === characterAppearance.shoesStyle && texture === characterAppearance.shoesTexture) {
                selectedShoes = [item.id, texture];
            }
            shoes.push([item.id, texture]);
        }
    });

    return (
        <>
            <CategoryName name={translate('character.creator.clothes.title')} />
            <CreatorInfo />

            <OptionLabel label={translate('character.creator.clothes.top')} marginTop />
            <ImageSelector
                path={'/creator/tops'}
                selectedStyle={selectedTop ?? 0}
                onStyleChange={(_style, index) => {setCharacterAppearance([['topStyle', tops[index][0]], ['topTexture', tops[index][1]]])}}
                availableStyles={tops}
                gender={characterAppearance.gender}
                component={11}
            />

            {undershirts.length > 1 && (
                <>
                    <OptionLabel label={translate('character.creator.clothes.undershirt')} />
                    <ImageSelector
                        path={'/creator/undershirts'}
                        selectedStyle={selectedUndershirt ?? 0}
                        onStyleChange={(_style, index) => {setCharacterAppearance([['undershirtStyle', undershirts[index][0]], ['undershirtTexture', undershirts[index][1]]])}}
                        availableStyles={undershirts}
                        gender={characterAppearance.gender}
                        component={8}
                    />
                </>
            )}

            <OptionLabel label={translate('character.creator.clothes.legs')} />
            <ImageSelector
                path={'/creator/legs'}
                selectedStyle={selectedLegs ?? 0}
                onStyleChange={(_style, index) => {setCharacterAppearance([['legsStyle', legs[index][0]], ['legsTexture', legs[index][1]]])}}
                availableStyles={legs}
                gender={characterAppearance.gender}
                component={4}
            />

            <OptionLabel label={translate('character.creator.clothes.shoes')} />
            <ImageSelector
                path={'/creator/shoes'}
                selectedStyle={selectedShoes ?? 0}
                onStyleChange={(_style, index) => {setCharacterAppearance([['shoesStyle', shoes[index][0]], ['shoesTexture', shoes[index][1]]])}}
                availableStyles={shoes}
                gender={characterAppearance.gender}
                component={6}
            />
        </>
    );
}