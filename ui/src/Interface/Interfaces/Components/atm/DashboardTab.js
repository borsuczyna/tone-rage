import styles from '../../Styles/AtmInterface.module.css';
import AccountOverview from './AccountOverview';
import QuickActions from './QuickActions';
import RecentTransactions from './RecentTransactions';
import VirtualCard from './VirtualCard';
export default function DashboardTab({ bankBalance, recentTransactions, userId, accountName, walletBalance, onDepositClick, onWithdrawClick, onTransferClick, setActiveTab }) {
    return (<div className={styles.dashboardContainer}>
            <AccountOverview bankBalance={bankBalance} walletBalance={walletBalance} userId={userId}/>
            
            <QuickActions onDepositClick={onDepositClick} onWithdrawClick={onWithdrawClick} onTransferClick={onTransferClick}/>

            <div className={styles.bottomRow}>
                <RecentTransactions transactions={recentTransactions} onViewAllClick={() => setActiveTab('transactions')}/>
                
                <VirtualCard userId={userId} accountName={accountName}/>
            </div>
        </div>);
}
