import * as Icons from 'lucide-react';
import type { AtmTransactionData } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/MoneyHelper';
import translate from '@shared/Translation/Translation';
import Button from '../Button';
import styles from '../../Styles/AtmInterface.module.css';
import { generateCardNumber } from 'src/Utils/CardNumberGenerator';

interface DashboardTabProps {
    bankBalance: number;
    walletMoney: number;
    recentTransactions: AtmTransactionData[];
    userId: number;
    onDepositClick: () => void;
    onWithdrawClick: () => void;
    onTransferClick: () => void;
}

export default function DashboardTab({
    bankBalance,
    walletMoney,
    recentTransactions,
    userId,
    onDepositClick,
    onWithdrawClick,
    onTransferClick
}: DashboardTabProps) {
    const formatDate = (date: Date) => {
        return date.toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const cardNumber = generateCardNumber(userId);
    const last5Transactions = recentTransactions.slice(0, 5);

    // Calculate money statistics
    const totalReceived = recentTransactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalSent = recentTransactions
        .filter(t => t.type === 'withdraw')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalEarned = totalReceived - totalSent;

    return (
        <div className={styles.dashboard}>
            {/* Main Account Section */}
            <div className={styles.accountSection}>
                <div className={styles.accountHeader}>
                    <h2 className={styles.accountTitle}>Main Account</h2>
                    <div className={styles.chartIcon}>
                        <Icons.BarChart3 size="1rem" />
                    </div>
                </div>
                <div className={styles.accountBalance}>
                    {formatMoney(bankBalance)}
                </div>
                <div className={styles.accountActions}>
                    <button className={styles.actionButton} onClick={onDepositClick}>
                        <Icons.ArrowDown size="1rem" />
                        <span>Deposit</span>
                    </button>
                    <button className={styles.actionButton} onClick={onWithdrawClick}>
                        <Icons.ArrowUp size="1rem" />
                        <span>Withdraw</span>
                    </button>
                    <button className={styles.actionButton} onClick={onTransferClick}>
                        <Icons.ArrowLeftRight size="1rem" />
                        <span>Transfer</span>
                    </button>
                </div>
            </div>

            {/* Right Side Panel */}
            <div className={styles.sidePanel}>
                {/* Card Management */}
                <div className={styles.cardManagement}>
                    <div className={styles.cardHeader}>
                        <Icons.CreditCard size="1rem" />
                        <span>Manage Your Cards</span>
                    </div>
                    <p className={styles.cardSubtext}>Create, Edit or Delete your cards</p>
                    
                    <div className={styles.cardDisplay}>
                        <div className={styles.cardChip}>
                            <Icons.Wifi size="1.2rem" />
                        </div>
                        <div className={styles.cardNumber}>{cardNumber}</div>
                        <div className={styles.cardInfo}>
                            <div className={styles.cardName}>
                                <span className={styles.cardLabel}>Account Name</span>
                                <span className={styles.cardValue}>{userId}</span>
                            </div>
                            <div className={styles.cardExpiry}>
                                <span className={styles.cardLabel}>Expire Date</span>
                                <span className={styles.cardValue}>06/2025</span>
                            </div>
                        </div>
                        <div className={styles.cardActions}>
                            <button className={styles.cardActionBtn}>
                                <Icons.Settings size="0.9rem" />
                            </button>
                            <button className={styles.cardActionBtn}>
                                <Icons.Pencil size="0.9rem" />
                            </button>
                            <button className={styles.cardActionBtn}>
                                <Icons.Minus size="0.9rem" />
                            </button>
                            <button className={styles.cardActionBtn}>
                                <Icons.Plus size="0.9rem" />
                            </button>
                        </div>
                    </div>

                    <div className={styles.cardInfoSection}>
                        <h4 className={styles.cardInfoTitle}>Card Information</h4>
                        <div className={styles.cardInfoDetails}>
                            <div className={styles.cardInfoItem}>
                                <span className={styles.cardInfoLabel}>Card PIN</span>
                                <span className={styles.cardInfoValue}>••••</span>
                            </div>
                            <div className={styles.cardInfoItem}>
                                <span className={styles.cardInfoLabel}>Card Status</span>
                                <span className={styles.cardStatusActive}>Active</span>
                            </div>
                            <div className={styles.cardInfoItem}>
                                <span className={styles.cardInfoLabel}>Daily Limit</span>
                                <span className={styles.cardInfoValue}>-</span>
                            </div>
                        </div>
                        <div className={styles.accountNumber}>
                            <div className={styles.accountNumberHeader}>
                                <Icons.User size="1rem" />
                                <span>Account Number</span>
                            </div>
                            <p className={styles.accountNumberSubtext}>Transfer Funds With Your Account</p>
                            <div className={styles.accountNumberDisplay}>
                                WSB-{userId.toString().padStart(4, '0')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Latest Transactions */}
            <div className={styles.transactionsSection}>
                <div className={styles.transactionsHeader}>
                    <h3 className={styles.transactionsTitle}>Latest Transactions</h3>
                    <div className={styles.transactionsActions}>
                        <button className={styles.transactionsLink}>Print Last Transactions</button>
                        <button className={styles.transactionsLink}>See More</button>
                    </div>
                </div>
                
                <div className={styles.transactionsList}>
                    {last5Transactions.length === 0 ? (
                        <div className={styles.noTransactions}>
                            No recent transactions
                        </div>
                    ) : (
                        last5Transactions.map((transaction) => (
                            <div key={transaction.id} className={styles.transactionRow}>
                                <div className={styles.transactionIcon}>
                                    <Icons.ArrowUpDown size="1rem" />
                                </div>
                                <div className={styles.transactionDetails}>
                                    <div className={styles.transactionAction}>
                                        Bank Account {transaction.type === 'deposit' ? 'Deposit' : 'Withdraw'}
                                    </div>
                                    <div className={styles.transactionDate}>
                                        {formatDate(transaction.date)}
                                    </div>
                                </div>
                                <div className={styles.transactionAmount}>
                                    <span className={transaction.type === 'deposit' ? styles.positive : styles.negative}>
                                        {transaction.type === 'deposit' ? '+' : '-'} {formatMoney(transaction.amount)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Bank Transactions Stats */}
            <div className={styles.transactionStats}>
                <div className={styles.statsHeader}>
                    <Icons.Building2 size="1rem" />
                    <span>Bank Transactions</span>
                </div>
                <p className={styles.statsSubtext}>Check your account transactions</p>
                
                <div className={styles.statsChart}>
                    <div className={styles.chartContainer}>
                        <div className={styles.chartNumber}>
                            {recentTransactions.length}
                        </div>
                        <div className={styles.chartLabel}>Transactions</div>
                    </div>
                    
                    {/* Simple pie chart representation */}
                    <div className={styles.pieChart}>
                        <svg viewBox="0 0 100 100" className={styles.chartSvg}>
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="none" 
                                stroke="var(--tone-cyan)" 
                                strokeWidth="8"
                                strokeDasharray="80 20"
                                transform="rotate(-90 50 50)"
                            />
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="none" 
                                stroke="var(--tone-pink)" 
                                strokeWidth="8"
                                strokeDasharray="20 80"
                                strokeDashoffset="-80"
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
