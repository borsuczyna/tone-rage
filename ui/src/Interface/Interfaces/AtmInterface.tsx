import { useState, useEffect, useCallback } from 'react';
import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import styles from './Styles/AtmInterface.module.css';
import type { AtmTransactionData } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/MoneyHelper';
import translate from '@shared/Translation/Translation';
import { WithdrawTab, DepositTab, LogsTab } from './Components/atm';
import { fetchServerData, triggerEvent } from 'src/Hooks/Fetch';
import * as Icons from 'lucide-react';

type AtmTab = 'dashboard' | 'deposit' | 'withdraw' | 'transactions' | 'accountInfo';

interface AtmData {
    bankMoney: number;
    transactions: AtmTransactionData[];
}

export default function AtmInterface() {
    const { isInterfaceVisible } = useInterfaceVisibility();
    const [activeTab, setActiveTab] = useState<AtmTab>('dashboard');
    const [currentBalance, setCurrentBalance] = useState(0);
    const [transactions, setTransactions] = useState<AtmTransactionData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Calculate totals from transactions
    const totalDeposits = transactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = transactions
        .filter(t => t.type === 'withdraw')
        .reduce((sum, t) => sum + t.amount, 0);

    const fetchAtmData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await fetchServerData<AtmData>('atm:getData', {});
            setCurrentBalance(data.bankMoney);
            setTransactions(data.transactions);
        } catch (error) {
            console.error('Failed to fetch ATM data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const visible = isInterfaceVisible('AtmInterface');
        if (visible) {
            fetchAtmData();
        }
    }, [isInterfaceVisible, fetchAtmData]);

    const handleTransaction = async (amount: number, type: 'withdraw' | 'deposit') => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            const endpoint = type === 'withdraw' ? 'atm:withdraw' : 'atm:deposit';
            const response = await fetchServerData<{ success: boolean; bankMoney?: number; transactions?: AtmTransactionData[] }>(
                endpoint,
                { amount }
            );

            if (response.success && response.bankMoney !== undefined && response.transactions) {
                setCurrentBalance(response.bankMoney);
                setTransactions(response.transactions);
            }
        } catch (error) {
            console.error(`Failed to ${type}:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        triggerEvent('atm:closeInterface');
    };

    if (!isInterfaceVisible('AtmInterface')) return null;

    const navItems = [
        { id: 'dashboard' as AtmTab, label: translate('atm.tab.dashboard'), icon: Icons.LayoutDashboard },
        { id: 'deposit' as AtmTab, label: translate('atm.tab.deposit'), icon: Icons.ArrowDownToLine },
        { id: 'withdraw' as AtmTab, label: translate('atm.tab.withdraw'), icon: Icons.ArrowUpFromLine },
        { id: 'transactions' as AtmTab, label: translate('atm.tab.transactions'), icon: Icons.Receipt },
        { id: 'accountInfo' as AtmTab, label: translate('atm.tab.accountInfo'), icon: Icons.UserCircle },
    ];

    const formatDate = (date: Date) => {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderDashboard = () => (
        <div className={styles.dashboardContent}>
            {/* Balance Cards */}
            <div className={styles.balanceCards}>
                <div className={`${styles.balanceCard} ${styles.primaryCard}`}>
                    <div className={styles.cardHeader}>
                        <Icons.Wallet size="1rem" />
                        <span>{translate('atm.currentBalance')}</span>
                    </div>
                    <div className={styles.cardAmount}>{formatMoney(currentBalance)}</div>
                </div>
                <div className={styles.balanceCard}>
                    <div className={styles.cardHeader}>
                        <Icons.ArrowDown size="1rem" className={styles.depositIcon} />
                        <span>{translate('atm.totalDeposits')}</span>
                    </div>
                    <div className={styles.cardAmount}>{formatMoney(totalDeposits)}</div>
                </div>
                <div className={styles.balanceCard}>
                    <div className={styles.cardHeader}>
                        <Icons.ArrowUp size="1rem" className={styles.withdrawIcon} />
                        <span>{translate('atm.totalWithdrawals')}</span>
                    </div>
                    <div className={styles.cardAmount}>{formatMoney(totalWithdrawals)}</div>
                </div>
            </div>

            {/* Bank Card and Account Info */}
            <div className={styles.cardAndInfo}>
                <div className={styles.bankCardSection}>
                    <div className={styles.bankCard}>
                        <div className={styles.bankCardChip}>
                            <Icons.CreditCard size="1.5rem" />
                        </div>
                        <div className={styles.bankCardNumber}>
                            •••• •••• •••• 1935
                        </div>
                        <div className={styles.bankCardBottom}>
                            <div className={styles.cardHolderSection}>
                                <span className={styles.cardLabel}>{translate('atm.cardHolder')}</span>
                                <span className={styles.cardValue}>Account Holder</span>
                            </div>
                            <div className={styles.validThruSection}>
                                <span className={styles.cardLabel}>{translate('atm.validThru')}</span>
                                <span className={styles.cardValue}>Tone Bank</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.accountInfoSection}>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>{translate('atm.accountType')}:</span>
                        <span className={styles.infoValue}>{translate('atm.accountType.standard')}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>{translate('atm.accountNumber')}:</span>
                        <span className={styles.infoValue}>UTL25421935</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>{translate('atm.created')}:</span>
                        <span className={styles.infoValue}>January 15, 2023</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>{translate('atm.status')}:</span>
                        <span className={`${styles.infoValue} ${styles.statusActive}`}>{translate('atm.status.active')}</span>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.recentActivity}>
                <div className={styles.activityHeader}>
                    <h3>{translate('atm.recentActivity')}</h3>
                    <button className={styles.viewAllBtn} onClick={() => setActiveTab('transactions')}>
                        {translate('atm.viewAll')}
                    </button>
                </div>
                <div className={styles.activityList}>
                    {transactions.slice(0, 3).map((transaction) => (
                        <div key={transaction.id} className={styles.activityItem}>
                            <div className={`${styles.activityIcon} ${transaction.type === 'deposit' ? styles.depositBg : styles.withdrawBg}`}>
                                {transaction.type === 'deposit' ? (
                                    <Icons.ArrowDown size="1rem" />
                                ) : (
                                    <Icons.ArrowUp size="1rem" />
                                )}
                            </div>
                            <div className={styles.activityDetails}>
                                <span className={styles.activityType}>
                                    {transaction.type === 'deposit' ? translate('atm.tab.deposit') : translate('atm.tab.withdraw')}
                                </span>
                                <span className={styles.activityDate}>{formatDate(transaction.date)}</span>
                            </div>
                            <div className={`${styles.activityAmount} ${transaction.type === 'deposit' ? styles.depositAmount : styles.withdrawAmount}`}>
                                {transaction.type === 'deposit' ? '+' : '-'}{formatMoney(transaction.amount)}
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && (
                        <div className={styles.noTransactions}>No recent transactions</div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderAccountInfo = () => (
        <div className={styles.accountInfoTab}>
            <h2>{translate('atm.tab.accountInfo')}</h2>
            <div className={styles.accountDetails}>
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>{translate('atm.accountType')}</span>
                    <span className={styles.detailValue}>{translate('atm.accountType.standard')}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>{translate('atm.accountNumber')}</span>
                    <span className={styles.detailValue}>UTL25421935</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>{translate('atm.currentBalance')}</span>
                    <span className={styles.detailValue}>{formatMoney(currentBalance)}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>{translate('atm.status')}</span>
                    <span className={`${styles.detailValue} ${styles.statusActive}`}>{translate('atm.status.active')}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.bankingApp}>
                {/* Sidebar */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <Icons.Landmark size="1.25rem" className={styles.bankIcon} />
                        <span>{translate('atm.title')}</span>
                        <button className={styles.closeBtn} onClick={handleClose}>
                            <Icons.X size="1rem" />
                        </button>
                    </div>

                    <div className={styles.userProfile}>
                        <div className={styles.userAvatar}>
                            <Icons.User size="1.5rem" />
                        </div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>Account Holder</span>
                            <span className={styles.accountId}>UTL25421935</span>
                        </div>
                    </div>

                    <nav className={styles.navigation}>
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                className={`${styles.navItem} ${activeTab === item.id ? styles.activeNav : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <item.icon size="1.1rem" />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className={styles.sidebarFooter}>
                        <span>{translate('atm.lastLogin')}: Today, 15:42</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className={styles.mainContent}>
                    <div className={styles.contentHeader}>
                        <h1>{navItems.find(n => n.id === activeTab)?.label}</h1>
                    </div>

                    <div className={styles.contentBody}>
                        {activeTab === 'dashboard' && renderDashboard()}
                        {activeTab === 'deposit' && (
                            <DepositTab onTransaction={(amount) => handleTransaction(amount, 'deposit')} disabled={isLoading} />
                        )}
                        {activeTab === 'withdraw' && (
                            <WithdrawTab onTransaction={(amount) => handleTransaction(amount, 'withdraw')} disabled={isLoading} />
                        )}
                        {activeTab === 'transactions' && <LogsTab transactions={transactions} />}
                        {activeTab === 'accountInfo' && renderAccountInfo()}
                    </div>
                </div>
            </div>
        </div>
    );
}
