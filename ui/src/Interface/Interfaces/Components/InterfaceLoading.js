import * as Icons from 'lucide-react';
import styles from '../Styles/InterfaceLoading.module.css';
export default function InterfaceLoading() {
    return (<div className={styles.spinner}>
            <Icons.Loader2 size={'4rem'} className={styles.spinnerIcon}/>
        </div>);
}
