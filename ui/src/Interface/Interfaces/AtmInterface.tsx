import { useState, useEffect, useCallback } from 'react';
import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import { useUserInfo } from 'src/Hooks/UserInfoProvider';
import styles from './Styles/AtmInterface.module.css';
import type { AtmTransactionData } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/MoneyHelper';
import translate from '@shared/Translation/Translation';
import { DashboardTab, TransactionsTab, DepositModal, WithdrawModal, TransferModal } from './Components/atm';
import { fetchServerData } from 'src/Hooks/Fetch';
import * as Icons from 'lucide-react';



interface AtmData {
    bankMoney: number;
    walletMoney: number;
    userId: number;
    transactions: AtmTransactionData[];
}

type SidebarTab = 'dashboard' | 'transactions' | 'accounts' | 'society' | 'savings' | 'loans';

export default function AtmInterface() {
    const { isInterfaceVisible } = useInterfaceVisibility();
    const { userInfo } = useUserInfo();
    const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
    const [bankBalance, setBankBalance] = useState(0);
    const [walletMoney, setWalletMoney] = useState(0);
    const [userId, setUserId] = useState(0);
    const [transactions, setTransactions] = useState<AtmTransactionData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    const fetchAtmData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await fetchServerData<AtmData>('atm:getData', {});
            setBankBalance(data.bankMoney);
            setWalletMoney(data.walletMoney);
            setUserId(data.userId);
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

    const handleDeposit = async (amount: number) => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            const response = await fetchServerData<{ success: boolean; bankMoney?: number; walletMoney?: number; transactions?: AtmTransactionData[] }>(
                'atm:deposit',
                { amount }
            );

            if (response.success && response.bankMoney !== undefined && response.walletMoney !== undefined && response.transactions) {
                setBankBalance(response.bankMoney);
                setWalletMoney(response.walletMoney);
                setTransactions(response.transactions);
            }
        } catch (error) {
            console.error('Failed to deposit:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWithdraw = async (amount: number) => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            const response = await fetchServerData<{ success: boolean; bankMoney?: number; walletMoney?: number; transactions?: AtmTransactionData[] }>(
                'atm:withdraw',
                { amount }
            );

            if (response.success && response.bankMoney !== undefined && response.walletMoney !== undefined && response.transactions) {
                setBankBalance(response.bankMoney);
                setWalletMoney(response.walletMoney);
                setTransactions(response.transactions);
            }
        } catch (error) {
            console.error('Failed to withdraw:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTransfer = async (targetUserId: number, amount: number) => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            const response = await fetchServerData<{ success: boolean; bankMoney?: number; walletMoney?: number; transactions?: AtmTransactionData[] }>(
                'atm:transfer',
                { targetUserId, amount }
            );

            if (response.success && response.bankMoney !== undefined && response.walletMoney !== undefined && response.transactions) {
                setBankBalance(response.bankMoney);
                setWalletMoney(response.walletMoney);
                setTransactions(response.transactions);
            }
        } catch (error) {
            console.error('Failed to transfer:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isInterfaceVisible('AtmInterface')) return null;

    return (
        <>
            <div className={styles.container}>
                <div className={styles.atmMachine}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerBranding}>
                            <span className={styles.brandName}>WASABI</span>
                            <span className={styles.brandSuffix}>BANKING</span>
                        </div>
                        <div className={styles.headerCenter}>
                            <div className={styles.userAvatar}>
                                <Icons.User size="1.5rem" />
                            </div>
                            <div className={styles.welcomeText}>
                                <span>{translate('atm.header.welcome')}, {userInfo.username}</span>
                            </div>
                        </div>
                        <div className={styles.headerRight}>
                            <div className={styles.walletBadge}>
                                <span className={styles.walletLabel}>{translate('atm.header.wallet')}</span>
                                <span className={styles.walletAmount}>{formatMoney(walletMoney)}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.mainLayout}>
                        {/* Sidebar Navigation */}
                        <div className={styles.sidebar}>
                            <button 
                                className={`${styles.sidebarItem} ${activeTab === 'dashboard' ? styles.active : ''}`}
                                onClick={() => setActiveTab('dashboard')}
                            >
                                <Icons.LayoutDashboard size="1.2rem" />
                                <span>{translate('atm.sidebar.dashboard')}</span>
                            </button>
                            <button 
                                className={`${styles.sidebarItem} ${activeTab === 'transactions' ? styles.active : ''}`}
                                onClick={() => setActiveTab('transactions')}
                            >
                                <Icons.Receipt size="1.2rem" />
                                <span>{translate('atm.sidebar.transactions')}</span>
                            </button>
                            <button 
                                className={`${styles.sidebarItem} ${activeTab === 'accounts' ? styles.active : ''}`}
                                onClick={() => setActiveTab('accounts')}
                            >
                                <Icons.Users size="1.2rem" />
                                <span>{translate('atm.sidebar.accounts')}</span>
                            </button>
                            <button 
                                className={`${styles.sidebarItem} ${activeTab === 'society' ? styles.active : ''}`}
                                onClick={() => setActiveTab('society')}
                            >
                                <Icons.Building2 size="1.2rem" />
                                <span>{translate('atm.sidebar.society')}</span>
                            </button>
                            <button 
                                className={`${styles.sidebarItem} ${activeTab === 'savings' ? styles.active : ''}`}
                                onClick={() => setActiveTab('savings')}
                            >
                                <Icons.PiggyBank size="1.2rem" />
                                <span>{translate('atm.sidebar.savings')}</span>
                            </button>
                            <button 
                                className={`${styles.sidebarItem} ${activeTab === 'loans' ? styles.active : ''}`}
                                onClick={() => setActiveTab('loans')}
                            >
                                <Icons.Landmark size="1.2rem" />
                                <span>{translate('atm.sidebar.loans')}</span>
                            </button>
                        </div>

                        {/* Main Content */}
                        <div className={styles.content}>
                            {activeTab === 'dashboard' ? (
                                <DashboardTab 
                                    bankBalance={bankBalance}
                                    recentTransactions={transactions}
                                    userId={userId}
                                    onDepositClick={() => setIsDepositModalOpen(true)}
                                    onWithdrawClick={() => setIsWithdrawModalOpen(true)}
                                    onTransferClick={() => setIsTransferModalOpen(true)}
                                />
                            ) : activeTab === 'transactions' ? (
                                <TransactionsTab transactions={transactions} />
                            ) : (
                                <div className={styles.comingSoon}>
                                    <Icons.Construction size="3rem" />
                                    <p>{translate('atm.comingSoon')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <DepositModal 
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
                onDeposit={handleDeposit}
                isLoading={isLoading}
            />
            <WithdrawModal 
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                onWithdraw={handleWithdraw}
                isLoading={isLoading}
            />
            <TransferModal 
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                onTransfer={handleTransfer}
                isLoading={isLoading}
            />
        </>
    );
}