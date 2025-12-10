import * as Icons from 'lucide-react';
import styles from '../../Styles/AtmInterface.module.css';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: 'dashboard' | 'transactions' | 'accounts' | 'society' | 'savings' | 'loans') => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    return (
        <div className={styles.sidebar}>
            <button 
                className={`${styles.sidebarItem} ${activeTab === 'dashboard' ? styles.active : ''}`}
                onClick={() => onTabChange('dashboard')}
            >
                <Icons.LayoutDashboard size="1.2rem" />
            </button>
            <button 
                className={`${styles.sidebarItem} ${activeTab === 'transactions' ? styles.active : ''}`}
                onClick={() => onTabChange('transactions')}
            >
                <Icons.ArrowLeftRight size="1.2rem" />
            </button>
        </div>
    );
}