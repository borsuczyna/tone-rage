import styles from './CheckboxField.module.css';
export default function CheckboxField({ label, onChange, className, ...inputProps }) {
    return (<div className={styles.checkboxGroup}>
            <input {...inputProps} type="checkbox" className={className} onChange={(e) => onChange(e.target.checked)}/>
            <label htmlFor={inputProps.id}>{label}</label>
        </div>);
}
