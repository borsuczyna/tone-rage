import styles from '../../Styles/CharacterCreatorInterface.module.css';

export default function RightMenu({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.rightMenu}>
            {children}
        </div>
    );
}