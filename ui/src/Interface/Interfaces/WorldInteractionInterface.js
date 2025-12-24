import { useState, useEffect, useCallback } from 'react';
import styles from './Styles/WorldInteractionInterface.module.css';
import * as Icons from 'lucide-react';
import csx from 'src/Utils/MergeClass';
import { triggerEvent } from 'src/Hooks/Fetch';
import { useRageEvent } from 'src/Hooks/RageEventProvider';
import { getRemAsPx } from '../Main';
import translate from '@shared/Translation/Translation';
function InteractionItem({ icon, label, active }) {
    const IconComponent = Icons[icon];
    return (<div className={csx(styles.interactionItem, active && styles.active)}>
            {IconComponent && (<div className={styles.iconBox}>
                    <IconComponent size={'1rem'} fill={'currentColor'}/>
                </div>)}
            <span>{label}</span>
        </div>);
}
export default function WorldInteractionInterface() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [interactionItems, setInteractionItems] = useState([]);
    const [interactionPosition, setInteractionPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const [hasActiveEntity, setHasActiveEntity] = useState(false);
    const [menuBorders, setMenuBorders] = useState({
        left: window.innerWidth * 0.5 + getRemAsPx(5),
        right: window.innerWidth * 0.5 + getRemAsPx(25),
        y: window.innerHeight * 0.5 + getRemAsPx(1.15)
    });
    const [isHiding, setIsHiding] = useState(false);
    useEffect(() => {
        const updateLineTarget = () => {
            setMenuBorders({
                left: window.innerWidth * 0.5 + getRemAsPx(5),
                right: window.innerWidth * 0.5 + getRemAsPx(25),
                y: window.innerHeight * 0.5 + getRemAsPx(1.15)
            });
        };
        window.addEventListener('resize', updateLineTarget);
        return () => {
            window.removeEventListener('resize', updateLineTarget);
        };
    }, []);
    useRageEvent('worldInteraction:updatePosition', useCallback((position) => {
        setInteractionPosition(position);
        setHasActiveEntity(true);
    }, []));
    useRageEvent('worldInteraction:updateInteractions', useCallback((items) => {
        setInteractionItems(items);
        setActiveIndex(0);
        setIsHiding(false);
        setHasActiveEntity(items.length > 0);
    }, []));
    useRageEvent('worldInteraction:playHideAnimation', useCallback(() => {
        setIsHiding(true);
    }, []));
    useRageEvent('worldInteraction:navigate', useCallback((direction) => {
        setActiveIndex(prevIndex => {
            const itemCount = interactionItems.length;
            if (itemCount === 0)
                return prevIndex;
            let newIndex = prevIndex + direction;
            if (newIndex < 0)
                newIndex = itemCount - 1;
            if (newIndex >= itemCount)
                newIndex = 0;
            return newIndex;
        });
    }, [interactionItems.length]));
    useRageEvent('worldInteraction:select', useCallback(() => {
        setIsHiding(true);
        const selectedItem = interactionItems[activeIndex];
        if (!selectedItem) {
            console.error('No interaction item selected');
            return;
        }
        triggerEvent('worldInteraction:onSelect', selectedItem.index);
    }, [interactionItems, activeIndex]));
    useEffect(() => {
        triggerEvent('worldInteraction:isReady');
    }, []);
    const isPointInsideMenu = interactionPosition.x >= menuBorders.left;
    return (<div className={csx(!hasActiveEntity && styles.noActiveEntity, isPointInsideMenu && styles.pointInsideMenu)}>
            <div className={csx(styles.vinette, isHiding && styles.hiding)}>
                <div className={styles.worldInteractionText}>
                    <h3>{translate('worldInteraction.title')}</h3>
                    <span>{translate('worldInteraction.instructions')}</span>
                </div>
            </div>

            <div className={csx(styles.worldInteraction, isHiding && styles.hiding)} style={{ '--selected-index': activeIndex }}>
                {interactionItems.map((item, index) => {
            return <InteractionItem key={index} icon={item.icon} label={item.label} active={activeIndex === index}/>;
        })}
            </div>

            {interactionPosition ? (<>
                <svg width="100vw" height="100vh" className={csx(styles.interactionLine, isHiding && styles.hiding)}>
                    <line x1={interactionPosition.x} y1={interactionPosition.y} x2={menuBorders.left} y2={menuBorders.y} stroke="white" strokeWidth="2" strokeDasharray="5,5" opacity={0.8}/>
                </svg>
                <svg width="89" height="89" viewBox="0 0 89 89" fill="none" className={csx(styles.interactionDiamond, isHiding && styles.hiding)} style={{ '--dot-x': Math.floor(interactionPosition.x) + 'px', '--dot-y': Math.floor(interactionPosition.y) + 'px' }}>
                    <path d="M44.2783 7.7782L7.77832 44.2782L44.2783 80.7782L80.7783 44.2782L44.2783 7.7782Z" stroke="white" stroke-width="11"/>
                </svg>
            </>) : null}
        </div>);
}
