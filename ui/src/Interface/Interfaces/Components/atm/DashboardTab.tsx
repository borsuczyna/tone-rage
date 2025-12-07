import * as Icons from 'lucide-react';
import type { AtmTransactionData } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/MoneyHelper';
import translate from '@shared/Translation/Translation';
import Button from '../Button';
import styles from '../../Styles/AtmInterface.module.css';
import { generateCardNumber } from 'src/Utils/CardNumberGenerator';

interface DashboardTabProps {
    bankBalance: number;
    recentTransactions: AtmTransactionData[];
    userId: number;
    onDepositClick: () => void;
    onWithdrawClick: () => void;
    onTransferClick: () => void;
}

export default function DashboardTab({
    bankBalance,
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

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboardLeft}>
                {/* Balance Card */}
                <div className={styles.balanceCard}>
                    <div className={styles.balanceCardHeader}>
                        <Icons.CreditCard size="1.5rem" />
                        <span>{translate('atm.dashboard.bankBalance')}</span>
                    </div>
                    <div className={styles.balanceAmount}>
                        {formatMoney(bankBalance)}
                    </div>
                </div>

                {/* Actions Card */}
                <div className={styles.actionsCard}>
                    <Button 
                        variant="primary" 
                        size="small" 
                        onClick={onDepositClick}
                        style={{ width: '100%' }}
                    >
                        <Icons.ArrowDownToLine size="1rem" />
                        {translate('atm.action.deposit')}
                    </Button>
                    <Button 
                        variant="secondary" 
                        size="small" 
                        onClick={onWithdrawClick}
                        style={{ width: '100%' }}
                    >
                        <Icons.ArrowUpFromLine size="1rem" />
                        {translate('atm.action.withdraw')}
                    </Button>
                    <Button 
                        variant="glass" 
                        size="small" 
                        onClick={onTransferClick}
                        style={{ width: '100%' }}
                    >
                        <Icons.ArrowLeftRight size="1rem" />
                        {translate('atm.action.transfer')}
                    </Button>
                </div>

                {/* Recent Transactions */}
                <div className={styles.recentTransactions}>
                    <h3>{translate('atm.dashboard.recentTransactions')}</h3>
                    <div className={styles.transactionsList}>
                        {last5Transactions.length === 0 ? (
                            <div className={styles.noTransactions}>
                                {translate('atm.dashboard.noTransactions')}
                            </div>
                        ) : (
                            last5Transactions.map((transaction) => (
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
                                        {formatMoney(transaction.balanceAfter)}
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
                        <Icons.CreditCard size="1.2rem" />
                        <span>{translate('atm.card.title')}</span>
                    </div>
                    <div className={styles.cardInfoBody}>
                        <div className={styles.cardInfoRow}>
                            <span className={styles.cardInfoLabel}>{translate('atm.card.number')}</span>
                            <span className={styles.cardInfoValue}>{cardNumber}</span>
                        </div>
                        <div className={styles.cardInfoRow}>
                            <span className={styles.cardInfoLabel}>{translate('atm.card.pin')}</span>
                            <span className={styles.cardInfoValue}>••••</span>
                        </div>
                        <div className={styles.cardInfoRow}>
                            <span className={styles.cardInfoLabel}>{translate('atm.card.status')}</span>
                            <span className={`${styles.cardInfoValue} ${styles.cardStatusActive}`}>
                                {translate('atm.card.active')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
