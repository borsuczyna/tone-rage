import * as Icons from 'lucide-react';
import { MoneyLogType } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/MoneyHelper';
import translate from '@shared/Translation/Translation';
import styles from '../../Styles/AtmInterface.module.css';
export default function RecentTransactions({ transactions, onViewAllClick }) {
    const formatDate = (date) => {
        let formattedDate = date.toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const splitted = formattedDate.split(',');
        if (splitted.length > 1) {
            formattedDate = splitted[0] + ', ' + splitted[1] + ' ·' + splitted.slice(2).join(',');
        }
        return formattedDate;
    };
    const last5Transactions = transactions.slice(0, 5);
    return (<div className={styles.recentTransactions}>
            <div className={styles.recentTransactionsHeader}>
                <h2 className={styles.sectionTitle}>{translate('atm.dashboard.recentTransactions')}</h2>
                <button className={styles.transactionAction} onClick={onViewAllClick}>{translate('atm.action.viewAll')}</button>
            </div>
            <div className={styles.transactionsList}>
                {last5Transactions.length === 0 ? (<div className={styles.noTransactions}>
                        {translate('atm.dashboard.noTransactions')}
                    </div>) : (last5Transactions.map((transaction) => (<div key={transaction.uid} className={styles.transactionItem}>
                            <div className={styles.transactionIcon}>
                                {transaction.type == MoneyLogType.Transfer ?
                <Icons.ArrowRightLeft size="1.2rem" className={styles.transferIcon}/> :
                transaction.amount > 0 ? (<Icons.ArrowDown size="1.2rem" className={styles.depositIcon}/>) : (<Icons.ArrowUp size="1.2rem" className={styles.withdrawIcon}/>)}
                            </div>
                            <div className={styles.transactionDetails}>
                                <div className={styles.transactionTitle}>
                                    {transaction.description}
                                </div>
                                <div className={styles.transactionDate}>
                                    {formatDate(new Date(transaction.createdAt))}
                                </div>
                            </div>
                            <div className={styles.transactionAmount}>
                                <span style={{ color: transaction.amount > 0 ? '#10b981' : '#ef4444' }}>
                                    {transaction.amount > 0 ? '+' : ''} {formatMoney(transaction.amount)}
                                </span>
                            </div>
                        </div>)))}
            </div>
        </div>);
}
