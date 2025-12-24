import csx from 'src/Utils/MergeClass';
import styles from '../../../Styles/CharacterCreatorInterface.module.css';
export default function Parents({ gender, options, selected, setSelected }) {
    const imageUrl = `/creator/${gender}/{id}.png`;
    return (<div className={styles.parentsList}>
            {options.map((option) => (<div key={option} className={csx(styles.parentItem, selected === option && styles.active)} onClick={() => setSelected(option)}>
                    <img src={imageUrl.replace('{id}', option.toString())} alt={`${gender} parent ${option}`}/>
                </div>))}
        </div>);
}
