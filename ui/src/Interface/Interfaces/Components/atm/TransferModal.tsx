import { useState } from 'react';
import * as Icons from 'lucide-react';
import Modal from '../Modal';
import InputField from '../InputField';
import Button from '../Button';
import translate from '@shared/Translation/Translation';
import styles from '../../Styles/AtmInterface.module.css';

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTransfer: (targetUserId: number, amount: number) => Promise<void>;
    isLoading?: boolean;
}

export default function TransferModal({ isOpen, onClose, onTransfer, isLoading = false }: TransferModalProps) {
    const [targetUserId, setTargetUserId] = useState('');
    const [amount, setAmount] = useState('');

    const handleTransfer = async () => {
        const parsedUserId = parseInt(targetUserId);
        const parsedAmount = parseInt(amount);
        if (parsedUserId > 0 && parsedAmount > 0) {
            await onTransfer(parsedUserId, parsedAmount);
            setTargetUserId('');
            setAmount('');
            onClose();
        }
    };

    const handleClose = () => {
        setTargetUserId('');
        setAmount('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={translate('atm.modal.transfer.title')}>
            <div className={styles.modalForm}>
                <InputField
                    icon={<Icons.User size="1.3rem" />}
                    label={translate('atm.modal.transfer.targetUser')}
                    type="number"
                    placeholder="0"
                    value={targetUserId}
                    onChange={setTargetUserId}
                    disabled={isLoading}
                    groupStyle={{ marginBottom: '1.5rem' }}
                />
                <InputField
                    icon={<Icons.DollarSign size="1.3rem" />}
                    label={translate('atm.modal.transfer.amount')}
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
                        onClick={handleTransfer}
                        disabled={!targetUserId || !amount || isLoading}
                        loading={isLoading}
                        style={{ flex: 1 }}
                    >
                        <Icons.Check size="1rem" />
                        {translate('atm.button.transfer')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
