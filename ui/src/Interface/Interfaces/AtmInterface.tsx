import { useState } from 'react';
import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import styles from './Styles/AtmInterface.module.css';
import * as Icons from 'lucide-react';
import Button from './Components/Button';
import type { AtmTransactionData } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/Services/MoneyService';
import translate from '@shared/Translation/Translation';

type AtmTab = 'withdraw' | 'deposit' | 'logs';

export default function AtmInterface() {
    const { isInterfaceVisible } = useInterfaceVisibility();
    const [activeTab, setActiveTab] = useState<AtmTab>('withdraw');
    const [displayAmount, setDisplayAmount] = useState('');
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Prevent the default behavior since we handle everything manually
        e.preventDefault();
    };

    const handleNumberClick = (num: string) => {
        if (displayAmount.length < 10) {
            setDisplayAmount(prev => prev + num);
        }
    };

    const handleClear = () => {
        setDisplayAmount('');
    };

    const handleBackspace = () => {
        setDisplayAmount(prev => prev.slice(0, -1));
    };

    const handleConfirm = () => {
        const amount = parseInt(displayAmount);
        if (amount > 0) {
            // Here you would trigger the actual transaction
            console.log(`${activeTab} amount: $${amount}`);
            setDisplayAmount('');
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
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

                {/* Main Display Area */}
                <div className={styles.displayArea}>
                    {activeTab === 'logs' ? (
                        <div className={styles.transactionLogs}>
                            <div className={styles.logsHeader}>
                                <h3>{translate('atm.logs.title')}</h3>
                            </div>
                            <div className={styles.logsList}>
                                {transactions.map((transaction) => (
                                    <div key={transaction.id} className={styles.transactionItem}>
                                        <div className={styles.transactionIcon}>
                                            {transaction.type === 'deposit' ? (
                                                <Icons.ArrowDown size="1rem" className={styles.depositIcon} />
                                            ) : (
                                                <Icons.ArrowUp size="1rem" className={styles.withdrawIcon} />
                                            )}
                                        </div>
                                        <div className={styles.transactionDetails}>
                                            <div className={styles.transactionAmount}>
                                                {transaction.type === 'deposit' ? '+' : '-'}
                                                {formatMoney(transaction.amount)}
                                            </div>
                                            <div className={styles.transactionDate}>
                                                {formatDate(transaction.date)}
                                            </div>
                                        </div>
                                        <div className={styles.transactionBalance}>
                                            {translate('atm.logs.balance')}: {formatMoney(transaction.balanceAfter)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.amountInput}>
                            <div className={styles.inputLabel}>
                                {translate(activeTab === 'withdraw' ? 'atm.amount.withdraw' : 'atm.amount.deposit')}
                            </div>
                            <input
                                type="text"
                                className={styles.amountField}
                                value={displayAmount ? formatMoney(parseInt(displayAmount)) : formatMoney(0)}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Backspace') {
                                        e.preventDefault();
                                        handleBackspace();
                                    } else if (e.key === 'Delete' || e.key === 'Escape') {
                                        e.preventDefault();
                                        handleClear();
                                    } else if (/^[0-9]$/.test(e.key)) {
                                        e.preventDefault();
                                        handleNumberClick(e.key);
                                    } else {
                                        // Prevent all other characters
                                        e.preventDefault();
                                    }
                                }}
                                placeholder={formatMoney(0)}
                            />
                        </div>
                    )}
                </div>

                {/* Keypad - Hidden on logs tab */}
                {activeTab !== 'logs' && (
                    <div className={styles.keypad}>
                        <div className={styles.keypadGrid}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <button
                                    key={num}
                                    className={styles.keypadButton}
                                    onClick={() => handleNumberClick(num.toString())}
                                >
                                    {num}
                                </button>
                            ))}
                            <button
                                className={`${styles.keypadButton} ${styles.clearButton}`}
                                onClick={handleClear}
                            >
                                <Icons.RotateCcw size="1.2rem" />
                            </button>
                            <button
                                className={styles.keypadButton}
                                onClick={() => handleNumberClick('0')}
                            >
                                0
                            </button>
                            <button
                                className={`${styles.keypadButton} ${styles.backspaceButton}`}
                                onClick={handleBackspace}
                            >
                                <Icons.Delete size="1.2rem" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Action Bar - Hidden on logs tab */}
                {activeTab !== 'logs' && (
                    <div className={styles.actionBar}>
                        <Button variant="gray" onClick={handleClear}>
                            <Icons.X size="1rem" />
                            {translate('atm.button.cancel')}
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleConfirm}
                            disabled={!displayAmount}
                        >
                            <Icons.Check size="1rem" />
                            {translate(activeTab === 'withdraw' ? 'atm.button.withdraw' : activeTab === 'deposit' ? 'atm.button.deposit' : 'atm.button.confirm')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}