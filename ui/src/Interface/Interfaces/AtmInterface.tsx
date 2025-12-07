import { useState, useEffect, useCallback } from 'react';
import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import { useUserInfo } from 'src/Hooks/UserInfoProvider';
import styles from './Styles/AtmInterface.module.css';
import type { AtmTransactionData } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/MoneyHelper';
import translate from '@shared/Translation/Translation';
import { DashboardTab, TransactionsTab, DepositModal, WithdrawModal, TransferModal } from './Components/atm';
import { fetchServerData, triggerEvent } from 'src/Hooks/Fetch';
import * as Icons from 'lucide-react';

type AtmTab = 'dashboard' | 'transactions';

interface AtmData {
    bankMoney: number;
    walletMoney: number;
    userId: number;
    transactions: AtmTransactionData[];
}

export default function AtmInterface() {
    const { isInterfaceVisible } = useInterfaceVisibility();
    const { userInfo } = useUserInfo();
    const [activeTab, setActiveTab] = useState<AtmTab>('dashboard');
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

    const handleClose = () => {
        triggerEvent('atm:closeInterface');
    };

    if (!isInterfaceVisible('AtmInterface')) return null;

    return (
        <>
            <div className={styles.container}>
                <div className={styles.atmMachine}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <div className={styles.welcomeText}>
                                <span className={styles.welcome}>{translate('atm.header.welcome')}</span>
                                <span className={styles.username}>{userInfo.username}</span>
                            </div>
                        </div>
                        <div className={styles.headerRight}>
                            <div className={styles.balanceInfo}>
                                <div className={styles.balanceItem}>
                                    <Icons.Wallet size="1rem" />
                                    <span>{formatMoney(walletMoney)}</span>
                                </div>
                                <div className={styles.balanceItem}>
                                    <Icons.CreditCard size="1rem" />
                                    <span>{formatMoney(bankBalance)}</span>
                                </div>
                            </div>
                            <button className={styles.closeButton} onClick={handleClose}>
                                <Icons.X size="1.5rem" />
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className={styles.tabNavigation}>
                        <button 
                            className={`${styles.tab} ${activeTab === 'dashboard' ? styles.active : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <Icons.LayoutDashboard size="1rem" />
                            {translate('atm.tab.dashboard')}
                        </button>
                        <button 
                            className={`${styles.tab} ${activeTab === 'transactions' ? styles.active : ''}`}
                            onClick={() => setActiveTab('transactions')}
                        >
                            <Icons.Receipt size="1rem" />
                            {translate('atm.tab.transactions')}
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
                        ) : (
                            <TransactionsTab transactions={transactions} />
                        )}
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