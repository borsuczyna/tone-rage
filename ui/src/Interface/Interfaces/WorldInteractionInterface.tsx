import { useState, useEffect } from 'react';
import styles from './Styles/WorldInteractionInterface.module.css';
import type { WorldInteractionItem } from '@shared/Models/WorldInteraction';
import * as Icons from 'lucide-react';
import csx from 'src/Utils/MergeClass';
import { fetchClientData, triggerEvent } from 'src/Hooks/Fetch';
import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';

function InteractionItem({ icon, label, active }: WorldInteractionItem & { active: boolean }) {
    const IconComponent = (Icons as any)[icon];
    
    return (
        <div className={csx(styles.interactionItem, active && styles.active)}>
            {IconComponent && (
                <div className={styles.iconBox}>
                    <IconComponent size={'1rem'} fill={'currentColor'} />
                </div>
            )}
            <span>{label}</span>
        </div>
    );
}

export default function WorldInteractionInterface() {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [interactionItems, setInteractionItems] = useState<WorldInteractionItem[]>([]);
    const { setInterfaceVisible } = useInterfaceVisibility();

    useEffect(() => {
        async function fetchInteractions() {
            const interactions = await fetchClientData<WorldInteractionItem[]>('worldInteraction:getInteractions', null);
            if (interactions) {
                setInteractionItems(interactions);
                setActiveIndex(0);
            }
        }

        fetchInteractions();
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                setActiveIndex(prevIndex => 
                    prevIndex > 0 ? prevIndex - 1 : interactionItems.length - 1
                );
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                setActiveIndex(prevIndex => 
                    prevIndex < interactionItems.length - 1 ? prevIndex + 1 : 0
                );
            } else if (event.key === 'Enter') {
                event.preventDefault();
                onInteractionSelected();
            }
        };

        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();
            if (event.deltaY > 0) {
                // Scrolling down
                setActiveIndex(prevIndex => 
                    prevIndex < interactionItems.length - 1 ? prevIndex + 1 : 0
                );
            } else {
                // Scrolling up
                setActiveIndex(prevIndex => 
                    prevIndex > 0 ? prevIndex - 1 : interactionItems.length - 1
                );
            }
        };

        const handleClick = () => {
            onInteractionSelected();
        }

        const onInteractionSelected = () => {
            triggerEvent('worldInteraction:onSelect', activeIndex);
            setInterfaceVisible('WorldInteractionInterface', false);
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('wheel', handleWheel);
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('click', handleClick);
        };
    }, [interactionItems.length, activeIndex, setInterfaceVisible]);


    return (
        <div
            className={styles.worldInteraction}
            style={{ '--selected-index': activeIndex } as React.CSSProperties}
        >
            {interactionItems.map((item, index) => {
                return <InteractionItem key={index} icon={item.icon} label={item.label} active={activeIndex === index} />;
            })}
        </div>
    )
}