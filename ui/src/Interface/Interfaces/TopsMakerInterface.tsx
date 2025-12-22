import { useState } from 'react';
import styles from './Styles/TopsMakerInterface.module.css';
import csx from 'src/Utils/MergeClass';
import { useRageEvent } from 'src/Hooks/RageEventProvider';
import { triggerEvent } from 'src/Hooks/Fetch';

export default function TopsMakerInterface() {
    // const femaleUndershirts = [0, 1, 2, 5, 15, 20, 21, 93];
    // const femaleTorsos = [0, 2, 3, 4, 5, 6, 12, 15, 24, 29]
    const maleUndershirts = [0, 1, 2, 5, 6, 7, 10, 11, 15, 23];
    const maleTorsos = [0, 1, 2, 3, 5, 6, 8, 14, 15, 21, 23];
    const path = '/topsmaker/96px-Clothing_M_{cid}_{id}.jpg';
    const undershirts = maleUndershirts;
    const [activeUndershirt, setActiveUndershirt] = useState<number | null>(null);
    const [activeTorso, setActiveTorso] = useState<number | null>(null);
    const [availableUndershirts, setAvailableUndershirts] = useState<number[]>([]);
    
    useRageEvent('TopsMakerInterface:SetActiveUndershirt', ({ itemId }) => {
        setActiveUndershirt(itemId);
    });

    useRageEvent('TopsMakerInterface:SetActiveTorso', ({ itemId }) => {
        setActiveTorso(itemId);
    });

    useRageEvent('TopsMakerInterface:SetUndershirts', ({ itemIds }) => {
        setAvailableUndershirts(itemIds);
    });

    useRageEvent('Clipboard:CopyText', ({ text }) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });

    const _setActiveUndershirt = (id: number) => {
        setActiveUndershirt(id);
        triggerEvent('TopsMakerInterface:SetActiveUndershirt', { itemId: id });
    }

    const _setActiveTorso = (id: number) => {
        setActiveTorso(id);
        triggerEvent('TopsMakerInterface:SetActiveTorso', { itemId: id });
    }

    return (
        <div className={styles.container}>
            <div className={styles.undershirtsContainer}>
                {undershirts.map((id) => (
                    <div key={id} className={csx(styles.undershirtItem, activeUndershirt === id && styles.active, availableUndershirts.includes(id) && styles.available)} onClick={() => _setActiveUndershirt(id)}>
                        <img src={path.replace('{cid}', '8').replace('{id}', id.toString())} alt={`Undershirt ${id}`} />
                    </div>
                ))}
            </div>

            <div className={styles.undershirtsContainer}>
                {maleTorsos.map((id) => (
                    <div key={id} className={csx(styles.undershirtItem, activeTorso === id && styles.active)} onClick={() => _setActiveTorso(id)}>
                        <img src={path.replace('{cid}', '3').replace('{id}', id.toString())} alt={`Torso ${id}`} />
                    </div>
                ))}
            </div>

            <button className={styles.button} onClick={() => {
                triggerEvent('TopsMakerInterface:Prev');
            }}>Close</button>
            <button className={styles.button} onClick={() => {
                triggerEvent('TopsMakerInterface:Next');
            }}>Next</button>
            <button className={styles.button} onClick={() => {
                triggerEvent('TopsMakerInterface:CopyToClipboard');
            }}>Copy to Clipboard</button>
        </div>
    )
}