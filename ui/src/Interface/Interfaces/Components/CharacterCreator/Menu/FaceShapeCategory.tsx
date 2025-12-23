import { ageingStyles, blemishesStyles, type CharacterAppearance, CharacterGender, complexionStyles, frecklesStyles, hairColors, lipstickStyles, makeupStyles, sunDamageStyles } from '@shared/Models/Character/Character';
import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import Control2D from './Control2D';
import CustomSlider from './CustomSlider';
import ImageSelector from './ImageSelector';
import ColorPicker from './ColorPicker';
import RandomizeButton from './RandomizeButton';
import translate from '@shared/Translation/Translation';

interface FaceShapeCategoryProps {
    characterAppearance: CharacterAppearance;
    setCharacterAppearance: (values: [keyof CharacterAppearance, any][]) => void;
    randomize: () => void;
}

export default function FaceShapeCategory({
    characterAppearance,
    setCharacterAppearance,
    randomize
}: FaceShapeCategoryProps) {
    return (
        <>
            <div className={styles.label}>{translate('character.creator.face.shape')}</div>

            <div className={styles.subLabel}>{translate('character.creator.overlay.blemishes')}</div>
            <ImageSelector 
                path={'/creator/heads'}
                selectedStyle={characterAppearance.blemishesStyle}
                onStyleChange={(style) => setCharacterAppearance([['blemishesStyle', style]])}
                availableStyles={blemishesStyles}
                gender={CharacterGender.Male}
                component={0}
                isOverlay={true}
            />

            <CustomSlider
                label={translate('character.creator.overlay.opacity')}
                value={characterAppearance.blemishesOpacity}
                onChange={(value) => setCharacterAppearance([['blemishesOpacity', value]])}
                min={0}
                max={100}
            />

            <div className={styles.subLabel}>{translate('character.creator.overlay.ageing')}</div>
            <ImageSelector
                path={'/creator/heads'}
                selectedStyle={characterAppearance.ageingStyle}
                onStyleChange={(style) => setCharacterAppearance([['ageingStyle', style]])}
                availableStyles={ageingStyles}
                gender={CharacterGender.Male}
                component={3}
                isOverlay={true}
            />

            <CustomSlider
                label={translate('character.creator.overlay.opacity')}
                value={characterAppearance.ageingOpacity}
                onChange={(value) => setCharacterAppearance([['ageingOpacity', value]])}
                min={0}
                max={100}
            />

            <div className={styles.subLabel}>{translate('character.creator.overlay.makeup')}</div>

            <ImageSelector
                path={'/creator/heads'}
                selectedStyle={characterAppearance.makeupStyle}
                onStyleChange={(style) => setCharacterAppearance([['makeupStyle', style]])}
                availableStyles={makeupStyles}
                gender={CharacterGender.Male}
                component={4}
                isOverlay={true}
            />

            <CustomSlider
                label={translate('character.creator.overlay.opacity')}
                value={characterAppearance.makeupOpacity}
                onChange={(value) => setCharacterAppearance([['makeupOpacity', value]])}
                min={0}
                max={100}
            />

            <div className={styles.subLabel}>{translate('character.creator.overlay.blush')}</div>

            <ImageSelector
                path={'/creator/heads'}
                selectedStyle={characterAppearance.blushStyle}
                onStyleChange={(style) => setCharacterAppearance([['blushStyle', style]])}
                availableStyles={blemishesStyles}
                gender={CharacterGender.Male}
                component={5}
                isOverlay={true}
            />

            <div className={styles.smallLabel}>{translate('character.creator.overlay.color')}</div>
            <ColorPicker 
                selectedColor={hairColors[characterAppearance.blushColor].hex}
                onColorChange={(colorHex) => {
                    const colorIndex = hairColors.findIndex(c => c.hex === colorHex);
                    if (colorIndex !== -1) {
                        setCharacterAppearance([['blushColor', colorIndex]]);
                    }
                }}
                colors={hairColors.map(c => c.hex)}
            />

            <CustomSlider
                label={translate('character.creator.overlay.opacity')}
                value={characterAppearance.blushOpacity}
                onChange={(value) => setCharacterAppearance([['blushOpacity', value]])}
                min={0}
                max={100}
            />

            <div className={styles.subLabel}>{translate('character.creator.overlay.complexion')}</div>

            <ImageSelector
                path={'/creator/heads'}
                selectedStyle={characterAppearance.complexionStyle}
                onStyleChange={(style) => setCharacterAppearance([['complexionStyle', style]])}
                availableStyles={complexionStyles}
                gender={CharacterGender.Male}
                component={6}
                isOverlay={true}
            />

            <CustomSlider
                label={translate('character.creator.overlay.opacity')}
                value={characterAppearance.complexionOpacity}
                onChange={(value) => setCharacterAppearance([['complexionOpacity', value]])}
                min={0}
                max={100}
            />

            <div className={styles.subLabel}>{translate('character.creator.overlay.sun.damage')}</div>

            <ImageSelector
                path={'/creator/heads'}
                selectedStyle={characterAppearance.sunDamageStyle}
                onStyleChange={(style) => setCharacterAppearance([['sunDamageStyle', style]])}
                availableStyles={sunDamageStyles}
                gender={CharacterGender.Male}
                component={7}
                isOverlay={true}
            />

            <CustomSlider
                label={translate('character.creator.overlay.opacity')}
                value={characterAppearance.sunDamageOpacity}
                onChange={(value) => setCharacterAppearance([['sunDamageOpacity', value]])}
                min={0}
                max={100}
            />

            <div className={styles.subLabel}>{translate('character.creator.overlay.lipstick')}</div>

            <ImageSelector
                path={'/creator/heads'}
                selectedStyle={characterAppearance.lipstickStyle}
                onStyleChange={(style) => setCharacterAppearance([['lipstickStyle', style]])}
                availableStyles={lipstickStyles}
                gender={CharacterGender.Male}
                component={8}
                isOverlay={true}
            />

            <div className={styles.smallLabel}>{translate('character.creator.overlay.color')}</div>
            <ColorPicker 
                selectedColor={hairColors[characterAppearance.lipstickColor].hex}
                onColorChange={(colorHex) => {
                    const colorIndex = hairColors.findIndex(c => c.hex === colorHex);
                    if (colorIndex !== -1) {
                        setCharacterAppearance([['lipstickColor', colorIndex]]);
                    }
                }}
                colors={hairColors.map(c => c.hex)}
            />

            <CustomSlider
                label={translate('character.creator.overlay.opacity')}
                value={characterAppearance.lipstickOpacity}
                onChange={(value) => setCharacterAppearance([['lipstickOpacity', value]])}
                min={0}
                max={100}
            />

            <div className={styles.subLabel}>{translate('character.creator.overlay.freckles')}</div>

            <ImageSelector
                path={'/creator/heads'}
                selectedStyle={characterAppearance.frecklesStyle}
                onStyleChange={(style) => setCharacterAppearance([['frecklesStyle', style]])}
                availableStyles={frecklesStyles}
                gender={CharacterGender.Male}
                component={9}
                isOverlay={true}
            />

            <CustomSlider
                label={translate('character.creator.overlay.opacity')}
                value={characterAppearance.frecklesOpacity}
                onChange={(value) => setCharacterAppearance([['frecklesOpacity', value]])}
                min={0}
                max={100}
            />

            <div className={styles.label}>{translate('character.creator.face.nose.width')}</div>
            
            <Control2D
                labelX={translate('character.creator.face.nose.width')}
                labelY={translate('character.creator.face.nose.height')}
                valueX={characterAppearance.noseWidth}
                valueY={characterAppearance.noseHeight}
                onChange={(width, height) => setCharacterAppearance([['noseWidth', width], ['noseHeight', height]])}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <Control2D
                labelX={translate('character.creator.face.nose.length')}
                labelY={translate('character.creator.face.nose.tip')}
                valueX={characterAppearance.noseLength}
                valueY={characterAppearance.noseTip}
                onChange={(length, tip) => setCharacterAppearance([['noseLength', length], ['noseTip', tip]])}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <Control2D
                labelX={translate('character.creator.face.nose.bridge')}
                labelY={translate('character.creator.face.nose.bridge.shift')}
                valueX={characterAppearance.noseBridge}
                valueY={characterAppearance.noseBridgeShift}
                onChange={(bridge, bridgeShift) => setCharacterAppearance([['noseBridge', bridge], ['noseBridgeShift', bridgeShift]])}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <div className={styles.label}>{translate('character.creator.categories.eyebrows')}</div>
            
            <Control2D
                labelX={translate('character.creator.face.eyebrow.width')}
                labelY={translate('character.creator.face.eyebrow.height')}
                valueX={characterAppearance.eyebrowWidth}
                valueY={characterAppearance.eyebrowHeight}
                onChange={(width, height) => setCharacterAppearance([['eyebrowWidth', width], ['eyebrowHeight', height]])}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <div className={styles.label}>{translate('character.creator.face.cheekbone.width')}</div>
            
            <Control2D
                labelX={translate('character.creator.face.cheekbone.width')}
                labelY={translate('character.creator.face.cheekbone.height')}
                valueX={characterAppearance.cheekboneWidth}
                valueY={characterAppearance.cheekboneHeight}
                onChange={(width, height) => setCharacterAppearance([['cheekboneWidth', width], ['cheekboneHeight', height]])}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <div className={styles.label}>{translate('character.creator.face.cheeks.width')}</div>
            
            <CustomSlider
                label={translate('character.creator.face.cheeks.width')}
                value={characterAppearance.cheeksWidth}
                onChange={(value) => setCharacterAppearance([['cheeksWidth', value]])}
                min={0}
                max={100}
            />

            <div className={styles.label}>{translate('character.creator.face.eyes.opening')}</div>
            
            <CustomSlider
                label={translate('character.creator.face.eyes.opening')}
                value={characterAppearance.eyesOpening}
                onChange={(value) => setCharacterAppearance([['eyesOpening', value]])}
                min={0}
                max={100}
            />

            <div className={styles.label}>{translate('character.creator.face.lips.thickness')}</div>
            
            <CustomSlider
                label={translate('character.creator.face.lips.thickness')}
                value={characterAppearance.lipsThickness}
                onChange={(value) => setCharacterAppearance([['lipsThickness', value]])}
                min={0}
                max={100}
            />

            <div className={styles.label}>{translate('character.creator.face.jaw.width')}</div>
            
            <Control2D
                labelX={translate('character.creator.face.jaw.width')}
                labelY={translate('character.creator.face.jaw.height')}
                valueX={characterAppearance.jawWidth}
                valueY={characterAppearance.jawHeight}
                onChange={(width, height) => setCharacterAppearance([['jawWidth', width], ['jawHeight', height]])}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <Control2D
                labelX={translate('character.creator.face.chin.length')}
                labelY={translate('character.creator.face.chin.position')}
                valueX={characterAppearance.chinLength}
                valueY={characterAppearance.chinPosition}
                onChange={(length, position) => setCharacterAppearance([['chinLength', length], ['chinPosition', position]])}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <Control2D
                labelX={translate('character.creator.face.chin.width')}
                labelY={translate('character.creator.face.chin.shape')}
                valueX={characterAppearance.chinWidth}
                valueY={characterAppearance.chinShape}
                onChange={(width, shape) => setCharacterAppearance([['chinWidth', width], ['chinShape', shape]])}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <div className={styles.label}>{translate('character.creator.face.neck.width')}</div>
            
            <CustomSlider
                label={translate('character.creator.face.neck.width')}
                value={characterAppearance.neckWidth}
                onChange={(value) => setCharacterAppearance([['neckWidth', value]])}
                min={0}
                max={100}
            />

            <RandomizeButton style={{marginTop: '0.5rem'}} onClick={randomize} />
        </>
    );
}