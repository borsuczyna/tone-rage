import styles from '../../../Styles/CharacterCreatorInterface.module.css';

interface HorizontalImageSelectorProps {
    options: number[];
    path: string;
    selected: number;
    setSelected: (option: number) => void;
}

export default function HorizontalImageSelector({ options, path, selected, setSelected }: HorizontalImageSelectorProps) {
    return (
        <div className={styles.horizontalImageSelector}>
            {options.map((option) => (
                <div
                    key={option}
                    className={`${styles.horizontalImageItem} ${selected === option ? styles.active : ''}`}
                    onClick={() => setSelected(option)}
                >
                    <img src={path.replace('{id}', option.toString())} alt={`Option ${option}`} />
                </div>
            ))}
        </div>
    );
}