import translate from '@shared/Translation/Translation';
import styles from '../../../Styles/CharacterCreatorInterface.module.css';

export default function CreatorInfo() {
    return (
        <div className={styles.creatorInfo}>
            <span className={styles.creatorTitle}>{translate('character.creator.title')}</span>
            <span className={styles.creatorDescription}>{translate('character.creator.description')}</span>
        </div>
    );
}