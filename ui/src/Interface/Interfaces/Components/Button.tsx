import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ToneButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'dark' | 'glass' | 'ghost' | 'link';
    size?: 'small' | 'medium' | 'large';
    glow?: boolean;
}

export default function Button({ 
    children, 
    variant = 'primary', 
    size = 'medium',
    glow = true,
    className = '',
    style,
    ...buttonProps
}: ToneButtonProps) {
    const buttonClass = `${styles.toneButton} ${styles[variant]} ${styles[size]} ${className}`;
    const glowClass = `${styles.glowEffect} ${styles[variant]}`;
    
    return (
        <div className={styles.buttonWrapper} style={style}>
            {/* Glow effect - only for variants that support it */}
            {glow && (variant === 'primary' || variant === 'secondary' || variant === 'glass') && (
                <button 
                    className={glowClass}
                    aria-hidden="true"
                    tabIndex={-1}
                    style={style}
                >
                    {children}
                </button>
            )}
            
            {/* Main button */}
            <button 
                {...buttonProps}
                className={buttonClass}
                style={style}
            >
                {children}
            </button>
        </div>
    );
}