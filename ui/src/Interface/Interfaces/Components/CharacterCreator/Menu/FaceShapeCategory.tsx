import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import CustomSlider from './CustomSlider';
import Control2D from './Control2D';

interface FaceShapeCategoryProps {
    noseWidth: number;
    setNoseWidth: (value: number) => void;
    noseHeight: number;
    setNoseHeight: (value: number) => void;
    noseLength: number;
    setNoseLength: (value: number) => void;
    noseBridgeDepth: number;
    setNoseBridgeDepth: (value: number) => void;
    noseTipHeight: number;
    setNoseTipHeight: (value: number) => void;
    noseBreakage: number;
    setNoseBreakage: (value: number) => void;
    cheekbonesHeight: number;
    setCheekbonesHeight: (value: number) => void;
    cheekbonesWidth: number;
    setCheekbonesWidth: (value: number) => void;
    cheekbonesDepth: number;
    setCheekbonesDepth: (value: number) => void;
    jawWidth: number;
    setJawWidth: (value: number) => void;
    jawDepth: number;
    setJawDepth: (value: number) => void;
    chinHeight: number;
    setChinHeight: (value: number) => void;
    chinLength: number;
    setChinLength: (value: number) => void;
    chinWidth: number;
    setChinWidth: (value: number) => void;
    chinHoleSize: number;
    setChinHoleSize: (value: number) => void;
    lipsThickness: number;
    setLipsThickness: (value: number) => void;
}

export default function FaceShapeCategory({
    noseWidth,
    setNoseWidth,
    noseHeight,
    setNoseHeight,
    noseLength,
    setNoseLength,
    noseBridgeDepth,
    setNoseBridgeDepth,
    noseTipHeight,
    setNoseTipHeight,
    noseBreakage,
    setNoseBreakage,
    cheekbonesHeight,
    setCheekbonesHeight,
    cheekbonesWidth,
    setCheekbonesWidth,
    cheekbonesDepth,
    setCheekbonesDepth,
    jawWidth,
    setJawWidth,
    jawDepth,
    setJawDepth,
    chinHeight,
    setChinHeight,
    chinLength,
    setChinLength,
    chinWidth,
    setChinWidth,
    chinHoleSize,
    setChinHoleSize,
    lipsThickness,
    setLipsThickness
}: FaceShapeCategoryProps) {
    return (
        <>
            <div className={styles.label}>Nose</div>
            
            <Control2D
                labelX="Width"
                labelY="Height"
                valueX={noseWidth}
                valueY={noseHeight}
                onChangeX={setNoseWidth}
                onChangeY={setNoseHeight}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <CustomSlider 
                label="Length"
                value={noseLength}
                onChange={setNoseLength}
                min={0}
                max={100}
            />

            <Control2D
                labelX="Bridge Depth"
                labelY="Tip Height"
                valueX={noseBridgeDepth}
                valueY={noseTipHeight}
                onChangeX={setNoseBridgeDepth}
                onChangeY={setNoseTipHeight}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <CustomSlider 
                label="Breakage"
                value={noseBreakage}
                onChange={setNoseBreakage}
                min={0}
                max={100}
            />

            <div className={styles.label} style={{ marginTop: '1rem' }}>Cheekbones</div>
            
            <Control2D
                labelX="Height"
                labelY="Width"
                valueX={cheekbonesHeight}
                valueY={cheekbonesWidth}
                onChangeX={setCheekbonesHeight}
                onChangeY={setCheekbonesWidth}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <CustomSlider 
                label="Depth"
                value={cheekbonesDepth}
                onChange={setCheekbonesDepth}
                min={0}
                max={100}
            />

            <div className={styles.label} style={{ marginTop: '1rem' }}>Jaw</div>
            
            <Control2D
                labelX="Width"
                labelY="Depth"
                valueX={jawWidth}
                valueY={jawDepth}
                onChangeX={setJawWidth}
                onChangeY={setJawDepth}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <div className={styles.label} style={{ marginTop: '1rem' }}>Chin</div>
            
            <Control2D
                labelX="Height"
                labelY="Length"
                valueX={chinHeight}
                valueY={chinLength}
                onChangeX={setChinHeight}
                onChangeY={setChinLength}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <Control2D
                labelX="Width"
                labelY="Hole Size"
                valueX={chinWidth}
                valueY={chinHoleSize}
                onChangeX={setChinWidth}
                onChangeY={setChinHoleSize}
                minX={0}
                maxX={100}
                minY={0}
                maxY={100}
            />

            <div className={styles.label} style={{ marginTop: '1rem' }}>Lips</div>
            
            <CustomSlider 
                label="Thickness"
                value={lipsThickness}
                onChange={setLipsThickness}
                min={0}
                max={100}
            />
        </>
    );
}