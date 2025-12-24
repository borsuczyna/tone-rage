import styles from './InputField.module.css';
export default function InputField({ icon, label, groupStyle, onChange, className, rightElement, ...inputProps }) {
    return (<div className={styles.inputGroup} style={groupStyle}>
            {label && <label>{label}</label>}
            <div className={styles.inputWrapper}>
                {icon}
                <input {...inputProps} className={className} onChange={(e) => onChange(e.target.value)}/>
                {rightElement}
            </div>
        </div>);
}
