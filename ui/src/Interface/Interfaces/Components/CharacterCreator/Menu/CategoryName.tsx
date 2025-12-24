import styles from '../../../Styles/CharacterCreatorInterface.module.css';

export default function CategoryName({ name }: { name: string }) {
    return (
        <div>
            <span className={styles.categoryName}>
                {name}
            </span>
        </div>
    );
}