import { generateCardNumber } from 'src/Utils/CardNumberGenerator';
import styles from '../../Styles/AtmInterface.module.css';

interface VirtualCardProps {
    userId: number;
    accountName: string;
}

export default function VirtualCard({ userId, accountName }: VirtualCardProps) {
    const cardNumber = generateCardNumber(userId);
    const currentYear = new Date().getFullYear() % 100;
    const expiryDate = `12/${currentYear + 3}`;

    return (
        <div>
            <h2 className={styles.sectionTitle}>Virtual Card</h2>
            
            {/* Card Visual */}
            <div className={styles.cardVisual}>
                <div className={styles.cardChip} />
                <div className={styles.cardNumber}>{cardNumber}</div>
                <div className={styles.cardBottom}>
                    <div className={styles.cardHolder}>
                        <div className={styles.cardHolderLabel}>CARD HOLDER</div>
                        <div className={styles.cardHolderName}>{accountName}</div>
                    </div>
                    <div className={styles.cardExpiry}>
                        <div className={styles.cardExpiryLabel}>EXPIRES</div>
                        <div className={styles.cardExpiryDate}>{expiryDate}</div>
                    </div>
                </div>
                <div className={styles.visaLogo}>VISA</div>
            </div>
        </div>
    );
}