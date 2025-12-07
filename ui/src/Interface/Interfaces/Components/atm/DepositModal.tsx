import { useState } from 'react';
import * as Icons from 'lucide-react';
import Modal from '../Modal';
import InputField from '../InputField';
import Button from '../Button';
import translate from '@shared/Translation/Translation';
import styles from '../../Styles/AtmInterface.module.css';

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDeposit: (amount: number) => Promise<void>;
    isLoading?: boolean;
}

export default function DepositModal({ isOpen, onClose, onDeposit, isLoading = false }: DepositModalProps) {
    const [amount, setAmount] = useState('');

    const handleDeposit = async () => {
        const parsedAmount = parseInt(amount);
        if (parsedAmount > 0) {
            await onDeposit(parsedAmount);
            setAmount('');
            onClose();
        }
    };

    const handleClose = () => {
        setAmount('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={translate('atm.modal.deposit.title')}>
            <div className={styles.modalForm}>
                <InputField
                    icon={<Icons.DollarSign size="1.3rem" />}
                    label={translate('atm.modal.deposit.amount')}
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={setAmount}
                    disabled={isLoading}
                    groupStyle={{ marginBottom: '1.5rem' }}
                />
                <div className={styles.modalActions}>
                    <Button 
                        variant="gray" 
                        onClick={handleClose}
                        disabled={isLoading}
                        style={{ flex: 1 }}
                    >
                        <Icons.X size="1rem" />
                        {translate('atm.button.cancel')}
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleDeposit}
                        disabled={!amount || isLoading}
                        loading={isLoading}
                        style={{ flex: 1 }}
                    >
                        <Icons.Check size="1rem" />
                        {translate('atm.button.deposit')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
