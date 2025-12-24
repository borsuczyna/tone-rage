import styles from './Switch.module.css';
export default function Switch({ label, onChange, size = 'medium', className = '', ...inputProps }) {
    const switchClass = `${styles.switch} ${styles[size]} ${className}`;
    return (<div className={styles.switchContainer}>
            <label className={styles.switchLabel}>
                <input {...inputProps} type="checkbox" className={styles.switchInput} onChange={(e) => onChange(e.target.checked)}/>
                <span className={switchClass}>
                    <span className={styles.switchThumb}></span>
                </span>
                {label && <span className={styles.labelText}>{label}</span>}
            </label>
        </div>);
}
