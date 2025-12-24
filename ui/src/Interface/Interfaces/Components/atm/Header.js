import * as Icons from 'lucide-react';
import styles from '../../Styles/AtmInterface.module.css';
import Logo from '../Logo';
export default function Header({ onClose }) {
    return (<div className={styles.header}>
            <div className={styles.headerBranding}>
                <Logo glow={3} className={styles.logo}/>
            </div>
            <div className={styles.headerRight}>
                <div className={styles.closeButton} onClick={onClose}>
                    <Icons.X size="1.3rem"/>
                </div>
            </div>
        </div>);
}
