import type { ButtonHTMLAttributes, ReactNode } from 'react';
import * as Icons from "lucide-react";
import styles from './Button.module.css';

interface ToneButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'dark' | 'glass' | 'ghost' | 'link' | 'gray';
    size?: 'small' | 'medium' | 'large';
    glow?: boolean;
    loading?: boolean;
}

export default function Button({ 
    children, 
    variant = 'primary', 
    size = 'medium',
    glow = true,
    loading = false,
    className = '',
    style,
    disabled,
    ...buttonProps
}: ToneButtonProps) {
    const buttonClass = `${styles.toneButton} ${styles[variant]} ${styles[size]} ${className}`;
    const glowClass = `${styles.glowEffect} ${styles[variant]}`;
    const isDisabled = disabled || loading;
    const wrapperClass = `${styles.buttonWrapper} ${isDisabled ? styles.disabled : ''}`;
    
    return (
        <div className={wrapperClass} style={style}>
            {/* Glow effect - only for variants that support it */}
            {glow && (variant === 'primary' || variant === 'secondary' || variant === 'glass') && (
                <button 
                    className={glowClass}
                    aria-hidden="true"
                    tabIndex={-1}
                    style={style}
                >
                    {loading ? <Icons.Loader2 size='1rem' className={styles.spin} /> : children}
                </button>
            )}
            
            {/* Main button */}
            <button 
                {...buttonProps}
                className={buttonClass}
                style={style}
                disabled={isDisabled}
            >
                {loading ? (
                    <Icons.Loader2 size='1rem' className={styles.spin} />
                ) : (
                    children
                )}
            </button>
        </div>
    );
}