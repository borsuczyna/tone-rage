import { useState, useEffect, useRef } from 'react';
import styles from './UpdatesPanel.module.css';
import updateData from '@shared/UpdatesData';
export default function UpdatesPanel() {
    // Get only the last 3 updates
    const recentUpdates = updateData.slice(-10);
    const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const intervalRef = useRef(null);
    // Function to start/restart the auto-cycling timer
    const startTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentUpdateIndex((prev) => (prev + 1) % recentUpdates.length);
                setIsTransitioning(false);
            }, 300);
        }, 10000);
    };
    // Auto-change updates every 10 seconds
    useEffect(() => {
        startTimer();
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);
    const handleIndicatorClick = (index) => {
        if (index !== currentUpdateIndex) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentUpdateIndex(index);
                setIsTransitioning(false);
            }, 300);
            // Reset the timer when user manually changes update
            startTimer();
        }
    };
    const currentUpdate = recentUpdates[currentUpdateIndex];
    return (<div className={styles.updatesPanel}>
            <div className={`${styles.updateCard} ${isTransitioning ? styles.transitioning : ''}`}>
                <div className={styles.updateImageContainer}>
                    <img src={currentUpdate.image} alt={currentUpdate.title} className={styles.updateImage} onError={(e) => {
            // Fallback to a different cat image if one fails to load
            e.currentTarget.src = 'https://placekitten.com/400/200';
        }}/>
                </div>
                <div className={styles.updateContent}>
                    <div className={styles.updateHeader}>
                        <h2>{currentUpdate.title}</h2>
                        <span className={styles.version}>{currentUpdate.version}</span>
                    </div>
                    <p className={styles.updateDescription}>
                        {currentUpdate.description}
                    </p>
                </div>
                <div className={styles.updateIndicators}>
                    {recentUpdates.map((_, index) => (<div key={index} className={`${styles.indicator} ${index === currentUpdateIndex ? styles.active : ''}`} onClick={() => handleIndicatorClick(index)}/>))}
                </div>
            </div>
        </div>);
}
