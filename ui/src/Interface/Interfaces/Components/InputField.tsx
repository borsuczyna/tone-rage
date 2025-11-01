import type { ReactNode, InputHTMLAttributes } from 'react';
import styles from './InputField.module.css';

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    icon?: ReactNode;
    label: string;
    onChange: (value: string) => void;
}

export default function InputField({ 
    icon, 
    label, 
    onChange,
    className,
    ...inputProps
}: InputFieldProps) {
    return (
        <div className={styles.inputGroup}>
            <label>{label}</label>
            <div className={styles.inputWrapper}>
                {icon && <div className={styles.inputIcon}>{icon}</div>}
                <input
                    {...inputProps}
                    className={className}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}