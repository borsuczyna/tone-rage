import { generateCardNumber } from 'src/Utils/CardNumberGenerator';
import styles from '../../Styles/AtmInterface.module.css';
import AccountCard from './AccountCard';
import translate from '@shared/Translation/Translation';
export default function AccountOverview({ bankBalance, walletBalance, userId }) {
    const number = generateCardNumber(userId + 1337);
    return (<div className={styles.accountOverview}>
            <h2 className={styles.sectionTitle}>{translate('atm.accountOverview.title')}</h2>
            <div className={styles.accountCards}>
                <AccountCard type="main" balance={bankBalance} title={translate('atm.dashboard.mainAccount')} subtitle={`${translate('atm.accountOverview.account')}: ${number}`}/>
                <AccountCard type="wallet" balance={walletBalance} title={translate('atm.accountOverview.walletCash')} subtitle={translate('atm.accountOverview.availableBalance')}/>
            </div>
        </div>);
}
