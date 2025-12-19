import csx from 'src/Utils/MergeClass';
import styles from '../../Styles/CharacterCreatorInterface.module.css';

export default function RightMenu({ children, isTransitioning }: {  children: React.ReactNode, isTransitioning: boolean }) {
    return (
        <div className={csx(styles.rightMenu, isTransitioning && styles.transitioning)}>
            {children}
        </div>
    );
}