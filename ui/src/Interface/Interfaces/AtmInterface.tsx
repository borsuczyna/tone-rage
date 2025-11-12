import { useState } from 'react';
import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import styles from './Styles/AtmInterface.module.css';
import type { AtmTransactionData } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/MoneyHelper';
import translate from '@shared/Translation/Translation';
import { WithdrawTab, DepositTab, LogsTab } from './Components/atm';

type AtmTab = 'withdraw' | 'deposit' | 'logs';

export default function AtmInterface() {
    const { isInterfaceVisible } = useInterfaceVisibility();
    const [activeTab, setActiveTab] = useState<AtmTab>('withdraw');
    const [currentBalance] = useState(25000); // Mock balance
    const [transactions] = useState<AtmTransactionData[]>([
        { 
            id: 1, 
            type: 'deposit', 
            amount: 5000, 
            description: translate('atm.transaction.deposit'), 
            date: new Date('2025-11-12 10:30'), 
            balanceAfter: 25000 
        },
        { 
            id: 2, 
            type: 'withdraw', 
            amount: 1500, 
            description: translate('atm.transaction.withdraw'), 
            date: new Date('2025-11-11 15:45'), 
            balanceAfter: 20000 
        },
        { 
            id: 3, 
            type: 'deposit', 
            amount: 3000, 
            description: translate('atm.transaction.deposit'), 
            date: new Date('2025-11-10 09:15'), 
            balanceAfter: 21500 
        },
        { 
            id: 4, 
            type: 'withdraw', 
            amount: 800, 
            description: translate('atm.transaction.withdraw'), 
            date: new Date('2025-11-09 14:20'), 
            balanceAfter: 18500 
        },
        { 
            id: 5, 
            type: 'withdraw', 
            amount: 200, 
            description: translate('atm.transaction.withdraw'), 
            date: new Date('2025-11-08 11:10'), 
            balanceAfter: 19300 
        },
    ]);

    const handleTransaction = (amount: number) => {
        console.log(`${activeTab} amount: $${amount}`);
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
                    <WithdrawTab onTransaction={handleTransaction} />
                ) : (
                    <DepositTab onTransaction={handleTransaction} />
                )}
            </div>
        </div>
    );
}