import * as Icons from 'lucide-react';
import { formatMoney } from '@shared/MoneyHelper';
import styles from '../../Styles/AtmInterface.module.css';
import csx from 'src/Utils/MergeClass';
export default function AccountCard({ type, balance, title, subtitle }) {
    const cardClassName = type === 'main' ? styles.mainAccountCard : styles.walletCashCard;
    const AccountIcon = type === 'main' ? Icons.Building : Icons.Wallet;
    return (<div className={csx(cardClassName, styles.accountCard)}>
            <div className={styles.cardData}>
                <div className={styles.cardLabel}>{title}</div>
                <div className={styles.cardAmount}>{formatMoney(balance)}</div>
                <div className={styles.cardSubtitle}>{subtitle}</div>
            </div>

            <AccountIcon size="1.2rem" className={styles.cardIcon} stroke='currentColor'/>
        </div>);
}
