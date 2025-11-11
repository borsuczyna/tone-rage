import { useState } from 'react';
import styles from './Styles/SpawnSelectionInterface.module.css';
import * as Icons from 'lucide-react';
import translate from '@shared/Translation/Translation';
import Button from './Components/Button';
import { spawnData, type SpawnResponse } from '@shared/SpawnsData';
import { fetchServerData, triggerEvent } from 'src/Hooks/Fetch';
import { addNotification } from 'src/Hooks/NotificationsProvider';
import { loginMusicManager } from 'src/Utils/LoginMusicManager';

export default function SpawnSelectionInterface() {
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
    const [selectedSpawn, setSelectedSpawn] = useState<[number, number] | null>(null);
    const [isDisappearing, setIsDisappearing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toggleCategory = (categoryId: number) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    const handleSpawnSelect = (categoryId: number, locationId: number) => {
        setSelectedSpawn([categoryId, locationId]);
        triggerEvent('spawn:preview', [categoryId, locationId]);
    };

    const handleConfirmSpawn = async () => {
        if (!selectedSpawn) return;

        setIsLoading(true);
        setIsDisappearing(true);
        triggerEvent('spawn:select');

        // Fade out login music
        loginMusicManager.fadeOutAndStop(2000);

        const response = await fetchServerData<SpawnResponse>('spawn:select', selectedSpawn);

        if (!response.success) {
            addNotification(translate('spawn.notificationTitle'), translate(response.message || 'spawn.invalidLocation'), 'error');
            setIsDisappearing(false);
            setIsLoading(false);
        }
    };

    return (
        <div className={`${styles.container} ${isDisappearing ? styles.disappearing : ''}`}>
            <div className={styles.spawnPanel}>
                <div className={styles.header}>
                    <h1>{translate('spawn.title')}</h1>
                    <p>{translate('spawn.subtitle')}</p>
                </div>

                <div className={styles.categoryList}>
                    {spawnData.map((category, index) => (
                        <div key={index} className={styles.categoryItem}>
                            <button
                                className={styles.categoryButton}
                                onClick={() => toggleCategory(index)}
                            >
                                <div className={styles.categoryHeader}>
                                    <Icons.MapPin size='1.3rem' />
                                    <span>{category.name}</span>
                                </div>
                                <Icons.ChevronDown 
                                    size='1.3rem' 
                                    className={`${styles.chevron} ${expandedCategories.has(index) ? styles.expanded : ''}`}
                                />
                            </button>

                            <div className={`${styles.locationListWrapper} ${expandedCategories.has(index) ? styles.expanded : ''}`}>
                                <div className={styles.locationList}>
                                    {category.locations.map((location, locationIndex) => (
                                        <button
                                            key={locationIndex}
                                            className={`${styles.locationButton} ${selectedSpawn?.[0] === index && selectedSpawn?.[1] === locationIndex ? styles.selected : ''}`}
                                            onClick={() => handleSpawnSelect(index, locationIndex)}
                                        >
                                            <Icons.MapPin size='1rem' />
                                            <span>{location.name}</span>
                                            {selectedSpawn?.[0] === index && selectedSpawn?.[1] === locationIndex && (
                                                <Icons.Check size='1rem' className={styles.checkIcon} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.actions}>
                    <Button 
                        variant="primary" 
                        onClick={handleConfirmSpawn}
                        disabled={!selectedSpawn}
                        loading={isLoading}
                        style={{ width: '100%' }}
                    >
                        <Icons.Check size='1rem' />
                        {translate('spawn.confirm')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
