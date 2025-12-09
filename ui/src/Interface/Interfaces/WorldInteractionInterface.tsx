import { useState, useEffect } from 'react';
import styles from './Styles/WorldInteractionInterface.module.css';
import type { WorldInteractionItem } from '@shared/Models/WorldInteraction';
import * as Icons from 'lucide-react';
import csx from 'src/Utils/MergeClass';
import { fetchClientData, triggerEvent } from 'src/Hooks/Fetch';
import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import { useRageEvent } from 'src/Hooks/RageEventProvider';
import { getRemAsPx } from '../Main';

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
    const [interactionPosition, setInteractionPosition] = useState<{ x: number; y: number }>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const [lineTarget, setLineTarget] = useState<{ x: number; y: number }>({ 
        x: window.innerWidth * 0.5 + getRemAsPx(5), 
        y: window.innerHeight * 0.5 + getRemAsPx(1.15)
    });
    const [isHiding, setIsHiding] = useState<boolean>(false);
    const { setInterfaceVisible } = useInterfaceVisibility();

    useEffect(() => {
        const updateLineTarget = () => {
            setLineTarget({ 
                x: window.innerWidth * 0.5 + getRemAsPx(5),
                y: window.innerHeight * 0.5 + getRemAsPx(1.15)
            });
        };

        window.addEventListener('resize', updateLineTarget);
        return () => {
            window.removeEventListener('resize', updateLineTarget);
        };
    }, []);

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
            if (isHiding) return; // Prevent interactions during hiding animation
            
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
            if (isHiding) return; // Prevent interactions during hiding animation
            
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
            if (isHiding) return; // Prevent interactions during hiding animation
            onInteractionSelected();
        }

        const onInteractionSelected = () => {
            setIsHiding(true);
            triggerEvent('worldInteraction:onSelect', activeIndex);
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('wheel', handleWheel);
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('click', handleClick);
        };
    }, [interactionItems.length, activeIndex, setInterfaceVisible, isHiding]);

    useRageEvent('worldInteraction:updatePosition', (position: { x: number; y: number }) => {
        setInteractionPosition(position);
    });

    useRageEvent('worldInteraction:playHideAnimation', () => {
        setIsHiding(true);
    });

    return (
        <>
            <div
                className={`${styles.worldInteraction} ${isHiding ? styles.hiding : ''}`}
                style={{ '--selected-index': activeIndex } as React.CSSProperties}
            >
                {interactionItems.map((item, index) => {
                    return <InteractionItem key={index} icon={item.icon} label={item.label} active={activeIndex === index} />;
                })}
            </div>

            {interactionPosition ? (<>
                <svg
                    width="100vw"
                    height="100vh"
                    className={`${styles.interactionLine} ${isHiding ? styles.hiding : ''}`}
                >
                    <line
                        x1={interactionPosition.x}
                        y1={interactionPosition.y}
                        x2={lineTarget.x}
                        y2={lineTarget.y}
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity={0.8}
                    />
                </svg>
                <svg
                    width="89"
                    height="89"
                    viewBox="0 0 89 89"
                    fill="none"
                    className={`${styles.interactionDiamond} ${isHiding ? styles.hiding : ''}`}
                    style={{ '--dot-x': Math.floor(interactionPosition.x) + 'px', '--dot-y': Math.floor(interactionPosition.y) + 'px' } as React.CSSProperties}
                >
                    <path d="M44.2783 7.7782L7.77832 44.2782L44.2783 80.7782L80.7783 44.2782L44.2783 7.7782Z" stroke="white" stroke-width="11"/>
                </svg>
            </>) : null}
        </>
    )
}