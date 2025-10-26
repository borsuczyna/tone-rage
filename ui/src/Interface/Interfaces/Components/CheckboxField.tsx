import type { ReactNode, InputHTMLAttributes } from 'react';
import styles from './CheckboxField.module.css';

interface CheckboxFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
    label: ReactNode;
    onChange: (checked: boolean) => void;
}

export default function CheckboxField({ 
    label, 
    onChange,
    className,
    ...inputProps
}: CheckboxFieldProps) {
    return (
        <div className={styles.checkboxGroup}>
            <input
                {...inputProps}
                type="checkbox"
                className={className}
                onChange={(e) => onChange(e.target.checked)}
            />
            <label htmlFor={inputProps.id}>{label}</label>
        </div>
    );
}