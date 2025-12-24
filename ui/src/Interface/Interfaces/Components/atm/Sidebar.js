import * as Icons from 'lucide-react';
import styles from '../../Styles/AtmInterface.module.css';
import translate from '@shared/Translation/Translation';
export default function Sidebar({ activeTab, onTabChange }) {
    return (<div className={styles.sidebar}>
            <button className={`${styles.sidebarItem} ${activeTab === 'dashboard' ? styles.active : ''}`} onClick={() => onTabChange('dashboard')} title={translate('atm.sidebar.dashboard')}>
                <Icons.LayoutDashboard size="1.2rem"/>
            </button>
            <button className={`${styles.sidebarItem} ${activeTab === 'transactions' ? styles.active : ''}`} onClick={() => onTabChange('transactions')} title={translate('atm.sidebar.transactions')}>
                <Icons.ArrowLeftRight size="1.2rem"/>
            </button>
        </div>);
}
