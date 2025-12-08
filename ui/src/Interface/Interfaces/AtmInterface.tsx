import { useState, useEffect, useCallback } from 'react';
import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import { useUserInfo } from 'src/Hooks/UserInfoProvider';
import styles from './Styles/AtmInterface.module.css';
import type { MoneyLogEntityInterface } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/MoneyHelper';
import translate from '@shared/Translation/Translation';
import { DashboardTab, TransactionsTab, DepositModal, WithdrawModal, TransferModal } from './Components/atm';
import { fetchServerData, triggerEvent } from 'src/Hooks/Fetch';
import * as Icons from 'lucide-react';

interface AtmData {
    bankMoney: number;
    walletMoney: number;
    userId: number;
    logs: MoneyLogEntityInterface[];
}

interface AtmDataResponse extends AtmData {
    success: boolean;
}

type SidebarTab = 'dashboard' | 'transactions' | 'accounts' | 'society' | 'savings' | 'loans';

export default function AtmInterface() {
    const { isInterfaceVisible } = useInterfaceVisibility();
    const { userInfo } = useUserInfo();
    const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
    const [bankBalance, setBankBalance] = useState(0);
    const [walletMoney, setWalletMoney] = useState(0);
    const [userId, setUserId] = useState(0);
    const [transactions, setTransactions] = useState<MoneyLogEntityInterface[]>([]);
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
            setTransactions(data.logs);
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
            const response = await fetchServerData<AtmDataResponse>(
                'atm:deposit',
                { amount }
            );

            if (response.success && response.bankMoney !== undefined && response.walletMoney !== undefined && response.logs) {
                setBankBalance(response.bankMoney);
                setWalletMoney(response.walletMoney);
                setTransactions(response.logs);
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
            const response = await fetchServerData<AtmDataResponse>(
                'atm:withdraw',
                { amount }
            );

            if (response.success && response.bankMoney !== undefined && response.walletMoney !== undefined && response.logs) {
                setBankBalance(response.bankMoney);
                setWalletMoney(response.walletMoney);
                setTransactions(response.logs);
            }
        } catch (error) {
            console.error('Failed to withdraw:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTransfer = async (targetUser: string, amount: number) => {
        if (isLoading) return false;

        try {
            setIsLoading(true);
            const response = await fetchServerData<AtmDataResponse>(
                'atm:transfer',
                { targetUser, amount }
            );

            if (response.success && response.bankMoney !== undefined && response.walletMoney !== undefined && response.logs) {
                setBankBalance(response.bankMoney);
                setWalletMoney(response.walletMoney);
                setTransactions(response.logs);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Failed to transfer:', error);
        } finally {
            setIsLoading(false);
        }

        return false;
    };

    if (!isInterfaceVisible('AtmInterface')) return null;

    return (
        <>
            <div className={styles.container}>
                <div className={styles.atmMachine}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerBranding}>
                            <span className={styles.brandName}>Tone</span>
                            <span className={styles.brandSuffix}>Banking</span>
                        </div>
                        <div className={styles.headerRight}>
                            <div className={styles.walletBadge}>
                                <span className={styles.walletLabel}>{translate('atm.header.wallet')}</span>
                                <span className={styles.walletAmount}>{formatMoney(walletMoney)}</span>
                            </div>

                            <div className={styles.closeButton} onClick={() => {triggerEvent('atm:closeInterface');}}>
                                <Icons.X size="1.5rem" />
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
                        </div>

                        {/* Main Content */}
                        <div className={styles.content}>
                            {activeTab === 'dashboard' ? (
                                <DashboardTab 
                                    bankBalance={bankBalance}
                                    recentTransactions={transactions}
                                    userId={userId}
                                    accountName={userInfo.username}
                                    onDepositClick={() => setIsDepositModalOpen(true)}
                                    onWithdrawClick={() => setIsWithdrawModalOpen(true)}
                                    onTransferClick={() => setIsTransferModalOpen(true)}
                                    setActiveTab={setActiveTab}
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