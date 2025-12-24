import styles from '../../Styles/AtmInterface.module.css';
import translate from "@shared/Translation/Translation";
import Button from '../Button';
export default function TablePaginationControls({ page, setPage, totalItems, itemsPerPage }) {
    return (<div className={styles.tablePaginationControls}>
            <span className={styles.paginationInfo}>
                {translate('atm.transactions.pageInfo', {
            'page': (page + 1).toString(),
            'total': Math.ceil(totalItems / itemsPerPage).toString()
        })}
            </span>

            <div className={styles.paginationButtons}>
                <Button variant="glass" size="small" disabled={page === 0} onClick={() => setPage(page - 1)}>
                    Previous
                </Button>
                <Button variant="primary" size="small" disabled={(page + 1) * itemsPerPage >= totalItems} onClick={() => setPage(page + 1)}>
                    Next
                </Button>
            </div>
        </div>);
}
