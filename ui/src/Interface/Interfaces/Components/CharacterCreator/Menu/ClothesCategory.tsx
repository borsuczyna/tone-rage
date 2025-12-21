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
    topsData.forEach((item) => {
        for (let texture of item.textures) {
            tops.push([item.id, texture]);
        }
    });

    const onStyleChange = (style: keyof CharacterAppearance, data: [number, number], index: number) => {
        const item = data[index];
        if (!item) return;

        setCharacterAppearance([[style, item]]);
    }

    return (
        <>
            <div className={styles.label}>Clothes</div>

            <div className={styles.subLabel}>Top</div>
            <ImageSelector
                path={'/creator/tops'}
                selectedStyle={characterAppearance.topStyle}
                onStyleChange={(_style, index) => {onStyleChange('topStyle', tops[index], index)}}
                availableStyles={tops}
                gender={characterAppearance.gender}
                component={11}
            />
        </>
    );
}