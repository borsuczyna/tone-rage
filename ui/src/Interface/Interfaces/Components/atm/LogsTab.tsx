import * as Icons from 'lucide-react';
import type { AtmTransactionData } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/MoneyHelper';
import translate from '@shared/Translation/Translation';
import styles from '../../Styles/AtmInterface.module.css';

interface LogsTabProps {
    transactions: AtmTransactionData[];
}

export default function LogsTab({ transactions }: LogsTabProps) {
    const formatDate = (date: Date) => {
        return date.toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    console.log(transactions);

    return (
        <div className={styles.displayArea}>
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
        </div>
    );
}