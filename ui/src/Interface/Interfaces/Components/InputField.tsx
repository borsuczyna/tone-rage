import type { ReactNode, InputHTMLAttributes } from 'react';
import styles from './InputField.module.css';

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    icon?: ReactNode;
    label?: string;
    rightElement?: ReactNode;
    groupStyle?: React.CSSProperties;
    onChange: (value: string) => void;
}

export default function InputField({ 
    icon, 
    label,
    groupStyle,
    onChange,
    className,
    rightElement,
    ...inputProps
}: InputFieldProps) {
    return (
        <div className={styles.inputGroup} style={groupStyle}>
            {label && <label>{label}</label>}
            <div className={styles.inputWrapper}>
                {icon}
                <input
                    {...inputProps}
                    className={className}
                    onChange={(e) => onChange(e.target.value)}
                />
                {rightElement}
            </div>
        </div>
    );
}