import type { AtmTransactionData } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/MoneyHelper';
import translate from '@shared/Translation/Translation';
import styles from '../../Styles/AtmInterface.module.css';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface TransactionsTabProps {
    transactions: AtmTransactionData[];
}

export default function TransactionsTab({ transactions }: TransactionsTabProps) {
    const formatDate = (date: Date) => {
        return date.toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate income vs expenses in a single pass
    const { income, expenses } = transactions.reduce(
        (acc, t) => {
            if (t.type === 'deposit') {
                acc.income += t.amount;
            } else if (t.type === 'withdraw') {
                acc.expenses += t.amount;
            }
            return acc;
        },
        { income: 0, expenses: 0 }
    );

    const totalEarned = income - expenses;

    // Chart configuration for Wasabi design
    const chartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            background: 'transparent',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        },
        colors: ['#10b981', '#3b82f6', '#ef4444'],
        labels: ['Category 1', 'Category 2', 'Category 3'],
        legend: {
            show: false
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: transactions.length.toString(),
                            color: '#ffffff',
                            fontSize: '2rem',
                            fontWeight: 700,
                            formatter: () => translate('atm.transactions.label')
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 0
        },
        tooltip: {
            enabled: false
        }
    };

    const chartSeries = [income, expenses / 2, expenses / 2];

    return (
        <div className={styles.transactionsContainer}>
            <div className={styles.transactionsLeft}>
                {/* Search and Filter */}
                <div className={styles.transactionsSearch}>
                    <input 
                        type="text" 
                        placeholder={translate('atm.transactions.search')}
                        className={styles.searchInput}
                    />
                    <select className={styles.filterDropdown}>
                        <option>{translate('atm.transactions.personal')}</option>
                    </select>
                </div>

                {/* Transactions Table */}
                <div className={styles.transactionsMain}>
                    <div className={styles.transactionsTable}>
                        <div className={styles.transactionsTableHeader}>
                            <div>{translate('atm.transactions.action')}</div>
                            <div>{translate('atm.transactions.date')}</div>
                            <div>{translate('atm.transactions.amount')}</div>
                        </div>
                        {transactions.length === 0 ? (
                            <div className={styles.noTransactions}>
                                {translate('atm.dashboard.noTransactions')}
                            </div>
                        ) : (
                            transactions.map((transaction) => (
                                <div key={transaction.id} className={styles.transactionsTableRow}>
                                    <div>
                                        {transaction.description || (transaction.type === 'deposit' ? 'Bank Account Deposit' : 'Bank Account Withdraw')}
                                    </div>
                                    <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                        {formatDate(transaction.date)}
                                    </div>
                                    <div style={{ color: transaction.type === 'deposit' ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                        {transaction.type === 'deposit' ? '+' : '-'} {formatMoney(transaction.amount)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Chart and Stats */}
            <div className={styles.transactionsRight}>
                <div className={styles.transactionsRightCard}>
                    <h3>{translate('atm.transactions.bankTransactions')}</h3>
                    <p>{translate('atm.transactions.checkAccount')}</p>
                    
                    {income === 0 && expenses === 0 ? (
                        <div className={styles.noChartData}>
                            {translate('atm.chart.noData')}
                        </div>
                    ) : (
                        <>
                            <div className={styles.chartContainer}>
                                <Chart
                                    options={chartOptions}
                                    series={chartSeries}
                                    type="donut"
                                    height={250}
                                />
                            </div>
                            
                            <div className={styles.chartStats}>
                                <div className={styles.chartStat}>
                                    <div className={styles.chartStatLabel}>
                                        <div className={styles.chartStatIndicator} style={{ background: '#10b981' }} />
                                        {translate('atm.chart.moneyReceived')}
                                    </div>
                                    <div className={styles.chartStatValue}>+ {formatMoney(income)}</div>
                                </div>
                                <div className={styles.chartStat}>
                                    <div className={styles.chartStatLabel}>
                                        <div className={styles.chartStatIndicator} style={{ background: '#ef4444' }} />
                                        {translate('atm.chart.moneySent')}
                                    </div>
                                    <div className={styles.chartStatValue}>- {formatMoney(expenses)}</div>
                                </div>
                                <div className={styles.chartStat}>
                                    <div className={styles.chartStatLabel}>
                                        <div className={styles.chartStatIndicator} style={{ background: '#10b981' }} />
                                        {translate('atm.chart.totalEarned')}
                                    </div>
                                    <div className={styles.chartStatValue} style={{ color: totalEarned >= 0 ? '#10b981' : '#ef4444' }}>
                                        {totalEarned >= 0 ? '+' : ''} {formatMoney(totalEarned)}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
