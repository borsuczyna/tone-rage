import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Switch.module.css';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
    label?: ReactNode;
    onChange: (checked: boolean) => void;
    size?: 'small' | 'medium' | 'large';
}

export default function Switch({ 
    label,
    onChange,
    size = 'medium',
    className = '',
    ...inputProps
}: SwitchProps) {
    const switchClass = `${styles.switch} ${styles[size]} ${className}`;
    
    return (
        <div className={styles.switchContainer}>
            <label className={styles.switchLabel}>
                <input
                    {...inputProps}
                    type="checkbox"
                    className={styles.switchInput}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span className={switchClass}>
                    <span className={styles.switchThumb}></span>
                </span>
                {label && <span className={styles.labelText}>{label}</span>}
            </label>
        </div>
    );
}