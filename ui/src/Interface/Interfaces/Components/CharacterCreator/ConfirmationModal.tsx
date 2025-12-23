import Button from "../Button";
import Modal from "../Modal";
import styles from './Styles/Toolbar.module.css';

interface ConfirmationModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationModal({ onConfirm, onCancel }: ConfirmationModalProps) {
    return (
        <Modal 
            isOpen={true} 
            onClose={onCancel}
            title="Confirm Save"
        >
            <div className={styles.modalContent}>
                <p className={styles.modalDescription}>Are you sure you want to save your character?</p>
                <div className={styles.modalButtons}>
                    <Button
                        variant='glass'
                        size='small'
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant='primary'
                        size='small'
                        onClick={onConfirm}
                    >
                        Save Character
                    </Button>
                </div>
            </div>
        </Modal>
    );  
}