import styles from '../../../Styles/CharacterCreatorInterface.module.css';

interface HairStyleSelectorProps {
    selectedStyle: number;
    onStyleChange: (style: number) => void;
    availableStyles: number[];
}

export default function HairStyleSelector({ selectedStyle, onStyleChange, availableStyles }: HairStyleSelectorProps) {
    const currentIndex = availableStyles.indexOf(selectedStyle);
    
    const goToPrevious = () => {
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : availableStyles.length - 1;
        onStyleChange(availableStyles[prevIndex]);
    };
    
    const goToNext = () => {
        const nextIndex = currentIndex < availableStyles.length - 1 ? currentIndex + 1 : 0;
        onStyleChange(availableStyles[nextIndex]);
    };

    return (
        <div className={styles.hairStyleNavigator}>
            <button 
                className={styles.hairStyleArrow} 
                onClick={goToPrevious}
                type="button"
            >
                &#8249;
            </button>
            <div className={styles.hairStyleValue}>
                {selectedStyle + 1}
            </div>
            <button 
                className={styles.hairStyleArrow} 
                onClick={goToNext}
                type="button"
            >
                &#8250;
            </button>
        </div>
    );
}