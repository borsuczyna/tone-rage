import { useState, useEffect, useRef } from 'react';
import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import styles from './Styles/BankingInterface.module.css';
import * as Icons from 'lucide-react';
import Button from './Components/Button';
import InputField from './Components/InputField';

type BankingTab = 'overview' | 'deposit' | 'withdraw' | 'transfer' | 'transactions';
type TransitionDirection = 'left' | 'right' | 'none';

interface Transaction {
    id: string;
    type: 'deposit' | 'withdraw' | 'transfer_in' | 'transfer_out';
    amount: number;
    description: string;
    timestamp: Date;
    balance: number;
}

export default function BankingInterface() {
    const { isInterfaceVisible } = useInterfaceVisibility();
    const [activeTab, setActiveTab] = useState<BankingTab>('overview');
    const [displayTab, setDisplayTab] = useState<BankingTab>('overview');
    const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>('none');
    const [transitionState, setTransitionState] = useState<'idle' | 'exit' | 'enter'>('idle');
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Refs for height animation
    const contentRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto');

    // Tab order for determining slide direction
    const tabOrder: BankingTab[] = ['overview', 'deposit', 'withdraw', 'transfer', 'transactions'];

    // Handle tab changes with Vue-like out-in animation
    const handleTabChange = (newTab: BankingTab) => {
        if (newTab === activeTab || transitionState !== 'idle') return;

        const currentIndex = tabOrder.indexOf(activeTab);
        const newIndex = tabOrder.indexOf(newTab);

        setTransitionDirection(newIndex > currentIndex ? 'left' : 'right');
        setActiveTab(newTab);

        // Start exit animation
        setTransitionState('exit');
    };

    // Handle transition states (out-in mode)
    useEffect(() => {
        if (transitionState === 'exit') {
            // Wait for exit animation to complete
            const exitTimer = setTimeout(() => {
                setDisplayTab(activeTab);
                setTransitionState('enter');
            }, 300); // Exit animation duration

            return () => clearTimeout(exitTimer);
        } else if (transitionState === 'enter') {
            // Wait for enter animation to complete
            const enterTimer = setTimeout(() => {
                setTransitionState('idle');
            }, 400); // Enter animation duration

            return () => clearTimeout(enterTimer);
        }
    }, [transitionState, activeTab]);

    // Animate height changes smoothly
    useEffect(() => {
        const updateHeight = () => {
            if (wrapperRef.current) {
                const newHeight = wrapperRef.current.scrollHeight;
                setContentHeight(newHeight);
            }
        };

        // Update height when entering new content
        if (transitionState === 'enter') {
            // Use requestAnimationFrame to ensure DOM is fully rendered
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    updateHeight();
                });
            });
        }

        // Use ResizeObserver to track dynamic content size changes
        const resizeObserver = new ResizeObserver(() => {
            updateHeight();
        });

        if (wrapperRef.current) {
            resizeObserver.observe(wrapperRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [displayTab, transitionState]);

    // Mock data - will be replaced with real data from server
    const [balance] = useState(125750.50);
    const [bankBalance] = useState(89420.25);
    const [transactions] = useState<Transaction[]>([
        { id: '1', type: 'deposit', amount: 5000, description: 'Salary Payment', timestamp: new Date(Date.now() - 86400000), balance: 89420.25 },
        { id: '2', type: 'withdraw', amount: 2500, description: 'ATM Withdrawal', timestamp: new Date(Date.now() - 172800000), balance: 84420.25 },
        { id: '3', type: 'transfer_in', amount: 1200, description: 'From: John_Doe', timestamp: new Date(Date.now() - 259200000), balance: 86920.25 },
        { id: '4', type: 'transfer_out', amount: 800, description: 'To: Jane_Smith', timestamp: new Date(Date.now() - 345600000), balance: 85720.25 },
        { id: '5', type: 'deposit', amount: 3000, description: 'Business Income', timestamp: new Date(Date.now() - 432000000), balance: 86520.25 },
    ]);

    if (!isInterfaceVisible('BankingInterface')) return null;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(value);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getTransactionIcon = (type: Transaction['type']) => {
        switch (type) {
            case 'deposit':
                return <Icons.ArrowDownCircle className={styles.iconDeposit} size={20} />;
            case 'withdraw':
                return <Icons.ArrowUpCircle className={styles.iconWithdraw} size={20} />;
            case 'transfer_in':
                return <Icons.ArrowDownRight className={styles.iconTransferIn} size={20} />;
            case 'transfer_out':
                return <Icons.ArrowUpRight className={styles.iconTransferOut} size={20} />;
        }
    };

    const renderOverview = () => (
        <div className={styles.overviewContent}>
            <div className={styles.balanceCards}>
                <div className={styles.balanceCard}>
                    <div className={styles.cardHeader}>
                        <Icons.Wallet className={styles.cardIcon} size={24} />
                        <span className={styles.cardLabel}>Cash Balance</span>
                    </div>
                    <div className={styles.cardAmount}>{formatCurrency(balance)}</div>
                    <div className={styles.cardGlow}></div>
                </div>

                <div className={styles.balanceCard}>
                    <div className={styles.cardHeader}>
                        <Icons.Building2 className={styles.cardIcon} size={24} />
                        <span className={styles.cardLabel}>Bank Balance</span>
                    </div>
                    <div className={styles.cardAmount}>{formatCurrency(bankBalance)}</div>
                    <div className={styles.cardGlow}></div>
                </div>

                <div className={styles.balanceCard}>
                    <div className={styles.cardHeader}>
                        <Icons.TrendingUp className={styles.cardIcon} size={24} />
                        <span className={styles.cardLabel}>Total Assets</span>
                    </div>
                    <div className={styles.cardAmount}>{formatCurrency(balance + bankBalance)}</div>
                    <div className={styles.cardGlow}></div>
                </div>
            </div>

            <div className={styles.quickActions}>
                <h3 className={styles.sectionTitle}>
                    <Icons.Zap size={18} />
                    Quick Actions
                </h3>
                <div className={styles.actionButtons}>
                    <button className={styles.actionButton} onClick={() => setActiveTab('deposit')}>
                        <Icons.ArrowDownCircle size={24} />
                        <span>Deposit</span>
                    </button>
                    <button className={styles.actionButton} onClick={() => setActiveTab('withdraw')}>
                        <Icons.ArrowUpCircle size={24} />
                        <span>Withdraw</span>
                    </button>
                    <button className={styles.actionButton} onClick={() => setActiveTab('transfer')}>
                        <Icons.ArrowLeftRight size={24} />
                        <span>Transfer</span>
                    </button>
                    <button className={styles.actionButton} onClick={() => setActiveTab('transactions')}>
                        <Icons.History size={24} />
                        <span>History</span>
                    </button>
                </div>
            </div>

            <div className={styles.recentTransactions}>
                <h3 className={styles.sectionTitle}>
                    <Icons.Clock size={18} />
                    Recent Transactions
                </h3>
                <div className={styles.transactionsList}>
                    {transactions.slice(0, 3).map((transaction) => (
                        <div key={transaction.id} className={styles.transactionItem}>
                            {getTransactionIcon(transaction.type)}
                            <div className={styles.transactionDetails}>
                                <div className={styles.transactionDescription}>{transaction.description}</div>
                                <div className={styles.transactionDate}>{formatDate(transaction.timestamp)}</div>
                            </div>
                            <div className={`${styles.transactionAmount} ${
                                transaction.type === 'deposit' || transaction.type === 'transfer_in'
                                    ? styles.positive
                                    : styles.negative
                            }`}>
                                {transaction.type === 'deposit' || transaction.type === 'transfer_in' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderDeposit = () => (
        <div className={styles.formContent}>
            <div className={styles.formHeader}>
                <Icons.ArrowDownCircle className={styles.formIcon} size={32} />
                <h2>Deposit Money</h2>
                <p>Transfer cash from your wallet to your bank account</p>
            </div>

            <div className={styles.balanceInfo}>
                <div className={styles.balanceInfoItem}>
                    <span>Cash Available:</span>
                    <strong>{formatCurrency(balance)}</strong>
                </div>
            </div>

            <div className={styles.formFields}>
                <InputField
                    icon={<Icons.DollarSign size={20} />}
                    label="Amount"
                    type="number"
                    placeholder="Enter amount to deposit"
                    value={amount}
                    onChange={setAmount}
                />

                <div className={styles.quickAmounts}>
                    <button onClick={() => setAmount('1000')}>$1,000</button>
                    <button onClick={() => setAmount('5000')}>$5,000</button>
                    <button onClick={() => setAmount('10000')}>$10,000</button>
                    <button onClick={() => setAmount(balance.toString())}>All</button>
                </div>

                <Button
                    variant="primary"
                    size="large"
                    loading={isLoading}
                    style={{ marginTop: '1rem' }}
                >
                    <Icons.Check size={20} />
                    Confirm Deposit
                </Button>
            </div>
        </div>
    );

    const renderWithdraw = () => (
        <div className={styles.formContent}>
            <div className={styles.formHeader}>
                <Icons.ArrowUpCircle className={styles.formIcon} size={32} />
                <h2>Withdraw Money</h2>
                <p>Transfer money from your bank account to cash</p>
            </div>

            <div className={styles.balanceInfo}>
                <div className={styles.balanceInfoItem}>
                    <span>Bank Balance:</span>
                    <strong>{formatCurrency(bankBalance)}</strong>
                </div>
            </div>

            <div className={styles.formFields}>
                <InputField
                    icon={<Icons.DollarSign size={20} />}
                    label="Amount"
                    type="number"
                    placeholder="Enter amount to withdraw"
                    value={amount}
                    onChange={setAmount}
                />

                <div className={styles.quickAmounts}>
                    <button onClick={() => setAmount('1000')}>$1,000</button>
                    <button onClick={() => setAmount('5000')}>$5,000</button>
                    <button onClick={() => setAmount('10000')}>$10,000</button>
                    <button onClick={() => setAmount(bankBalance.toString())}>All</button>
                </div>

                <Button
                    variant="primary"
                    size="large"
                    loading={isLoading}
                    style={{ marginTop: '1rem' }}
                >
                    <Icons.Check size={20} />
                    Confirm Withdrawal
                </Button>
            </div>
        </div>
    );

    const renderTransfer = () => (
        <div className={styles.formContent}>
            <div className={styles.formHeader}>
                <Icons.ArrowLeftRight className={styles.formIcon} size={32} />
                <h2>Transfer Money</h2>
                <p>Send money to another player's bank account</p>
            </div>

            <div className={styles.balanceInfo}>
                <div className={styles.balanceInfoItem}>
                    <span>Bank Balance:</span>
                    <strong>{formatCurrency(bankBalance)}</strong>
                </div>
            </div>

            <div className={styles.formFields}>
                <InputField
                    icon={<Icons.User size={20} />}
                    label="Recipient ID"
                    type="text"
                    placeholder="Enter player ID or name"
                    value={recipient}
                    onChange={setRecipient}
                />

                <InputField
                    icon={<Icons.DollarSign size={20} />}
                    label="Amount"
                    type="number"
                    placeholder="Enter amount to transfer"
                    value={amount}
                    onChange={setAmount}
                />

                <div className={styles.quickAmounts}>
                    <button onClick={() => setAmount('1000')}>$1,000</button>
                    <button onClick={() => setAmount('5000')}>$5,000</button>
                    <button onClick={() => setAmount('10000')}>$10,000</button>
                </div>

                <Button
                    variant="primary"
                    size="large"
                    loading={isLoading}
                    style={{ marginTop: '1rem' }}
                >
                    <Icons.Send size={20} />
                    Send Transfer
                </Button>
            </div>
        </div>
    );

    const renderTransactions = () => (
        <div className={styles.transactionsContent}>
            <div className={styles.formHeader}>
                <Icons.History className={styles.formIcon} size={32} />
                <h2>Transaction History</h2>
                <p>View all your banking transactions</p>
            </div>

            <div className={styles.transactionsList}>
                {transactions.map((transaction) => (
                    <div key={transaction.id} className={styles.transactionItem}>
                        {getTransactionIcon(transaction.type)}
                        <div className={styles.transactionDetails}>
                            <div className={styles.transactionDescription}>{transaction.description}</div>
                            <div className={styles.transactionDate}>{formatDate(transaction.timestamp)}</div>
                        </div>
                        <div className={styles.transactionRight}>
                            <div className={`${styles.transactionAmount} ${
                                transaction.type === 'deposit' || transaction.type === 'transfer_in'
                                    ? styles.positive
                                    : styles.negative
                            }`}>
                                {transaction.type === 'deposit' || transaction.type === 'transfer_in' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                            </div>
                            <div className={styles.transactionBalance}>
                                Balance: {formatCurrency(transaction.balance)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderContent = () => {
        const content = (() => {
            switch (displayTab) {
                case 'overview':
                    return renderOverview();
                case 'deposit':
                    return renderDeposit();
                case 'withdraw':
                    return renderWithdraw();
                case 'transfer':
                    return renderTransfer();
                case 'transactions':
                    return renderTransactions();
            }
        })();

        // Determine animation class based on transition state
        const getAnimationClass = () => {
            if (transitionState === 'exit') {
                return transitionDirection === 'left' ? styles.slideOutLeft : styles.slideOutRight;
            } else if (transitionState === 'enter') {
                return styles.slideIn;
            }
            return '';
        };

        return (
            <div
                ref={wrapperRef}
                className={`${styles.contentWrapper} ${getAnimationClass()}`}
                key={displayTab}
            >
                {content}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.bankingPanel}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <Icons.Landmark className={styles.headerIcon} size={28} />
                        <div>
                            <h1>TONE Banking</h1>
                            <p>Secure Financial Management System</p>
                        </div>
                    </div>
                    <button className={styles.closeButton}>
                        <Icons.X size={24} />
                    </button>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
                        onClick={() => handleTabChange('overview')}
                    >
                        <Icons.LayoutDashboard size={18} />
                        Overview
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'deposit' ? styles.active : ''}`}
                        onClick={() => handleTabChange('deposit')}
                    >
                        <Icons.ArrowDownCircle size={18} />
                        Deposit
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'withdraw' ? styles.active : ''}`}
                        onClick={() => handleTabChange('withdraw')}
                    >
                        <Icons.ArrowUpCircle size={18} />
                        Withdraw
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'transfer' ? styles.active : ''}`}
                        onClick={() => handleTabChange('transfer')}
                    >
                        <Icons.ArrowLeftRight size={18} />
                        Transfer
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'transactions' ? styles.active : ''}`}
                        onClick={() => handleTabChange('transactions')}
                    >
                        <Icons.Receipt size={18} />
                        History
                    </button>
                </div>

                <div className={styles.content}>
                    <div
                        ref={contentRef}
                        className={styles.contentHeightWrapper}
                        style={{
                            height: contentHeight === 'auto' ? 'auto' : `${contentHeight}px`,
                        }}
                    >
                        {renderContent()}
                    </div>
                </div>
            </div>

            {/* Background effects */}
            <div className={styles.backgroundEffects}>
                <div className={styles.gridOverlay}></div>
                <div className={styles.glowOrb} style={{ top: '20%', left: '10%' }}></div>
                <div className={styles.glowOrb} style={{ top: '60%', right: '15%' }}></div>
            </div>
        </div>
    );
}
