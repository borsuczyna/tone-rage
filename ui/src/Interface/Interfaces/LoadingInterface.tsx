import { useState, useEffect, useRef } from 'react';
import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import { useRageEvent } from 'src/Hooks/RageEventProvider';
import styles from './Styles/LoadingInterface.module.css';
import Logo from './Components/Logo';

export default function LoadingInterface() {
    const { isInterfaceVisible } = useInterfaceVisibility();
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const timeoutRef = useRef<number | null>(null);
    const isVisible = isInterfaceVisible('LoadingInterface');

    // Handle fade out event
    useRageEvent('fadeOut', () => {
        setIsFadingOut(true);
        // Hide interface after 1 second
        timeoutRef.current = setTimeout(() => {
            setIsHidden(true);
        }, 1000) as unknown as number;
    });

    useEffect(() => {
        if (isVisible) {
            setIsFadingOut(false);
            setIsHidden(false);
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        }
    }, [isVisible]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    if (!isVisible || isHidden) return null;

    return (
        <div className={`${styles.container} ${isFadingOut ? styles.fadingOut : ''}`}>
            {/* Flashing lights in background */}
            <div className={styles.lights}>
                <div className={`${styles.light} ${styles.lightPurple}`}></div>
                <div className={`${styles.light} ${styles.lightPink}`}></div>
                <div className={`${styles.light} ${styles.lightCyan}`}></div>
                <div className={`${styles.light} ${styles.lightBlue}`}></div>
            </div>

            {/* Logo */}
            <div className={styles.logoContainer}>
                <Logo glow={3} className={styles.logo} />
            </div>

            {/* Loading bar */}
            <div className={styles.loadingBarContainer}>
                <div className={styles.loadingBar}>
                    <div className={styles.loadingBarFill}></div>
                </div>
            </div>
        </div>
    );
}
