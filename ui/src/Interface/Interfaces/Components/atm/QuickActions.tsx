import * as Icons from 'lucide-react';
import styles from '../../Styles/AtmInterface.module.css';

interface QuickActionsProps {
    onDepositClick: () => void;
    onWithdrawClick: () => void;
    onTransferClick: () => void;
}

export default function QuickActions({ onDepositClick, onWithdrawClick, onTransferClick }: QuickActionsProps) {
    return (
        <div className={styles.quickActions}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.actionsGrid}>
                <div className={styles.actionButton} onClick={onDepositClick}>
                    <Icons.ArrowUp size="1.5rem" className={styles.depositIcon} />
                    <div className={styles.actionContent}>
                        <span className={styles.actionTitle}>Deposit</span>
                        <span className={styles.actionSubtitle}>Add money to account</span>
                    </div>
                </div>
                <div className={styles.actionButton} onClick={onWithdrawClick}>
                    <Icons.ArrowDown size="1.5rem" className={styles.withdrawIcon} />
                    <div className={styles.actionContent}>
                        <span className={styles.actionTitle}>Withdraw</span>
                        <span className={styles.actionSubtitle}>Take money out</span>
                    </div>
                </div>
                <div className={styles.actionButton} onClick={onTransferClick}>
                    <Icons.ArrowLeftRight size="1.5rem" className={styles.transferIcon} />
                    <div className={styles.actionContent}>
                        <span className={styles.actionTitle}>Transfer</span>
                        <span className={styles.actionSubtitle}>Send to another account</span>
                    </div>
                </div>
            </div>
        </div>
    );
}