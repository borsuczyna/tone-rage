import type { MoneyLogEntityInterface } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/MoneyHelper';
import translate from '@shared/Translation/Translation';
import styles from '../../Styles/AtmInterface.module.css';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useEffect, useState } from 'react';
import { getRemAsPx } from 'src/Interface/Main';

interface TransactionsTabProps {
    transactions: MoneyLogEntityInterface[];
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
            if (t.amount > 0) {
                acc.income += t.amount;
            } else {
                acc.expenses += Math.abs(t.amount);
            }
            return acc;
        },
        { income: 0, expenses: 0 }
    );

    const [chartSize, setChartSize] = useState(getRemAsPx(12));
    const [chartFontSize, setChartFontSize] = useState(getRemAsPx(1));
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTransactions = transactions.filter((t) =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleResize = () => {
            setChartSize(getRemAsPx(12));
            setChartFontSize(getRemAsPx(1));
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const totalEarned = income - expenses;

    // Chart configuration for Wasabi design
    const chartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            background: 'transparent',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
            redrawOnParentResize: true,
            redrawOnWindowResize: true,
        },
        colors: ['#10b981', '#ef4444'],
        labels: [translate('atm.chart.income'), translate('atm.chart.expenses')],
        legend: {
            show: false
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: translate('atm.transactions.label'),
                            color: '#ccc',
                            fontSize: `${chartFontSize}px`,
                            fontWeight: 400,
                            formatter: () => `${formatMoney(income + expenses)}`,
                        },
                        value: {
                            color: '#fff',
                            fontSize: `${chartFontSize}px`,
                            fontWeight: 600,
                            formatter: (val) => `${formatMoney(val as number)}`
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

    const chartSeries = [income, expenses];

    return (
        <div className={styles.transactionsContainer}>
            <div className={styles.transactionsLeft}>
                {/* Search and Filter */}
                <div className={styles.transactionsSearch}>
                    <input 
                        type="text" 
                        placeholder={translate('atm.transactions.search')}
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Transactions Table */}
                <div className={styles.transactionsMain}>
                    {filteredTransactions.length === 0 ? (
                        <div className={styles.noTransactions}>
                            {translate('atm.dashboard.noTransactions')}
                        </div>
                    ) : (
                        <table className={styles.transactionsTable}>
                            <thead>
                                <tr className={styles.transactionsTableHeader}>
                                    <th>{translate('atm.transactions.action')}</th>
                                    <th>{translate('atm.transactions.date')}</th>
                                    <th>{translate('atm.transactions.amount')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((transaction) => (
                                    <tr key={transaction.uid} className={styles.transactionsTableRow}>
                                        <td className={styles.transactionDescription}>
                                            {transaction.description}
                                        </td>
                                        <td className={styles.transactionDate}>
                                            {formatDate(new Date(transaction.createdAt))}
                                        </td>
                                        <td className={styles.transactionAmount} style={{ color: transaction.amount > 0 ? '#10b981' : '#ef4444' }}>
                                            {transaction.amount > 0 ? '+' : ''}{formatMoney(transaction.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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
                                    key={chartSize}
                                    options={chartOptions}
                                    series={chartSeries}
                                    type="donut"
                                    height={chartSize}
                                    width={chartSize}
                                />
                            </div>
                            
                            <div className={styles.chartStats}>
                                <div className={styles.chartStat}>
                                    <div className={styles.chartStatLabel}>
                                        <div className={styles.chartStatIndicator} style={{ background: '#10b981' }} />
                                        {translate('atm.chart.moneyEarned')}
                                    </div>
                                    <div className={styles.chartStatValue}>{formatMoney(income)}</div>
                                </div>
                                <div className={styles.chartStat}>
                                    <div className={styles.chartStatLabel}>
                                        <div className={styles.chartStatIndicator} style={{ background: '#ef4444' }} />
                                        {translate('atm.chart.moneySpent')}
                                    </div>
                                    <div className={styles.chartStatValue}>{formatMoney(expenses)}</div>
                                </div>
                                <div className={styles.chartStat}>
                                    <div className={styles.chartStatLabel}>
                                        <div className={styles.chartStatIndicator} style={{ background: '#10b981' }} />
                                        {translate('atm.chart.totalEarned')}
                                    </div>
                                    <div className={styles.chartStatValue} style={{ color: totalEarned >= 0 ? '#10b981' : '#ef4444' }}>
                                        {totalEarned >= 0 ? '+ ' : ''} {formatMoney(totalEarned)}
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
