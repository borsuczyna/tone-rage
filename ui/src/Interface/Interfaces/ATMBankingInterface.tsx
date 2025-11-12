import { useState, useEffect } from 'react';
import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import styles from './Styles/ATMBankingInterface.module.css';
import * as Icons from 'lucide-react';

type ATMScreen = 'menu' | 'withdraw' | 'deposit' | 'balance' | 'transfer' | 'transfer_amount' | 'pin';

export default function ATMBankingInterface() {
    const { isInterfaceVisible } = useInterfaceVisibility();
    const [currentScreen, setCurrentScreen] = useState<ATMScreen>('menu');
    const [inputValue, setInputValue] = useState('');
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [transferPlayerId, setTransferPlayerId] = useState('');

    // Mock data
    const balance = 125750.50;
    const bankBalance = 89420.25;

    // Keyboard support
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Handle menu navigation
            if (currentScreen === 'menu') {
                if (e.key >= '1' && e.key <= '4') {
                    const screens: ATMScreen[] = ['withdraw', 'deposit', 'balance', 'transfer'];
                    setCurrentScreen(screens[parseInt(e.key) - 1]);
                }
            }
            // Handle input screens
            else if (currentScreen === 'withdraw' || currentScreen === 'deposit' || currentScreen === 'transfer' || currentScreen === 'transfer_amount') {
                if (e.key >= '0' && e.key <= '9') {
                    setInputValue(prev => prev + e.key);
                } else if (e.key === 'Backspace') {
                    setInputValue(prev => prev.slice(0, -1));
                } else if (e.key === 'Delete') {
                    setInputValue('');
                } else if (e.key === 'Enter') {
                    handleEnter();
                } else if (e.key === 'Escape') {
                    if (currentScreen === 'transfer_amount') {
                        setCurrentScreen('transfer');
                    } else {
                        setCurrentScreen('menu');
                    }
                    setInputValue('');
                }
            }
            // ESC to go back
            else if (e.key === 'Escape') {
                setCurrentScreen('menu');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentScreen, inputValue]);

    // Clear input when changing screens
    useEffect(() => {
        setInputValue('');
        setSelectedAmount(null);
    }, [currentScreen]);

    if (!isInterfaceVisible('BankingInterface')) return null;

    const handleKeypadPress = (value: string) => {
        if (value === 'clear') {
            setInputValue('');
        } else if (value === 'back') {
            setInputValue(prev => prev.slice(0, -1));
        } else if (value === 'enter') {
            handleEnter();
        } else {
            // Only add numeric input for screens that need it
            if (currentScreen === 'withdraw' || currentScreen === 'deposit' || currentScreen === 'transfer' || currentScreen === 'transfer_amount') {
                setInputValue(prev => prev + value);
            }
        }
    };

    const handleEnter = () => {
        if (!inputValue) return;

        switch (currentScreen) {
            case 'withdraw':
                console.log('Withdrawing:', inputValue);
                // Add your withdraw logic here
                setInputValue('');
                break;
            case 'deposit':
                console.log('Depositing:', inputValue);
                // Add your deposit logic here
                setInputValue('');
                break;
            case 'transfer':
                // Step 1: Save player ID and move to amount screen
                setTransferPlayerId(inputValue);
                setInputValue('');
                setCurrentScreen('transfer_amount');
                break;
            case 'transfer_amount':
                // Step 2: Complete transfer with saved player ID and amount
                console.log('Transferring $' + inputValue + ' to player:', transferPlayerId);
                // Add your transfer logic here
                setInputValue('');
                setTransferPlayerId('');
                setCurrentScreen('menu');
                break;
        }
    };

    const handleQuickAmount = (amount: number) => {
        setSelectedAmount(amount);
        setInputValue(amount.toString());
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case 'menu':
                return (
                    <div className={styles.screenContent}>
                        <div className={styles.screenTitle}>TONE BANKING ATM</div>
                        <div className={styles.screenSubtitle}>Please select a transaction</div>

                        <div className={styles.menuOptions}>
                            <button className={styles.menuOption} onClick={() => setCurrentScreen('withdraw')}>
                                <span className={styles.optionNumber}>1</span>
                                <span className={styles.optionText}>Withdraw Cash</span>
                                <Icons.ArrowRight size={16} />
                            </button>
                            <button className={styles.menuOption} onClick={() => setCurrentScreen('deposit')}>
                                <span className={styles.optionNumber}>2</span>
                                <span className={styles.optionText}>Deposit Cash</span>
                                <Icons.ArrowRight size={16} />
                            </button>
                            <button className={styles.menuOption} onClick={() => setCurrentScreen('balance')}>
                                <span className={styles.optionNumber}>3</span>
                                <span className={styles.optionText}>Check Balance</span>
                                <Icons.ArrowRight size={16} />
                            </button>
                            <button className={styles.menuOption} onClick={() => setCurrentScreen('transfer')}>
                                <span className={styles.optionNumber}>4</span>
                                <span className={styles.optionText}>Transfer Money</span>
                                <Icons.ArrowRight size={16} />
                            </button>
                        </div>

                        <div className={styles.screenFooter}>
                            Press number or use buttons on the right →
                        </div>
                    </div>
                );

            case 'balance':
                return (
                    <div className={styles.screenContent}>
                        <div className={styles.screenTitle}>ACCOUNT BALANCE</div>

                        <div className={styles.balanceDisplay}>
                            <div className={styles.balanceItem}>
                                <div className={styles.balanceLabel}>Cash on Hand</div>
                                <div className={styles.balanceAmount}>${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                            </div>
                            <div className={styles.balanceDivider}></div>
                            <div className={styles.balanceItem}>
                                <div className={styles.balanceLabel}>Bank Account</div>
                                <div className={styles.balanceAmount}>${bankBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                            </div>
                            <div className={styles.balanceDivider}></div>
                            <div className={styles.balanceItem}>
                                <div className={styles.balanceLabel}>Total Assets</div>
                                <div className={styles.balanceAmountTotal}>${(balance + bankBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                            </div>
                        </div>

                        <div className={styles.screenFooter}>
                            Press [ESC] to return to menu
                        </div>
                    </div>
                );

            case 'withdraw':
                return (
                    <div className={styles.screenContent}>
                        <div className={styles.screenTitle}>WITHDRAW CASH</div>
                        <div className={styles.screenSubtitle}>Available Balance: ${bankBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>

                        <div className={styles.amountInput}>
                            <div className={styles.inputLabel}>Enter Amount:</div>
                            <div className={styles.inputDisplay}>$ {inputValue || '0.00'}</div>
                        </div>

                        <div className={styles.quickAmountButtons}>
                            <button className={styles.quickAmount} onClick={() => handleQuickAmount(100)}>
                                <span className={styles.quickAmountLabel}>$100</span>
                            </button>
                            <button className={styles.quickAmount} onClick={() => handleQuickAmount(500)}>
                                <span className={styles.quickAmountLabel}>$500</span>
                            </button>
                            <button className={styles.quickAmount} onClick={() => handleQuickAmount(1000)}>
                                <span className={styles.quickAmountLabel}>$1,000</span>
                            </button>
                            <button className={styles.quickAmount} onClick={() => handleQuickAmount(5000)}>
                                <span className={styles.quickAmountLabel}>$5,000</span>
                            </button>
                        </div>

                        <div className={styles.screenFooter}>
                            Use keypad to enter amount or select quick option
                        </div>
                    </div>
                );

            case 'deposit':
                return (
                    <div className={styles.screenContent}>
                        <div className={styles.screenTitle}>DEPOSIT CASH</div>
                        <div className={styles.screenSubtitle}>Cash Available: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>

                        <div className={styles.amountInput}>
                            <div className={styles.inputLabel}>Enter Amount:</div>
                            <div className={styles.inputDisplay}>$ {inputValue || '0.00'}</div>
                        </div>

                        <div className={styles.quickAmountButtons}>
                            <button className={styles.quickAmount} onClick={() => handleQuickAmount(1000)}>
                                <span className={styles.quickAmountLabel}>$1,000</span>
                            </button>
                            <button className={styles.quickAmount} onClick={() => handleQuickAmount(5000)}>
                                <span className={styles.quickAmountLabel}>$5,000</span>
                            </button>
                            <button className={styles.quickAmount} onClick={() => handleQuickAmount(10000)}>
                                <span className={styles.quickAmountLabel}>$10,000</span>
                            </button>
                            <button className={styles.quickAmount} onClick={() => handleQuickAmount(balance)}>
                                <span className={styles.quickAmountLabel}>ALL</span>
                            </button>
                        </div>

                        <div className={styles.screenFooter}>
                            Use keypad to enter amount or select quick option
                        </div>
                    </div>
                );

            case 'transfer':
                return (
                    <div className={styles.screenContent}>
                        <div className={styles.screenTitle}>TRANSFER MONEY</div>
                        <div className={styles.screenSubtitle}>Bank Balance: ${bankBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>

                        <div className={styles.transferForm}>
                            <div className={styles.formField}>
                                <div className={styles.fieldLabel}>Player ID:</div>
                                <div className={styles.fieldInput}>{inputValue || '_'}</div>
                            </div>
                        </div>

                        <div className={styles.screenFooter}>
                            Enter player ID using keypad, then press [ENTER]
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.atmMachine}>
                {/* ATM Screen */}
                <div className={styles.atmScreen}>
                    <div className={styles.screenBezel}>
                        {renderScreen()}
                    </div>
                </div>

                {/* ATM Control Panel */}
                <div className={styles.controlPanel}>
                    {/* Side Buttons (Left) */}
                    <div className={styles.sideButtons}>
                        <button className={styles.sideButton}></button>
                        <button className={styles.sideButton}></button>
                        <button className={styles.sideButton}></button>
                        <button className={styles.sideButton}></button>
                    </div>

                    {/* Keypad */}
                    <div className={styles.keypad}>
                        <div className={styles.keypadRow}>
                            <button className={styles.keypadButton} onClick={() => handleKeypadPress('1')}>1</button>
                            <button className={styles.keypadButton} onClick={() => handleKeypadPress('2')}>2</button>
                            <button className={styles.keypadButton} onClick={() => handleKeypadPress('3')}>3</button>
                        </div>
                        <div className={styles.keypadRow}>
                            <button className={styles.keypadButton} onClick={() => handleKeypadPress('4')}>4</button>
                            <button className={styles.keypadButton} onClick={() => handleKeypadPress('5')}>5</button>
                            <button className={styles.keypadButton} onClick={() => handleKeypadPress('6')}>6</button>
                        </div>
                        <div className={styles.keypadRow}>
                            <button className={styles.keypadButton} onClick={() => handleKeypadPress('7')}>7</button>
                            <button className={styles.keypadButton} onClick={() => handleKeypadPress('8')}>8</button>
                            <button className={styles.keypadButton} onClick={() => handleKeypadPress('9')}>9</button>
                        </div>
                        <div className={styles.keypadRow}>
                            <button className={styles.keypadButton} onClick={() => handleKeypadPress('clear')}>
                                <Icons.X size={16} />
                            </button>
                            <button className={styles.keypadButton} onClick={() => handleKeypadPress('0')}>0</button>
                            <button className={styles.keypadButton} onClick={() => handleKeypadPress('back')}>
                                <Icons.Delete size={16} />
                            </button>
                        </div>
                        <div className={styles.keypadRow}>
                            <button className={`${styles.keypadButton} ${styles.cancel}`} onClick={() => setCurrentScreen('menu')}>
                                CANCEL
                            </button>
                            <button className={`${styles.keypadButton} ${styles.enter}`} onClick={() => handleKeypadPress('enter')}>
                                ENTER
                            </button>
                        </div>
                    </div>

                    {/* Side Buttons (Right) */}
                    <div className={styles.sideButtons}>
                        <button className={styles.sideButton}></button>
                        <button className={styles.sideButton}></button>
                        <button className={styles.sideButton}></button>
                        <button className={styles.sideButton}></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
