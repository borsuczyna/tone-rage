import { useEffect, useState } from 'react';
import styles from './styles/TestInterface.module.css'
import { useRageEvent } from '../../Hooks/RageEventProvider';
import { fetchClientData, fetchServerData } from '../../Hooks/Fetch';

export default function TestInterface() {
    const [test, setTest] = useState(0);
    const [clientResponse, setClientResponse] = useState<string>('');
    const [serverResponse, setServerResponse] = useState<string>('');

    useRageEvent('testEvent', (value: number) => {
        setTest(value);
    });

    useEffect(() => {
        async function fetchClientDataAsync() {
            const response = await fetchClientData<string>('getClientInfo', { infoType: 'version' });
            setClientResponse(response);
        }

        async function fetchServerDataAsync() {
            const response = await fetchServerData<string>('getClientInfo', { infoType: 'version' });
            setServerResponse(response);
        }

        fetchClientDataAsync();
        fetchServerDataAsync();
    }, []);

    return (
        <div className={styles.main}>
            <h1>Test UI</h1>
            <p>This is a test interface.</p>

            <span>Count {test}</span><br/>
            <button onClick={() => {setTest(test + 1)}}>Increase</button><br/>
            <span>Client version: {clientResponse === '' ? 'Loading...' : clientResponse}</span><br/>
            <span>Server version: {serverResponse === '' ? 'Loading...' : serverResponse}</span>
        </div>
    )
}