import { useState } from 'react';
import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import styles from './Styles/SpawnSelectionInterface.module.css';
import * as Icons from 'lucide-react';
import translate from '@shared/Translation/Translation';
import Button from './Components/Button';

interface SpawnLocation {
    id: string;
    name: string;
    category: string;
}

interface SpawnCategory {
    id: string;
    name: string;
    locations: SpawnLocation[];
}

const spawnData: SpawnCategory[] = [
    {
        id: 'los-santos',
        name: 'Los Santos',
        locations: [
            { id: 'ls-downtown', name: 'Downtown', category: 'los-santos' },
            { id: 'ls-other', name: 'Other', category: 'los-santos' }
        ]
    },
    {
        id: 'bone-county',
        name: 'Bone County',
        locations: [
            { id: 'bc-other', name: 'Other', category: 'bone-county' }
        ]
    }
];

export default function SpawnSelectionInterface() {
    const { isInterfaceVisible } = useInterfaceVisibility();
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [selectedSpawn, setSelectedSpawn] = useState<string | null>(null);

    const toggleCategory = (categoryId: string) => {
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

    const handleSpawnSelect = (locationId: string) => {
        setSelectedSpawn(locationId);
    };

    const handleConfirmSpawn = () => {
        if (!selectedSpawn) return;
        
        // Send the selected spawn to the server
        if (typeof mp !== 'undefined') {
            mp.trigger('spawn:select', selectedSpawn);
        }
        console.log('Selected spawn:', selectedSpawn);
    };

    if (!isInterfaceVisible('SpawnSelectionInterface')) return null;

    return (
        <div className={styles.container}>
            <div className={styles.spawnPanel}>
                <div className={styles.header}>
                    <h1>{translate('spawn.title')}</h1>
                    <p>{translate('spawn.subtitle')}</p>
                </div>

                <div className={styles.categoryList}>
                    {spawnData.map(category => (
                        <div key={category.id} className={styles.categoryItem}>
                            <button
                                className={styles.categoryButton}
                                onClick={() => toggleCategory(category.id)}
                            >
                                <div className={styles.categoryHeader}>
                                    <Icons.MapPin size={18} />
                                    <span>{category.name}</span>
                                </div>
                                <Icons.ChevronDown 
                                    size={18} 
                                    className={`${styles.chevron} ${expandedCategories.has(category.id) ? styles.expanded : ''}`}
                                />
                            </button>

                            <div className={`${styles.locationListWrapper} ${expandedCategories.has(category.id) ? styles.expanded : ''}`}>
                                <div className={styles.locationList}>
                                    {category.locations.map(location => (
                                        <button
                                            key={location.id}
                                            className={`${styles.locationButton} ${selectedSpawn === location.id ? styles.selected : ''}`}
                                            onClick={() => handleSpawnSelect(location.id)}
                                        >
                                            <Icons.MapPin size={16} />
                                            <span>{location.name}</span>
                                            {selectedSpawn === location.id && (
                                                <Icons.Check size={16} className={styles.checkIcon} />
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
                        style={{ width: '100%' }}
                    >
                        <Icons.Check size={16} />
                        {translate('spawn.confirm')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
