import { MoneyLogTypeColors, MoneyLogTypeColorsLight, MoneyLogTypeIcons, MoneyLogTypeNames, type MoneyLogEntityInterface } from '@shared/Models/MoneyLogData';
import { formatMoney } from '@shared/MoneyHelper';
import * as Icons from 'lucide-react';
import styles from '../../Styles/AtmInterface.module.css';

interface TransactionTableItemProps {
    transaction: MoneyLogEntityInterface;
}

export default function TransactionTableItem({ transaction }: TransactionTableItemProps) {
    const formatDate = (date: Date) => {
        let formattedDate = date.toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const splitted = formattedDate.split(',');
        if (splitted.length > 1) {
            formattedDate = splitted[0] + ', ' + splitted[1] + ' ·' + splitted.slice(2).join(',');
        }

        return formattedDate;
    };

    const actionName = MoneyLogTypeNames[transaction.type] || 'Unknown';
    const actionIcon = MoneyLogTypeIcons[transaction.type];
    const actionColor = MoneyLogTypeColors[transaction.type] || '155, 155, 155';
    const actionTextColor = MoneyLogTypeColorsLight[transaction.type] || '200, 200, 200';
    const IconElement = (Icons as any)[actionIcon.charAt(0).toUpperCase() + actionIcon.slice(1).replace(/-([a-z])/g, (g: string) => g[1].toUpperCase())] || Icons['Bell'];

    return (
        <tr className={styles.transactionsTableRow}>
            <td className={styles.transactionDescription}>
                <div className={styles.transactionTableAction} style={{ '--icon-color': actionColor, '--text-color': actionTextColor } as React.CSSProperties} >
                    <IconElement size="0.9rem" color="currentColor" />
                    <span>{actionName}</span>
                </div>
            </td>
            <td className={styles.transactionDate}>
                {formatDate(new Date(transaction.createdAt))}
            </td>
            <td className={styles.transactionDescriptionText}>
                {transaction.description}
            </td>
            <td className={styles.transactionAmount} style={{ color: transaction.amount > 0 ? '#10b981' : '#ef4444' }}>
                {transaction.amount > 0 ? '+' : ''}{formatMoney(transaction.amount)}
            </td>
        </tr>
    );
}