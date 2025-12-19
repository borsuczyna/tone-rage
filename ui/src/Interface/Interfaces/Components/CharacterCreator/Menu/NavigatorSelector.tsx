import styles from '../../../Styles/CharacterCreatorInterface.module.css';

interface NavigatorSelectorProps {
    label: string;
    selectedValue: number;
    onValueChange: (value: number) => void;
    availableValues: number[];
}

export default function NavigatorSelector({ label, selectedValue, onValueChange, availableValues }: NavigatorSelectorProps) {
    const currentIndex = availableValues.indexOf(selectedValue);
    
    const goToPrevious = () => {
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : availableValues.length - 1;
        onValueChange(availableValues[prevIndex]);
    };
    
    const goToNext = () => {
        const nextIndex = currentIndex < availableValues.length - 1 ? currentIndex + 1 : 0;
        onValueChange(availableValues[nextIndex]);
    };

    return (
        <>
            <div className={styles.smallLabel}>{label}</div>
            <div className={styles.styleNavigator}>
                <button 
                    className={styles.styleArrow} 
                    onClick={goToPrevious}
                    type="button"
                >
                    &#8249;
                </button>
                <div className={styles.styleValue}>
                    {selectedValue + 1}
                </div>
                <button 
                    className={styles.styleArrow} 
                    onClick={goToNext}
                    type="button"
                >
                    &#8250;
                </button>
            </div>
        </>
    );
}