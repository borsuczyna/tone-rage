import styles from '../../../Styles/CharacterCreatorInterface.module.css';

export default function OptionLabel({ label, marginTop }: { label: string; marginTop?: boolean }) {
    return <div className={styles.labelRow} style={marginTop ? { marginTop: '1rem' } : undefined}>
        <div className={styles.label}>{label}</div>
        <div className={styles.labelBar}></div>
    </div>;
}