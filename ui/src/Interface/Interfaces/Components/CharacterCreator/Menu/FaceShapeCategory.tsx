import { ageingStyles, blemishesStyles, type CharacterAppearance, CharacterGender, complexionStyles, frecklesStyles, hairColors, lipstickStyles, makeupStyles, sunDamageStyles } from '@shared/Models/Character/Character';
import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import Control2D from './Control2D';
import CustomSlider from './CustomSlider';
import ImageSelector from './ImageSelector';
import ColorPicker from './ColorPicker';
import RandomizeButton from './RandomizeButton';

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
            <div className={styles.label}>Skin Details</div>

            <div className={styles.subLabel}>Blemishes</div>
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
                label="Opacity"
                value={characterAppearance.blemishesOpacity}
                onChange={(value) => setCharacterAppearance([['blemishesOpacity', value]])}
                min={0}
                max={100}
            />

            <div className={styles.subLabel}>Ageing</div>
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
                label="Opacity"
                value={characterAppearance.ageingOpacity}
                onChange={(value) => setCharacterAppearance([['ageingOpacity', value]])}
                min={0}
                max={100}
            />

            <div className={styles.subLabel}>Makeup</div>

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
                label="Opacity"
                value={characterAppearance.makeupOpacity}
                onChange={(value) => setCharacterAppearance([['makeupOpacity', value]])}
                min={0}
                max={100}
            />

            <div className={styles.subLabel}>Blush</div>

            <ImageSelector
                path={'/creator/heads'}
                selectedStyle={characterAppearance.blushStyle}
                onStyleChange={(style) => setCharacterAppearance([['blushStyle', style]])}
                availableStyles={blemishesStyles}
                gender={CharacterGender.Male}
                component={5}
                isOverlay={true}
            />

            <div className={styles.smallLabel}>Color</div>
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
                label="Opacity"
                value={characterAppearance.blushOpacity}
                onChange={(value) => setCharacterAppearance([['blushOpacity', value]])}
                min={0}
                max={100}
            />

            <div className={styles.subLabel}>Complexion</div>

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
                label="Opacity"
                value={characterAppearance.complexionOpacity}
                onChange={(value) => setCharacterAppearance([['complexionOpacity', value]])}
                min={0}
                max={100}
            />

            <div className={styles.subLabel}>Sun Damage</div>

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
                label="Opacity"
                value={characterAppearance.sunDamageOpacity}
                onChange={(value) => setCharacterAppearance([['sunDamageOpacity', value]])}
                min={0}
                max={100}
            />

            <div className={styles.subLabel}>Lipstick</div>

            <ImageSelector
                path={'/creator/heads'}
                selectedStyle={characterAppearance.lipstickStyle}
                onStyleChange={(style) => setCharacterAppearance([['lipstickStyle', style]])}
                availableStyles={lipstickStyles}
                gender={CharacterGender.Male}
                component={8}
                isOverlay={true}
            />

            <div className={styles.smallLabel}>Color</div>
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
                label="Opacity"
                value={characterAppearance.lipstickOpacity}
                onChange={(value) => setCharacterAppearance([['lipstickOpacity', value]])}
                min={0}
                max={100}
            />

            <div className={styles.subLabel}>Freckles</div>

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
                label="Opacity"
                value={characterAppearance.frecklesOpacity}
                onChange={(value) => setCharacterAppearance([['frecklesOpacity', value]])}
                min={0}
                max={100}
            />

            <div className={styles.label}>Nose</div>
            
            <Control2D
                labelX="Width"
                labelY="Height"
                valueX={characterAppearance.noseWidth}
                valueY={characterAppearance.noseHeight}
                onChange={(width, height) => setCharacterAppearance([['noseWidth', width], ['noseHeight', height]])}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <Control2D
                labelX="Length"
                labelY="Tip"
                valueX={characterAppearance.noseLength}
                valueY={characterAppearance.noseTip}
                onChange={(length, tip) => setCharacterAppearance([['noseLength', length], ['noseTip', tip]])}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <Control2D
                labelX="Bridge"
                labelY="Bridge shift"
                valueX={characterAppearance.noseBridge}
                valueY={characterAppearance.noseBridgeShift}
                onChange={(bridge, bridgeShift) => setCharacterAppearance([['noseBridge', bridge], ['noseBridgeShift', bridgeShift]])}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <div className={styles.label}>Eyebrows</div>
            
            <Control2D
                labelX="Forward"
                labelY="Height"
                valueX={characterAppearance.eyebrowWidth}
                valueY={characterAppearance.eyebrowHeight}
                onChange={(width, height) => setCharacterAppearance([['eyebrowWidth', width], ['eyebrowHeight', height]])}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <div className={styles.label}>Cheekbones</div>
            
            <Control2D
                labelX="Width"
                labelY="Height"
                valueX={characterAppearance.cheekboneWidth}
                valueY={characterAppearance.cheekboneHeight}
                onChange={(width, height) => setCharacterAppearance([['cheekboneWidth', width], ['cheekboneHeight', height]])}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <div className={styles.label}>Cheeks</div>
            
            <CustomSlider
                label="Width"
                value={characterAppearance.cheeksWidth}
                onChange={(value) => setCharacterAppearance([['cheeksWidth', value]])}
                min={0}
                max={100}
            />

            <div className={styles.label}>Eyes</div>
            
            <CustomSlider
                label="Opening"
                value={characterAppearance.eyesOpening}
                onChange={(value) => setCharacterAppearance([['eyesOpening', value]])}
                min={0}
                max={100}
            />

            <div className={styles.label}>Lips</div>
            
            <CustomSlider
                label="Thickness"
                value={characterAppearance.lipsThickness}
                onChange={(value) => setCharacterAppearance([['lipsThickness', value]])}
                min={0}
                max={100}
            />

            <div className={styles.label}>Jaw</div>
            
            <Control2D
                labelX="Width"
                labelY="Height"
                valueX={characterAppearance.jawWidth}
                valueY={characterAppearance.jawHeight}
                onChange={(width, height) => setCharacterAppearance([['jawWidth', width], ['jawHeight', height]])}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <Control2D
                labelX="Chin length"
                labelY="Chin position"
                valueX={characterAppearance.chinLength}
                valueY={characterAppearance.chinPosition}
                onChange={(length, position) => setCharacterAppearance([['chinLength', length], ['chinPosition', position]])}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <Control2D
                labelX="Chin width"
                labelY="Chin shape"
                valueX={characterAppearance.chinWidth}
                valueY={characterAppearance.chinShape}
                onChange={(width, shape) => setCharacterAppearance([['chinWidth', width], ['chinShape', shape]])}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <div className={styles.label}>Neck</div>
            
            <CustomSlider
                label="Neck width"
                value={characterAppearance.neckWidth}
                onChange={(value) => setCharacterAppearance([['neckWidth', value]])}
                min={0}
                max={100}
            />

            <RandomizeButton style={{marginTop: '0.5rem'}} onClick={randomize} />
        </>
    );
}