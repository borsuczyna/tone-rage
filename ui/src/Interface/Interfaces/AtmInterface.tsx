import { useState, useEffect, useCallback } from 'react';
import { useInterfaceVisibility, setInterfaceVisible } from 'src/Hooks/InterfaceVisibilityProvider';
import styles from './Styles/AtmInterface.module.css';
import type { AtmTransactionData } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/MoneyHelper';
import { fetchServerData } from 'src/Hooks/Fetch';
import * as Icons from 'lucide-react';
import Button from './Components/Button';
import InputField from './Components/InputField';
import Chart from 'react-apexcharts';

// Extend window to include mp
declare global {
    interface Window {
        mp?: {
            trigger: (eventName: string, ...args: any[]) => void;
        };
    }
}

type AtmTab = 'dashboard' | 'transactions';
type ModalType = 'deposit' | 'withdraw' | 'transfer' | null;

interface AtmData {
    bankMoney: number;
    walletMoney: number;
    transactions: AtmTransactionData[];
    username?: string;
    userId?: number;
}

interface ChartData {
    income: number;
    expenses: number;
    categories?: { [key: string]: number };
}

export default function AtmInterface() {
    const { isInterfaceVisible } = useInterfaceVisibility();
    const [activeTab, setActiveTab] = useState<AtmTab>('dashboard');
    const [currentBalance, setCurrentBalance] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const [transactions, setTransactions] = useState<AtmTransactionData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('John Snow');
    const [userId, setUserId] = useState(1);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [modalAmount, setModalAmount] = useState('');
    const [transferTarget, setTransferTarget] = useState('');

    // Generate card number based on user ID
    const generateCardNumber = (userId: number): string => {
        const seed = userId;
        const rng = (seed: number) => {
            let x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };
        
        let parts = [];
        for (let i = 0; i < 4; i++) {
            let part = '';
            for (let j = 0; j < 4; j++) {
                part += Math.floor(rng(seed + i * 4 + j) * 10).toString();
            }
            parts.push(part);
        }
        return parts.join(' ');
    };

    const fetchAtmData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await fetchServerData<AtmData>('atm:getData', {});
            setCurrentBalance(data.bankMoney || 0);
            setWalletBalance(data.walletMoney || 0);
            setTransactions(data.transactions || []);
            setUsername(data.username || 'John Snow');
            setUserId(data.userId || 1);
        } catch (error) {
            console.error('Failed to fetch ATM data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const visible = isInterfaceVisible('AtmInterface');
        if (visible) {
            fetchAtmData();
        }
    }, [isInterfaceVisible, fetchAtmData]);

    const handleCloseATM = () => {
        setInterfaceVisible('AtmInterface', false);
        // Trigger client event to close ATM
        if (window.mp) {
            window.mp.trigger('atm:close');
        }
    };

    const handleTransaction = async (type: 'deposit' | 'withdraw' | 'transfer', amount: number, target?: string) => {
        if (isLoading || !amount || amount <= 0) return;

        try {
            setIsLoading(true);
            let endpoint = '';
            let payload: any = { amount };

            switch (type) {
                case 'deposit':
                    endpoint = 'atm:deposit';
                    break;
                case 'withdraw':
                    endpoint = 'atm:withdraw';
                    break;
                case 'transfer':
                    endpoint = 'atm:transfer';
                    payload.target = target;
                    break;
            }

            const response = await fetchServerData<{ success: boolean; bankMoney?: number; walletMoney?: number; transactions?: AtmTransactionData[] }>(
                endpoint,
                payload
            );

            if (response.success) {
                if (response.bankMoney !== undefined) setCurrentBalance(response.bankMoney);
                if (response.walletMoney !== undefined) setWalletBalance(response.walletMoney);
                if (response.transactions) setTransactions(response.transactions);
                setActiveModal(null);
                setModalAmount('');
                setTransferTarget('');
            }
        } catch (error) {
            console.error(`Failed to ${type}:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalSubmit = () => {
        const amount = parseFloat(modalAmount);
        if (activeModal && amount > 0) {
            if (activeModal === 'transfer' && transferTarget) {
                handleTransaction(activeModal, amount, transferTarget);
            } else if (activeModal !== 'transfer') {
                handleTransaction(activeModal, amount);
            }
        }
    };

    // Calculate chart data
    const calculateChartData = (): ChartData => {
        const recentTransactions = transactions.slice(0, 50);
        let income = 0;
        let expenses = 0;

        recentTransactions.forEach(transaction => {
            if (transaction.amount > 0) {
                income += Math.abs(transaction.amount);
            } else {
                expenses += Math.abs(transaction.amount);
            }
        });

        return { income, expenses };
    };

    const chartData = calculateChartData();
    
    // Chart configuration
    const chartOptions: any = {
        chart: {
            type: 'donut',
            background: 'transparent'
        },
        colors: ['#10B981', '#EF4444'],
        labels: ['Money Received', 'Money Sent'],
        legend: {
            show: false
        },
        dataLabels: {
            enabled: false
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        name: {
                            show: false
                        },
                        value: {
                            show: true,
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#fff',
                            formatter: () => `${transactions.length}`
                        },
                        total: {
                            show: true,
                            label: 'Transactions',
                            color: '#9CA3AF',
                            fontSize: '12px'
                        }
                    }
                }
            }
        },
        stroke: {
            show: false
        },
        tooltip: {
            enabled: false
        }
    };

    const chartSeries = [chartData.income, chartData.expenses];

    if (!isInterfaceVisible('AtmInterface')) return null;

    return (
        <div className={styles.container}>
            <div className={styles.bankingInterface}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.logo}>
                            <span className={styles.logoText}>WASABI</span>
                            <span className={styles.logoSubtext}>BANKING</span>
                        </div>
                        <div className={styles.welcomeSection}>
                            <Icons.User className={styles.userIcon} size={20} />
                            <span className={styles.welcomeText}>Welcome, {username}</span>
                        </div>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.walletInfo}>
                            <span className={styles.walletLabel}>Wallet</span>
                            <span className={styles.walletAmount}>{formatMoney(walletBalance)}</span>
                        </div>
                        <button className={styles.closeButton} onClick={handleCloseATM}>
                            <Icons.X size={20} />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <div className={styles.navigation}>
                    <div className={styles.navTabs}>
                        <button 
                            className={`${styles.navTab} ${activeTab === 'dashboard' ? styles.active : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <Icons.LayoutDashboard size={16} />
                            Dashboard
                        </button>
                        <button 
                            className={`${styles.navTab} ${activeTab === 'transactions' ? styles.active : ''}`}
                            onClick={() => setActiveTab('transactions')}
                        >
                            <Icons.History size={16} />
                            Transactions
                        </button>
                    </div>
                    
                    <div className={styles.searchSection}>
                        <div className={styles.searchWrapper}>
                            <Icons.Search size={16} className={styles.searchIcon} />
                            <input 
                                type="text" 
                                placeholder="Search" 
                                className={styles.searchInput} 
                            />
                        </div>
                        <select className={styles.filterSelect}>
                            <option>Personal</option>
                        </select>
                    </div>
                </div>

                <div className={styles.content}>
                    {activeTab === 'dashboard' ? (
                        <>
                            <div className={styles.mainSection}>
                                <div className={styles.leftColumn}>
                                    {/* Account Card */}
                                    <div className={styles.card}>
                                        <div className={styles.cardHeader}>
                                            <span className={styles.cardTitle}>Main Account</span>
                                        </div>
                                        <div className={styles.accountBalance}>
                                            <span className={styles.balanceAmount}>{formatMoney(currentBalance)}</span>
                                            <Icons.TrendingUp className={styles.trendIcon} size={20} />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className={styles.card}>
                                        <div className={styles.actionGrid}>
                                            <button className={styles.actionButton} onClick={() => setActiveModal('deposit')}>
                                                <Icons.ArrowDown size={24} />
                                                <span>Deposit</span>
                                            </button>
                                            <button className={styles.actionButton} onClick={() => setActiveModal('withdraw')}>
                                                <Icons.ArrowUp size={24} />
                                                <span>Withdraw</span>
                                            </button>
                                            <button className={styles.actionButton} onClick={() => setActiveModal('transfer')}>
                                                <Icons.ArrowLeftRight size={24} />
                                                <span>Transfer</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Recent Transactions */}
                                    <div className={styles.card}>
                                        <div className={styles.cardHeader}>
                                            <span className={styles.cardTitle}>Latest Transactions</span>
                                            <div className={styles.cardActions}>
                                                <button className={styles.linkButton}>Print Last Transactions</button>
                                                <button className={styles.linkButton} onClick={() => setActiveTab('transactions')}>See More</button>
                                            </div>
                                        </div>
                                        <div className={styles.transactionsList}>
                                            {transactions.slice(0, 5).map((transaction, index) => (
                                                <div key={index} className={styles.transactionItem}>
                                                    <div className={styles.transactionIcon}>
                                                        <Icons.ArrowUpDown size={16} />
                                                    </div>
                                                    <div className={styles.transactionInfo}>
                                                        <span className={styles.transactionTitle}>{transaction.action}</span>
                                                        <span className={styles.transactionDate}>{new Date(transaction.timestamp || transaction.date || Date.now()).toLocaleString()}</span>
                                                    </div>
                                                    <span className={`${styles.transactionAmount} ${transaction.amount > 0 ? styles.positive : styles.negative}`}>
                                                        {transaction.amount > 0 ? '+' : ''}{formatMoney(transaction.amount)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.rightColumn}>
                                    {/* Bank Transactions Stats */}
                                    <div className={styles.card}>
                                        <div className={styles.cardHeader}>
                                            <span className={styles.cardTitle}>Bank Transactions</span>
                                            <span className={styles.cardSubtitle}>Check your account transactions</span>
                                        </div>
                                        <div className={styles.chartContainer}>
                                            <Chart
                                                options={chartOptions}
                                                series={chartSeries}
                                                type="donut"
                                                height={180}
                                            />
                                        </div>
                                        <div className={styles.chartStats}>
                                            <div className={styles.statItem}>
                                                <Icons.ArrowDown className={styles.statIcon} size={16} />
                                                <span className={styles.statLabel}>Money Received</span>
                                                <span className={styles.statValue}>+{formatMoney(chartData.income)}</span>
                                            </div>
                                            <div className={styles.statItem}>
                                                <Icons.ArrowUp className={styles.statIcon} size={16} />
                                                <span className={styles.statLabel}>Money Sent</span>
                                                <span className={styles.statValue}>-{formatMoney(chartData.expenses)}</span>
                                            </div>
                                            <div className={styles.statItem}>
                                                <span className={styles.statLabel}>Total Earned</span>
                                                <span className={styles.statValue}>-{formatMoney(chartData.expenses - chartData.income)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Information */}
                                    <div className={styles.card}>
                                        <div className={styles.cardHeader}>
                                            <span className={styles.cardTitle}>Manage Your Cards</span>
                                            <span className={styles.cardSubtitle}>Create, Edit or Delete your cards</span>
                                        </div>
                                        
                                        <div className={styles.bankCard}>
                                            <div className={styles.bankCardHeader}>
                                                <Icons.CreditCard size={24} />
                                                <Icons.Wifi size={20} className={styles.cardWifi} />
                                            </div>
                                            <div className={styles.cardNumber}>{generateCardNumber(userId)}</div>
                                            <div className={styles.cardFooter}>
                                                <div className={styles.cardInfo}>
                                                    <div>
                                                        <span className={styles.cardLabel}>Account Name</span>
                                                        <span className={styles.cardValue}>{username}</span>
                                                    </div>
                                                    <div>
                                                        <span className={styles.cardLabel}>Expire Date</span>
                                                        <span className={styles.cardValue}>06/2025</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.cardControls}>
                                            <button className={styles.cardControlBtn}>
                                                <Icons.Settings size={16} />
                                            </button>
                                            <button className={styles.cardControlBtn}>
                                                <Icons.Edit size={16} />
                                            </button>
                                            <button className={styles.cardControlBtn}>
                                                <Icons.Minus size={16} />
                                            </button>
                                            <button className={styles.cardControlBtn}>
                                                <Icons.Plus size={16} />
                                            </button>
                                        </div>

                                        <div className={styles.cardDetails}>
                                            <div className={styles.cardDetailRow}>
                                                <span className={styles.cardDetailLabel}>Card PIN</span>
                                                <span className={styles.cardDetailValue}>••••</span>
                                            </div>
                                            <div className={styles.cardDetailRow}>
                                                <span className={styles.cardDetailLabel}>Card Status</span>
                                                <span className={`${styles.cardDetailValue} ${styles.active}`}>Active</span>
                                            </div>
                                            <div className={styles.cardDetailRow}>
                                                <span className={styles.cardDetailLabel}>Daily Limit</span>
                                                <span className={styles.cardDetailValue}></span>
                                            </div>
                                        </div>

                                        <div className={styles.accountNumber}>
                                            <div className={styles.accountLabel}>
                                                <Icons.User className={styles.accountIcon} size={16} />
                                                <div>
                                                    <span className={styles.accountTitle}>Account Number</span>
                                                    <span className={styles.accountSubtitle}>Transfer Funds With Your Account</span>
                                                </div>
                                            </div>
                                            <div className={styles.accountValue}>WSB-{username.toUpperCase().replace(' ', '')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={styles.transactionsTab}>
                            <div className={styles.leftColumn}>
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.cardTitle}>All Transactions</span>
                                    </div>
                                    <div className={styles.fullTransactionsList}>
                                        <div className={styles.transactionsHeader}>
                                            <span>Action</span>
                                            <span>Date</span>
                                            <span>Amount</span>
                                        </div>
                                        {transactions.slice(0, 50).map((transaction, index) => (
                                            <div key={index} className={styles.fullTransactionItem}>
                                                <span className={styles.transactionAction}>{transaction.action}</span>
                                                <span className={styles.transactionDate}>
                                                    {new Date(transaction.timestamp || transaction.date || Date.now()).toLocaleDateString()} - {new Date(transaction.timestamp || transaction.date || Date.now()).toLocaleTimeString()}
                                                </span>
                                                <span className={`${styles.transactionAmount} ${transaction.amount > 0 ? styles.positive : styles.negative}`}>
                                                    {transaction.amount > 0 ? '+' : ''}{formatMoney(transaction.amount)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.pagination}>
                                        <button className={styles.paginationBtn}>Previous</button>
                                        <span className={styles.paginationCurrent}>1</span>
                                        <button className={styles.paginationBtn}>2</button>
                                        <button className={styles.paginationBtn}>Next</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={styles.rightColumn}>
                                <div className={styles.card}>
                                    <div className={styles.chartContainer}>
                                        <Chart
                                            options={chartOptions}
                                            series={chartSeries}
                                            type="donut"
                                            height={200}
                                        />
                                    </div>
                                    <div className={styles.chartStats}>
                                        <div className={styles.statItem}>
                                            <Icons.ArrowDown className={styles.statIcon} size={16} />
                                            <span className={styles.statLabel}>Money Received</span>
                                            <span className={styles.statValue}>+{formatMoney(chartData.income)}</span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <Icons.ArrowUp className={styles.statIcon} size={16} />
                                            <span className={styles.statLabel}>Money Sent</span>
                                            <span className={styles.statValue}>-{formatMoney(chartData.expenses)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modals */}
                {activeModal && (
                    <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
                        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h3 className={styles.modalTitle}>
                                    {activeModal === 'deposit' && 'Deposit Money'}
                                    {activeModal === 'withdraw' && 'Withdraw Money'}
                                    {activeModal === 'transfer' && 'Transfer Money'}
                                </h3>
                                <button className={styles.modalClose} onClick={() => setActiveModal(null)}>
                                    <Icons.X size={20} />
                                </button>
                            </div>
                            <div className={styles.modalContent}>
                                {activeModal === 'transfer' && (
                                    <InputField
                                        icon={<Icons.User size={16} />}
                                        label="Target Account"
                                        type="text"
                                        placeholder="Enter account number or username"
                                        value={transferTarget}
                                        onChange={setTransferTarget}
                                        groupStyle={{ marginBottom: '1rem' }}
                                    />
                                )}
                                <InputField
                                    icon={<Icons.DollarSign size={16} />}
                                    label="Amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={modalAmount}
                                    onChange={setModalAmount}
                                    groupStyle={{ marginBottom: '1.5rem' }}
                                />
                                <div className={styles.modalActions}>
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setActiveModal(null)}
                                        style={{ flex: 1 }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        onClick={handleModalSubmit}
                                        loading={isLoading}
                                        style={{ flex: 1 }}
                                    >
                                        {activeModal === 'deposit' && 'Deposit'}
                                        {activeModal === 'withdraw' && 'Withdraw'}
                                        {activeModal === 'transfer' && 'Transfer'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}