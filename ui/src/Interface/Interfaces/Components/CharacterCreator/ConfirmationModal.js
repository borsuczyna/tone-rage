import Button from "../Button";
import Modal from "../Modal";
import styles from './Styles/Toolbar.module.css';
import translate from '@shared/Translation/Translation';
export default function ConfirmationModal({ onConfirm, onCancel }) {
    return (<Modal isOpen={true} onClose={onCancel} title={translate('character.creator.modal.confirm.title')}>
            <div className={styles.modalContent}>
                <p className={styles.modalDescription}>{translate('character.creator.modal.confirm.description')}</p>
                <div className={styles.modalButtons}>
                    <Button variant='glass' size='small' onClick={onCancel}>
                        {translate('character.creator.modal.cancel')}
                    </Button>

                    <Button variant='primary' size='small' onClick={onConfirm}>
                        {translate('character.creator.modal.confirm.button')}
                    </Button>
                </div>
            </div>
        </Modal>);
}
