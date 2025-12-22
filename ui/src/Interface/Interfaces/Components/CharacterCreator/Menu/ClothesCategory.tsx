import { clothingData, getBestUndershirtsForTop, type CharacterAppearance } from "@shared/Models/Character/Character";
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

            {undershirts.length > 1 && (
                <>
                    <div className={styles.subLabel}>Undershirt</div>
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
        </>
    );
}