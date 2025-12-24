import translate from '@shared/Translation/Translation';
import styles from '../../Styles/AtmInterface.module.css';
import InputField from '../InputField';
import TransactionsTable from './TransactionsTable';
import { useState } from 'react';
export default function TransactionsTab({ transactions }) {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredTransactions = transactions.filter((t) => t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return (<div className={styles.transactionsContainer}>
            <div className={styles.transactionsLeft}>
                <h2 className={styles.sectionTitle}>{translate('atm.transactions.title')}</h2>

                {/* Search and Filter */}
                <div className={styles.transactionsDataContainer}>
                    <div className={styles.transactionsSearch}>
                        <InputField type="text" placeholder={translate('atm.transactions.search')} value={searchTerm} onChange={(value) => setSearchTerm(value)} groupStyle={{ width: '100%' }}/>
                    </div>

                    {/* Transactions Table */}
                    <div className={styles.transactionsMain}>
                        <TransactionsTable transactions={filteredTransactions}/>
                    </div>
                </div>
            </div>
        </div>);
}
