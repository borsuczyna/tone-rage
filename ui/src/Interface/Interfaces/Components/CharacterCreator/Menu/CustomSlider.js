import { useState, useRef, useEffect } from 'react';
import styles from '../../../Styles/CharacterCreatorInterface.module.css';
export default function CustomSlider({ label, value, onChange, min = 0, max = 100, step = 1 }) {
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);
    const thumbRef = useRef(null);
    const percentage = ((value - min) / (max - min)) * 100;
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        updateValue(e.clientX);
    };
    const handleMouseMove = (e) => {
        if (!isDragging)
            return;
        updateValue(e.clientX);
    };
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    const updateValue = (clientX) => {
        if (!sliderRef.current)
            return;
        const rect = sliderRef.current.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const newValue = Math.round((min + percentage * (max - min)) / step) * step;
        onChange(Math.max(min, Math.min(max, newValue)));
    };
    const handleSliderClick = (e) => {
        if (e.target === thumbRef.current)
            return;
        updateValue(e.clientX);
    };
    useEffect(() => {
        if (!isDragging)
            return;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);
    return (<div className={styles.customSliderContainer}>
            <div className={styles.smallLabel}>{label}</div>
            <div className={styles.sliderWrapper}>
                <div ref={sliderRef} className={styles.customSliderTrack} onMouseDown={handleSliderClick}>
                    <div className={styles.customSliderProgress} style={{ width: `${percentage}%` }}/>
                    <div ref={thumbRef} className={styles.customSliderThumb} style={{ left: `${percentage}%` }} onMouseDown={handleMouseDown}/>
                </div>
            </div>
        </div>);
}
