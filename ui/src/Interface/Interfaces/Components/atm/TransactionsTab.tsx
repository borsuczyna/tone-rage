import * as Icons from 'lucide-react';
import type { AtmTransactionData } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/MoneyHelper';
import styles from '../../Styles/AtmInterface.module.css';

interface TransactionsTabProps {
    transactions: AtmTransactionData[];
}

export default function TransactionsTab({ transactions }: TransactionsTabProps) {
    const formatDate = (date: Date) => {
        return date.toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate statistics
    const totalReceived = transactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalSent = transactions
        .filter(t => t.type === 'withdraw')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalEarned = totalReceived - totalSent;

    return (
        <div className={styles.transactionsPage}>
            {/* Header Section */}
            <div className={styles.pageHeader}>
                <h2 className={styles.pageTitle}>Transactions</h2>
                <div className={styles.pageActions}>
                    <div className={styles.searchContainer}>
                        <Icons.Search size="1rem" />
                        <input 
                            type="text" 
                            placeholder="Search transactions..."
                            className={styles.searchInput}
                        />
                    </div>
                    <select className={styles.filterSelect}>
                        <option value="personal">Personal</option>
                        <option value="business">Business</option>
                    </select>
                </div>
            </div>

            {/* Transaction Table */}
            <div className={styles.transactionsTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableHeaderCell}>Action</div>
                    <div className={styles.tableHeaderCell}>Date</div>
                    <div className={styles.tableHeaderCell}>Amount</div>
                </div>

                <div className={styles.tableBody}>
                    {transactions.length === 0 ? (
                        <div className={styles.noTransactions}>
                            No transactions found
                        </div>
                    ) : (
                        transactions.map((transaction) => (
                            <div key={transaction.id} className={styles.tableRow}>
                                <div className={styles.tableCell}>
                                    Bank Account {transaction.type === 'deposit' ? 'Deposit' : 'Withdraw'}
                                </div>
                                <div className={styles.tableCell}>
                                    {formatDate(transaction.date)}
                                </div>
                                <div className={styles.tableCell}>
                                    <span className={transaction.type === 'deposit' ? styles.positive : styles.negative}>
                                        {transaction.type === 'deposit' ? '+' : '-'} {formatMoney(transaction.amount)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className={styles.pagination}>
                    <button className={styles.paginationBtn}>Previous</button>
                    <span className={styles.paginationInfo}>
                        <span className={styles.activePage}>1</span>
                        <span>2</span>
                    </span>
                    <button className={styles.paginationBtn}>Next</button>
                </div>
            </div>

            {/* Statistics Panel */}
            <div className={styles.transactionStatsPage}>
                <div className={styles.statsHeader}>
                    <Icons.Building2 size="1rem" />
                    <span>Bank Transactions</span>
                </div>
                <p className={styles.statsSubtext}>Check your account transactions</p>
                
                <div className={styles.statsChart}>
                    <div className={styles.chartContainer}>
                        <div className={styles.chartNumber}>
                            {transactions.length}
                        </div>
                        <div className={styles.chartLabel}>Transactions</div>
                    </div>
                    
                    <div className={styles.pieChart}>
                        <svg viewBox="0 0 100 100" className={styles.chartSvg}>
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="none" 
                                stroke="var(--tone-cyan)" 
                                strokeWidth="8"
                                strokeDasharray="60 40"
                                transform="rotate(-90 50 50)"
                            />
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="none" 
                                stroke="#ef4444" 
                                strokeWidth="8"
                                strokeDasharray="40 60"
                                strokeDashoffset="-60"
                                transform="rotate(-90 50 50)"
                            />
                        </svg>
                    </div>
                </div>

                <div className={styles.statsBreakdown}>
                    <div className={styles.statItem}>
                        <Icons.TrendingUp size="1rem" />
                        <span className={styles.statLabel}>Money Received</span>
                        <span className={styles.statValue}>+ {formatMoney(totalReceived)}</span>
                    </div>
                    <div className={styles.statItem}>
                        <Icons.TrendingDown size="1rem" />
                        <span className={styles.statLabel}>Money Sent</span>
                        <span className={styles.statValue}>- {formatMoney(totalSent)}</span>
                    </div>
                    <div className={styles.statItem}>
                        <Icons.DollarSign size="1rem" />
                        <span className={styles.statLabel}>Total Earned</span>
                        <span className={`${styles.statValue} ${totalEarned >= 0 ? styles.positive : styles.negative}`}>
                            {formatMoney(totalEarned)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}