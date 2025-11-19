import { useState } from 'react';
import * as Icons from 'lucide-react';
import Button from '../Button';
import { formatMoney } from '@shared/MoneyHelper';
import translate from '@shared/Translation/Translation';
import styles from '../../Styles/AtmInterface.module.css';
import { triggerEvent } from 'src/Hooks/Fetch';

interface WithdrawTabProps {
    onTransaction: (amount: number) => void;
    disabled?: boolean;
}

export default function WithdrawTab({ onTransaction, disabled = false }: WithdrawTabProps) {
    const [displayAmount, setDisplayAmount] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Prevent the default behavior since we handle everything manually
        e.preventDefault();
    };

    const handleNumberClick = (num: string) => {
        if (displayAmount.length < 10) {
            setDisplayAmount(prev => prev + num);
        }
    };

    const handleClose = () => {
        triggerEvent('atm:closeInterface');
    };

    const handleBackspace = () => {
        setDisplayAmount(prev => prev.slice(0, -1));
    };

    const handleConfirm = () => {
        const amount = parseInt(displayAmount);
        if (amount > 0) {
            onTransaction(amount);
            setDisplayAmount('');
        }
    };

    return (
        <>
            {/* Display Area */}
            <div className={styles.displayArea}>
                <div className={styles.amountInput}>
                    <div className={styles.inputLabel}>
                        {translate('atm.amount.withdraw')}
                    </div>
                    <input
                        type="text"
                        className={styles.amountField}
                        value={displayAmount ? formatMoney(parseInt(displayAmount)) : formatMoney(0)}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Backspace') {
                                e.preventDefault();
                                handleBackspace();
                            } else if (e.key === 'Delete' || e.key === 'Escape') {
                                e.preventDefault();
                                handleClose();
                            } else if (/^[0-9]$/.test(e.key)) {
                                e.preventDefault();
                                handleNumberClick(e.key);
                            } else {
                                // Prevent all other characters
                                e.preventDefault();
                            }
                        }}
                        placeholder={formatMoney(0)}
                    />
                </div>
            </div>

            {/* Keypad */}
            <div className={styles.keypad}>
                <div className={styles.keypadGrid}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            className={styles.keypadButton}
                            onClick={() => handleNumberClick(num.toString())}
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        className={`${styles.keypadButton} ${styles.clearButton}`}
                        onClick={handleClose}
                    >
                        <Icons.RotateCcw size="1.2rem" />
                    </button>
                    <button
                        className={styles.keypadButton}
                        onClick={() => handleNumberClick('0')}
                    >
                        0
                    </button>
                    <button
                        className={`${styles.keypadButton} ${styles.backspaceButton}`}
                        onClick={handleBackspace}
                    >
                        <Icons.Delete size="1.2rem" />
                    </button>
                </div>
            </div>

            {/* Action Bar */}
            <div className={styles.actionBar}>
                <Button variant="gray" onClick={handleClose}>
                    <Icons.X size="1rem" />
                    {translate('atm.button.cancel')}
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleConfirm}
                    disabled={!displayAmount || disabled}
                    loading={disabled}
                >
                    <Icons.Check size="1rem" />
                    {translate('atm.button.withdraw')}
                </Button>
            </div>
        </>
    );
}