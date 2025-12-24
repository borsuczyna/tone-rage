import * as Icons from 'lucide-react';
import styles from '../../Styles/AtmInterface.module.css';
import translate from '@shared/Translation/Translation';
export default function QuickActions({ onDepositClick, onWithdrawClick, onTransferClick }) {
    return (<div className={styles.quickActions}>
            <h2 className={styles.sectionTitle}>{translate('atm.quickActions.title')}</h2>
            <div className={styles.actionsGrid}>
                <div className={styles.actionButton} onClick={onDepositClick}>
                    <Icons.ArrowUp size="1.5rem" className={styles.depositIcon}/>
                    <div className={styles.actionContent}>
                        <span className={styles.actionTitle}>{translate('atm.action.deposit')}</span>
                        <span className={styles.actionSubtitle}>{translate('atm.quickActions.deposit.subtitle')}</span>
                    </div>
                </div>
                <div className={styles.actionButton} onClick={onWithdrawClick}>
                    <Icons.ArrowDown size="1.5rem" className={styles.withdrawIcon}/>
                    <div className={styles.actionContent}>
                        <span className={styles.actionTitle}>{translate('atm.action.withdraw')}</span>
                        <span className={styles.actionSubtitle}>{translate('atm.quickActions.withdraw.subtitle')}</span>
                    </div>
                </div>
                <div className={styles.actionButton} onClick={onTransferClick}>
                    <Icons.ArrowLeftRight size="1.5rem" className={styles.transferIcon}/>
                    <div className={styles.actionContent}>
                        <span className={styles.actionTitle}>{translate('atm.action.transfer')}</span>
                        <span className={styles.actionSubtitle}>{translate('atm.quickActions.transfer.subtitle')}</span>
                    </div>
                </div>
            </div>
        </div>);
}
