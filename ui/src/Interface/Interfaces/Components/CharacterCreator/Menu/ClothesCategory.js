import { clothingData, getBestUndershirtsForTop } from "@shared/Models/Character/Character";
import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import ImageSelector from "./ImageSelector";
import RandomizeButton from "./RandomizeButton";
import translate from '@shared/Translation/Translation';
export default function ClothesCategory({ characterAppearance, setCharacterAppearance, randomize }) {
    const topsData = clothingData.tops[characterAppearance.gender];
    const tops = [];
    let selectedTop = null;
    topsData.forEach((item) => {
        for (let texture of item.textures) {
            if (item.id === characterAppearance.topStyle && texture === characterAppearance.topTexture) {
                selectedTop = [item.id, texture];
            }
            tops.push([item.id, texture]);
        }
    });
    const undershirtsData = getBestUndershirtsForTop(characterAppearance.gender, characterAppearance.topStyle);
    const undershirts = [];
    let selectedUndershirt = null;
    undershirtsData.forEach((item) => {
        for (let texture of item.textures) {
            if (item.id === characterAppearance.undershirtStyle && texture === characterAppearance.undershirtTexture) {
                selectedUndershirt = [item.id, texture];
            }
            undershirts.push([item.id, texture]);
        }
    });
    const legsData = clothingData.legs[characterAppearance.gender];
    const legs = [];
    let selectedLegs = null;
    legsData.forEach((item) => {
        for (let texture of item.textures) {
            if (item.id === characterAppearance.legsStyle && texture === characterAppearance.legsTexture) {
                selectedLegs = [item.id, texture];
            }
            legs.push([item.id, texture]);
        }
    });
    const shoesData = clothingData.shoes[characterAppearance.gender];
    const shoes = [];
    let selectedShoes = null;
    shoesData.forEach((item) => {
        for (let texture of item.textures) {
            if (item.id === characterAppearance.shoesStyle && texture === characterAppearance.shoesTexture) {
                selectedShoes = [item.id, texture];
            }
            shoes.push([item.id, texture]);
        }
    });
    return (<>
            <div className={styles.label}>{translate('character.creator.categories.clothes')}</div>

            <div className={styles.subLabel}>{translate('character.creator.clothes.top')}</div>
            <ImageSelector path={'/creator/tops'} selectedStyle={selectedTop ?? 0} onStyleChange={(_style, index) => { setCharacterAppearance([['topStyle', tops[index][0]], ['topTexture', tops[index][1]]]); }} availableStyles={tops} gender={characterAppearance.gender} component={11}/>

            {undershirts.length > 1 && (<>
                    <div className={styles.subLabel}>{translate('character.creator.clothes.undershirt')}</div>
                    <ImageSelector path={'/creator/undershirts'} selectedStyle={selectedUndershirt ?? 0} onStyleChange={(_style, index) => { setCharacterAppearance([['undershirtStyle', undershirts[index][0]], ['undershirtTexture', undershirts[index][1]]]); }} availableStyles={undershirts} gender={characterAppearance.gender} component={8}/>
                </>)}

            <div className={styles.subLabel}>{translate('character.creator.clothes.legs')}</div>
            <ImageSelector path={'/creator/legs'} selectedStyle={selectedLegs ?? 0} onStyleChange={(_style, index) => { setCharacterAppearance([['legsStyle', legs[index][0]], ['legsTexture', legs[index][1]]]); }} availableStyles={legs} gender={characterAppearance.gender} component={4}/>

            <div className={styles.subLabel}>{translate('character.creator.clothes.shoes')}</div>
            <ImageSelector path={'/creator/shoes'} selectedStyle={selectedShoes ?? 0} onStyleChange={(_style, index) => { setCharacterAppearance([['shoesStyle', shoes[index][0]], ['shoesTexture', shoes[index][1]]]); }} availableStyles={shoes} gender={characterAppearance.gender} component={6}/>

            <RandomizeButton style={{ marginTop: '0.5rem' }} onClick={randomize}/>
        </>);
}
