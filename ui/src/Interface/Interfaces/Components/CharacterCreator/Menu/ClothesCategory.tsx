import { clothingData, type CharacterAppearance } from "@shared/Models/Character/Character";
import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import ImageSelector from "./ImageSelector";

interface ClothesCategoryProps {
    characterAppearance: CharacterAppearance;
    setCharacterAppearance: (values: [keyof CharacterAppearance, any][]) => void;
}

export default function ClothesCategory({
    characterAppearance,
    setCharacterAppearance
}: ClothesCategoryProps) {
    const topsData = clothingData.tops[characterAppearance.gender];
    // const tops = topsData.map((item) => [item.id, item.te
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

    console.log('selectedTop', selectedTop)

    return (
        <>
            <div className={styles.label}>Clothes</div>

            <div className={styles.subLabel}>Top</div>
            <ImageSelector
                path={'/creator/tops'}
                selectedStyle={selectedTop ?? 0}
                onStyleChange={(_style, index) => {setCharacterAppearance([['topStyle', tops[index][0]], ['topTexture', tops[index][1]]])}}
                availableStyles={tops}
                gender={characterAppearance.gender}
                component={11}
            />
        </>
    );
}