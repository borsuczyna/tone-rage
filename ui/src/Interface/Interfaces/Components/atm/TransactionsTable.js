import translate from '@shared/Translation/Translation';
import styles from '../../Styles/AtmInterface.module.css';
import TransactionTableItem from './TransactionTableItem';
import { useState } from 'react';
import TablePaginationControls from './TablePaginationControls';
export default function TransactionsTable({ transactions }) {
    if (transactions.length === 0) {
        return (<div className={styles.noTransactions}>
                {translate('atm.dashboard.noTransactions')}
            </div>);
    }
    const [page, setPage] = useState(0);
    const itemsPerPage = 6;
    const paginatedTransactions = transactions.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
    return (<>
            <table className={styles.transactionsTable}>
                <thead>
                    <tr className={styles.transactionsTableHeader}>
                        <th>{translate('atm.transactions.action')}</th>
                        <th>{translate('atm.transactions.date')}</th>
                        <th>{translate('atm.transactions.description')}</th>
                        <th>{translate('atm.transactions.amount')}</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedTransactions.map((transaction, index) => (<TransactionTableItem key={index} transaction={transaction}/>))}
                </tbody>
            </table>

            {transactions.length > itemsPerPage && <TablePaginationControls page={page} setPage={setPage} totalItems={transactions.length} itemsPerPage={itemsPerPage}/>}
        </>);
}
