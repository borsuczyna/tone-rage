import { useState } from 'react';
import styles from './TestInterface.module.css'
import { useRageEvent } from '../../Hooks/RageEventProvider';

export default function TestInterface() {
    const [test, setTest] = useState(0);

    useRageEvent('testEvent', (value: number) => {
        setTest(value);
    });

    return (
        <div className={styles.main}>
            <h1>Test UI</h1>
            <p>This is a test interface.</p>

            <span>Count {test}</span>
            <button onClick={() => {setTest(test + 1)}}>Increase</button>
        </div>
    )
}