import { useState } from 'react';
import * as Icons from 'lucide-react';
import Modal from '../Modal';
import InputField from '../InputField';
import Button from '../Button';
import translate from '@shared/Translation/Translation';
import styles from '../../Styles/AtmInterface.module.css';
export default function TransferModal({ isOpen, onClose, onTransfer, isLoading = false }) {
    const [targetUser, setTargetUser] = useState('');
    const [amount, setAmount] = useState('');
    const handleTransfer = async () => {
        const parsedAmount = parseInt(amount);
        if (targetUser.trim() !== '' && parsedAmount > 0) {
            const success = await onTransfer(targetUser, parsedAmount);
            if (success) {
                setTargetUser('');
                setAmount('');
                onClose();
            }
        }
    };
    const handleClose = () => {
        setTargetUser('');
        setAmount('');
        onClose();
    };
    return (<Modal isOpen={isOpen} onClose={handleClose} title={translate('atm.modal.transfer.title')}>
            <div className={styles.modalForm}>
                <InputField icon={<Icons.User size="1.3rem"/>} label={translate('atm.modal.transfer.targetUser')} type="text" placeholder={translate('atm.modal.transfer.targetUser.placeholder')} value={targetUser} onChange={setTargetUser} disabled={isLoading}/>
                <InputField icon={<Icons.DollarSign size="1.3rem"/>} label={translate('atm.modal.transfer.amount')} type="number" placeholder="0" value={amount} onChange={setAmount} disabled={isLoading}/>
                <div className={styles.modalActions}>
                    <Button variant="gray" onClick={handleClose} disabled={isLoading} fullWidth={true}>
                        <Icons.X size="1rem"/>
                        {translate('atm.button.cancel')}
                    </Button>
                    <Button variant="primary" onClick={handleTransfer} disabled={!targetUser || !amount || isLoading} loading={isLoading} fullWidth={true}>
                        <Icons.Check size="1rem"/>
                        {translate('atm.button.transfer')}
                    </Button>
                </div>
            </div>
        </Modal>);
}
