import * as Icons from 'lucide-react';
import type { MoneyLogEntityInterface } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/MoneyHelper';
import translate from '@shared/Translation/Translation';
import styles from '../../Styles/AtmInterface.module.css';
import { generateCardNumber } from 'src/Utils/CardNumberGenerator';

interface DashboardTabProps {
    bankBalance: number;
    recentTransactions: MoneyLogEntityInterface[];
    userId: number;
    accountName: string;
    onDepositClick: () => void;
    onWithdrawClick: () => void;
    onTransferClick: () => void;
    setActiveTab: (tab: 'dashboard' | 'transactions' | 'accounts' | 'society' | 'savings' | 'loans') => void;
}

export default function DashboardTab({
    bankBalance,
    recentTransactions,
    userId,
    accountName,
    onDepositClick,
    onWithdrawClick,
    onTransferClick,
    setActiveTab
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

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboardLeft}>
                <div className={styles.firstHeader}>
                    {/* Balance Card */}
                    <div className={styles.balanceCard}>
                        <div className={styles.balanceCardHeader}>
                            {translate('atm.dashboard.mainAccount')}
                        </div>
                        <div className={styles.balanceAmount}>
                            {formatMoney(bankBalance)}
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className={styles.actionButton} onClick={onDepositClick}>
                        <Icons.ArrowUp size="2rem" />
                        <span className={styles.actionButtonLabel}>{translate('atm.action.deposit')}</span>
                    </div>
                    <div className={styles.actionButton} onClick={onWithdrawClick}>
                        <Icons.ArrowDown size="2rem" />
                        <span className={styles.actionButtonLabel}>{translate('atm.action.withdraw')}</span>
                    </div>
                    <div className={styles.actionButton} onClick={onTransferClick}>
                        <Icons.ArrowLeftRight size="2rem" />
                        <span className={styles.actionButtonLabel}>{translate('atm.action.transfer')}</span>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className={styles.recentTransactions}>
                    <div className={styles.recentTransactionsHeader}>
                        <h3>{translate('atm.dashboard.latestTransactions')}</h3>
                        <div className={styles.transactionActions}>
                            <button className={styles.transactionAction} onClick={() => setActiveTab('transactions')}>{translate('atm.action.seeMore')}</button>
                        </div>
                    </div>
                    <div className={styles.transactionsList}>
                        {last5Transactions.length === 0 ? (
                            <div className={styles.noTransactions}>
                                {translate('atm.dashboard.noTransactions')}
                            </div>
                        ) : (
                            last5Transactions.map((transaction) => (
                                <div key={transaction.uid} className={styles.transactionItem}>
                                    <div className={styles.transactionIcon}>
                                        {transaction.amount > 0 ? (
                                            <Icons.ArrowDown size="1.2rem" className={styles.depositIcon} />
                                        ) : (
                                            <Icons.ArrowUp size="1.2rem" className={styles.withdrawIcon} />
                                        )}
                                    </div>
                                    <div className={styles.transactionDetailsSmall}>
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
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Card Info */}
            <div className={styles.dashboardRight}>
                <div className={styles.cardInfo}>
                    <div className={styles.cardInfoHeader}>
                        <div>
                            <div className={styles.cardInfoTitle}>{translate('atm.card.yourCards')}</div>
                        </div>
                    </div>
                    
                    {/* Card Visual */}
                    <div className={styles.cardVisual}>
                        <div className={styles.cardChip} />
                        <div className={styles.cardNumber}>{cardNumber}</div>
                        <div className={styles.cardBottom}>
                            <div className={styles.cardHolder}>
                                <div className={styles.cardHolderLabel}>{translate('atm.card.accountName')}</div>
                                <div className={styles.cardHolderName}>{accountName}</div>
                            </div>
                            <div className={styles.cardExpiry}>
                                <div className={styles.cardExpiryLabel}>{translate('atm.card.expireDate')}</div>
                                <div className={styles.cardExpiryDate}>06/2027</div>
                            </div>
                        </div>
                    </div>

                    {/* Card Info */}
                    <div className={styles.cardInfoBody}>
                        <div className={styles.cardInfoSection}>
                            <div className={styles.cardInfoRow}>
                                <span className={styles.cardInfoLabel}>{translate('atm.card.pin')}</span>
                                <span className={styles.cardInfoValue}>••••</span>
                            </div>
                        </div>
                        <div className={styles.cardInfoSection}>
                            <div className={styles.cardInfoRow}>
                                <span className={styles.cardInfoLabel}>{translate('atm.card.status')}</span>
                                <span className={`${styles.cardInfoValue} ${styles.cardStatusActive}`}>
                                    {translate('atm.card.active')}
                                </span>
                            </div>
                        </div>
                        <div className={styles.cardInfoSection}>
                            <div className={styles.cardInfoRow}>
                                <span className={styles.cardInfoLabel}>{translate('atm.card.dailyLimit')}</span>
                                <span className={styles.cardInfoValue}>-</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
