import * as Icons from 'lucide-react';
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
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate income vs expenses
    const income = transactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
        .filter(t => t.type === 'withdraw')
        .reduce((sum, t) => sum + t.amount, 0);

    // Chart configuration
    const chartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            background: 'transparent',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        },
        colors: ['#22c55e', '#ef4444'],
        labels: [translate('atm.chart.income'), translate('atm.chart.expenses')],
        legend: {
            position: 'bottom',
            labels: {
                colors: ['#ffffff', '#ffffff']
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: translate('atm.chart.total'),
                            color: '#ffffff',
                            formatter: () => formatMoney(income + expenses)
                        },
                        value: {
                            color: '#ffffff',
                            formatter: (val) => formatMoney(Number(val))
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: (val) => formatMoney(val)
            }
        }
    };

    const chartSeries = [income, expenses];

    return (
        <div className={styles.transactionsContainer}>
            <div className={styles.transactionsLeft}>
                <div className={styles.transactionsHeader}>
                    <h3>{translate('atm.transactions.title')}</h3>
                    <span className={styles.transactionsCount}>
                        {transactions.length} {translate('atm.transactions.total')}
                    </span>
                </div>
                <div className={styles.transactionsListScroll}>
                    {transactions.length === 0 ? (
                        <div className={styles.noTransactions}>
                            {translate('atm.dashboard.noTransactions')}
                        </div>
                    ) : (
                        transactions.map((transaction) => (
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
                        ))
                    )}
                </div>
            </div>

            {/* Chart */}
            <div className={styles.transactionsRight}>
                <div className={styles.chartContainer}>
                    <h3>{translate('atm.chart.title')}</h3>
                    {income === 0 && expenses === 0 ? (
                        <div className={styles.noChartData}>
                            {translate('atm.chart.noData')}
                        </div>
                    ) : (
                        <Chart
                            options={chartOptions}
                            series={chartSeries}
                            type="donut"
                            height={280}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
