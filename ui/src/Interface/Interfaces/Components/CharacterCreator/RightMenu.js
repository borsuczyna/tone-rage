import csx from 'src/Utils/MergeClass';
import styles from '../../Styles/CharacterCreatorInterface.module.css';
export default function RightMenu({ children, isTransitioning }) {
    return (<div className={csx(styles.rightMenu, isTransitioning && styles.transitioning)}>
            {children}
        </div>);
}
