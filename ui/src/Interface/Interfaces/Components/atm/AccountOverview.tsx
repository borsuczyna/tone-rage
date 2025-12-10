import { generateCardNumber } from 'src/Utils/CardNumberGenerator';
import styles from '../../Styles/AtmInterface.module.css';
import AccountCard from './AccountCard';

interface AccountOverviewProps {
    bankBalance: number;
    walletBalance: number;
    userId: number;
}

export default function AccountOverview({ bankBalance, walletBalance, userId }: AccountOverviewProps) {
    const number = generateCardNumber(userId + 1337);

    return (
        <div className={styles.accountOverview}>
            <h2 className={styles.sectionTitle}>Account Overview</h2>
            <div className={styles.accountCards}>
                <AccountCard 
                    type="main"
                    balance={bankBalance}
                    title="Main Account"
                    subtitle={`Account: ${number}`}
                />
                <AccountCard 
                    type="wallet"
                    balance={walletBalance}
                    title="Wallet Cash"
                    subtitle="Available balance"
                />
            </div>
        </div>
    );
}