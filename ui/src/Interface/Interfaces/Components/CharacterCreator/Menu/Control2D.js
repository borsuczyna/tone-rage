import { useState, useRef, useEffect } from 'react';
import styles from '../../../Styles/CharacterCreatorInterface.module.css';
export default function Control2D({ labelX, labelY, valueX, valueY, onChange, minX = 0, maxX = 100, minY = 0, maxY = 100 }) {
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);
    const dotRef = useRef(null);
    const percentageX = ((valueX - minX) / (maxX - minX)) * 100;
    const percentageY = ((valueY - minY) / (maxY - minY)) * 100;
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        updateValues(e.clientX, e.clientY);
    };
    const handleMouseMove = (e) => {
        if (!isDragging)
            return;
        updateValues(e.clientX, e.clientY);
    };
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    const updateValues = (clientX, clientY) => {
        if (!containerRef.current)
            return;
        const rect = containerRef.current.getBoundingClientRect();
        const percentX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const percentY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
        const newValueX = Math.round(minX + percentX * (maxX - minX));
        const newValueY = Math.round(minY + percentY * (maxY - minY));
        onChange(newValueX, newValueY);
    };
    const handleContainerClick = (e) => {
        if (e.target === dotRef.current)
            return;
        updateValues(e.clientX, e.clientY);
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
    return (<div className={styles.control2DContainer}>
            <div className={styles.control2DLabels}>
                <span className={styles.control2DLabel}>{labelX}</span>
                <span className={styles.control2DLabel}>{labelY}</span>
            </div>
            <div ref={containerRef} className={styles.control2DBox} onMouseDown={handleContainerClick}>
                <div className={styles.control2DGrid}>
                    <div className={styles.control2DGridLine} style={{ left: '25%' }}/>
                    <div className={styles.control2DGridLine} style={{ left: '50%' }}/>
                    <div className={styles.control2DGridLine} style={{ left: '75%' }}/>
                    <div className={styles.control2DGridLineHorizontal} style={{ top: '50%' }}/>
                </div>
                <div ref={dotRef} className={styles.control2DDot} style={{
            left: `${percentageX}%`,
            top: `${percentageY}%`
        }} onMouseDown={handleMouseDown}/>
            </div>
        </div>);
}
