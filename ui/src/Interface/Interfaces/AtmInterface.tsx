import { useState, useEffect } from 'react';
import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import styles from './Styles/AtmInterface.module.css';
import type { AtmTransactionData } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/MoneyHelper';
import translate from '@shared/Translation/Translation';
import { WithdrawTab, DepositTab, LogsTab } from './Components/atm';
import { fetchServerData } from 'src/Hooks/Fetch';

type AtmTab = 'withdraw' | 'deposit' | 'logs';

interface AtmData {
    bankMoney: number;
    transactions: AtmTransactionData[];
}

export default function AtmInterface() {
    const { isInterfaceVisible } = useInterfaceVisibility();
    const [activeTab, setActiveTab] = useState<AtmTab>('withdraw');
    const [currentBalance, setCurrentBalance] = useState(0);
    const [transactions, setTransactions] = useState<AtmTransactionData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAtmData = async () => {
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
    };

    useEffect(() => {
        if (isInterfaceVisible('AtmInterface')) {
            fetchAtmData();
        }
    }, [isInterfaceVisible('AtmInterface')]);

    const handleTransaction = async (amount: number) => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            const endpoint = activeTab === 'withdraw' ? 'atm:withdraw' : 'atm:deposit';
            const response = await fetchServerData<{ success: boolean; bankMoney?: number; transactions?: AtmTransactionData[] }>(
                endpoint,
                { amount }
            );

            if (response.success && response.bankMoney !== undefined && response.transactions) {
                setCurrentBalance(response.bankMoney);
                setTransactions(response.transactions);
            }
        } catch (error) {
            console.error(`Failed to ${activeTab}:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isInterfaceVisible('AtmInterface')) return null;

    return (
        <div className={styles.container}>
            <div className={`${styles.atmMachine} ${activeTab === 'logs' ? styles.logsLayout : ''}`}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.bankName}>
                        <span>{translate('atm.title')}</span>
                    </div>
                    <div className={styles.balance}>
                        <span>{translate('atm.balance')}: {formatMoney(currentBalance)}</span>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className={styles.tabNavigation}>
                    <button 
                        className={`${styles.tab} ${activeTab === 'withdraw' ? styles.active : ''}`}
                        onClick={() => setActiveTab('withdraw')}
                    >
                        {translate('atm.tab.withdraw')}
                    </button>
                    <button 
                        className={`${styles.tab} ${activeTab === 'deposit' ? styles.active : ''}`}
                        onClick={() => setActiveTab('deposit')}
                    >
                        {translate('atm.tab.deposit')}
                    </button>
                    <button 
                        className={`${styles.tab} ${activeTab === 'logs' ? styles.active : ''}`}
                        onClick={() => setActiveTab('logs')}
                    >
                        {translate('atm.tab.logs')}
                    </button>
                </div>

                {/* Main Content */}
                {activeTab === 'logs' ? (
                    <LogsTab transactions={transactions} />
                ) : activeTab === 'withdraw' ? (
                    <WithdrawTab onTransaction={handleTransaction} disabled={isLoading} />
                ) : (
                    <DepositTab onTransaction={handleTransaction} disabled={isLoading} />
                )}
            </div>
        </div>
    );
}