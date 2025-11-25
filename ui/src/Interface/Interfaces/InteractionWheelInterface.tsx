import { useState, useEffect, useCallback, useMemo } from 'react';
import { useInterfaceVisibility, setInterfaceVisible } from 'src/Hooks/InterfaceVisibilityProvider';
import { useRageEvent } from 'src/Hooks/RageEventProvider';
import { fetchClientData, triggerEvent } from 'src/Hooks/Fetch';
import styles from './Styles/InteractionWheelInterface.module.css';
import * as Icons from 'lucide-react';
import type { InteractionWheelConfig, InteractionWheelData, InteractionWheelResponse } from '@shared/Models/InteractionWheel';

// Type for lucide-react icons
type LucideIconName = keyof typeof Icons;

export default function InteractionWheelInterface() {
    const { isInterfaceVisible } = useInterfaceVisibility();
    const [interactions, setInteractions] = useState<InteractionWheelData[]>([]);
    const [config, setConfig] = useState<InteractionWheelConfig>({ title: 'SELECT', subtitle: 'ACTION' });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });
    const [hiding, setHiding] = useState(false);

    // Listen for show event from client
    useRageEvent('interactionWheel:show', (data: { 
        interactions: InteractionWheelData[]; 
        title?: string; 
        subtitle?: string;
    }) => {
        setInteractions(data.interactions);
        setConfig({
            title: data.title || 'SELECT',
            subtitle: data.subtitle || 'ACTION'
        });
        setHiding(false);
        setHoveredIndex(null);
    });

    // Listen for hide animation event
    useRageEvent('interactionWheel:hide', () => {
        setHiding(true);
    });

    // Hide interface after animation completes (1 second)
    useEffect(() => {
        if (hiding) {
            const timeout = setTimeout(() => {
                setInterfaceVisible('InteractionWheelInterface', false);
                setHiding(false);
                setInteractions([]);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [hiding]);

    // On first render, fetch the interactions from the client
    useEffect(() => {
        const fetchInteractions = async () => {
            const data = await fetchClientData<InteractionWheelResponse>('interactionWheel:getInteractions', null);
            setInteractions(data.interactions);
            setConfig(data.config);
        };

        fetchInteractions();
    }, [setInteractions]);

    // Calculate center position on mount and resize
    useEffect(() => {
        const updateCenter = () => {
            setCenterPos({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            });
        };

        updateCenter();
        window.addEventListener('resize', updateCenter);
        return () => window.removeEventListener('resize', updateCenter);
    }, []);

    // Calculate which segment is being hovered based on mouse angle from center
    const calculateHoveredSegment = useCallback((mouseX: number, mouseY: number) => {
        if (interactions.length === 0) return null;

        const dx = mouseX - centerPos.x;
        const dy = mouseY - centerPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Dead zone in center - require minimum distance, max is 50vw
        const minDistance = 70;
        const maxDistance = window.innerWidth / 2; // 50vw
        
        if (distance < minDistance || distance > maxDistance) {
            return null;
        }

        // Calculate angle (0 at top, clockwise)
        let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        const segmentAngle = 360 / interactions.length;
        const index = Math.floor(angle / segmentAngle) % interactions.length;
        
        return index;
    }, [centerPos, interactions.length]);

    // Handle mouse movement
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            const index = calculateHoveredSegment(e.clientX, e.clientY);
            setHoveredIndex(index);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [calculateHoveredSegment]);

    // Handle click to select action
    const handleClick = useCallback(() => {
        if (hoveredIndex !== null && interactions[hoveredIndex] && !hiding) {
            const selectedAction = interactions[hoveredIndex];
            console.log('Selected action:', selectedAction);
            
            // Trigger event to client with selected action id
            triggerEvent('interactionWheel:onSelect', { id: selectedAction.id });
        }
    }, [hoveredIndex, interactions, hiding]);

    // Handle escape key to close wheel
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !hiding) {
                triggerEvent('interactionWheel:onClose', {});
                setHiding(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hiding]);

    // Add click listener
    useEffect(() => {
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [handleClick]);

    // Calculate segment positions
    const segmentData = useMemo(() => {
        if (interactions.length === 0) return [];

        const segmentAngle = 360 / interactions.length;
        const innerRadius = 70;
        const outerRadius = 165;
        // Place icons at the center of segment arc (midpoint between inner and outer)
        const iconRadius = (innerRadius + outerRadius) / 2;

        return interactions.map((interaction, index) => {
            // Place icon at CENTER of segment (add half segment angle)
            const angle = ((index + 0.5) * segmentAngle - 90) * (Math.PI / 180);
            const x = Math.cos(angle) * iconRadius;
            const y = Math.sin(angle) * iconRadius;
            
            return {
                ...interaction,
                x,
                y,
                startAngle: index * segmentAngle,
                endAngle: (index + 1) * segmentAngle
            };
        });
    }, [interactions]);

    // Generate SVG path for segment
    const createSegmentPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
        const startRad = (startAngle - 90) * (Math.PI / 180);
        const endRad = (endAngle - 90) * (Math.PI / 180);
        
        const x1 = Math.cos(startRad) * outerRadius;
        const y1 = Math.sin(startRad) * outerRadius;
        const x2 = Math.cos(endRad) * outerRadius;
        const y2 = Math.sin(endRad) * outerRadius;
        const x3 = Math.cos(endRad) * innerRadius;
        const y3 = Math.sin(endRad) * innerRadius;
        const x4 = Math.cos(startRad) * innerRadius;
        const y4 = Math.sin(startRad) * innerRadius;
        
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;
        
        return `
            M ${x1} ${y1}
            A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}
            L ${x3} ${y3}
            A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
            Z
        `;
    };

    if (!isInterfaceVisible('InteractionWheelInterface')) return null;

    const hoveredInteraction = hoveredIndex !== null ? interactions[hoveredIndex] : null;

    return (
        <div className={`${styles.container} ${hiding ? styles.hiding : ''}`}>
            {/* Background overlay */}
            <div className={styles.overlay} />

            {/* Main wheel */}
            <div className={styles.wheel}>
                <svg 
                    className={styles.wheelSvg} 
                    viewBox="-200 -200 400 400"
                >
                    {/* Glow filter */}
                    <defs>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                        <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
                            <feOffset dx="0" dy="2" result="offsetBlur"/>
                            <feComposite in="SourceGraphic" in2="offsetBlur" operator="over"/>
                        </filter>
                    </defs>


                    {/* Segments */}
                    {segmentData.map((segment, index) => {
                        const isHovered = hoveredIndex === index;
                        const gap = 2; // Gap between segments in degrees
                        
                        return (
                            <g key={segment.id}>
                                <path
                                    d={createSegmentPath(
                                        segment.startAngle + gap / 2,
                                        segment.endAngle - gap / 2,
                                        70,
                                        isHovered ? 175 : 165
                                    )}
                                    className={`${styles.segment} ${isHovered ? styles.segmentHovered : ''}`}
                                    style={{
                                        fill: isHovered 
                                            ? segment.color || '#3b82f6'
                                            : 'rgba(40, 40, 40, 0.85)',
                                        filter: isHovered ? 'url(#glow)' : undefined
                                    }}
                                />
                            </g>
                        );
                    })}

                    {/* Center circle */}
                    <circle 
                        cx="0" 
                        cy="0" 
                        r="55" 
                        className={styles.centerCircle}
                    />

                    {/* Icons */}
                    {segmentData.map((segment, index) => {
                        const IconComponent = Icons[segment.icon as LucideIconName] as React.ComponentType<{ size?: number; strokeWidth?: number }>;
                        if (!IconComponent) return null;

                        const isHovered = hoveredIndex === index;
                        const iconSize = 40;
                        
                        return (
                            <g 
                                key={`icon-${segment.id}`}
                                transform={`translate(${segment.x}, ${segment.y})`}
                            >
                                <foreignObject
                                    x={-iconSize / 2}
                                    y={-iconSize / 2}
                                    width={iconSize}
                                    height={iconSize}
                                    className={styles.iconContainer}
                                >
                                    <div 
                                        className={`${styles.icon} ${isHovered ? styles.iconHovered : ''}`}
                                        style={{ width: iconSize, height: iconSize }}
                                    >
                                        <IconComponent size={22} strokeWidth={2} />
                                    </div>
                                </foreignObject>
                            </g>
                        );
                    })}
                </svg>

                {/* Center content */}
                <div 
                    className={styles.centerContent}
                    style={hoveredInteraction ? {
                        '--accent-color': hoveredInteraction.color || '#3b82f6'
                    } as React.CSSProperties : undefined}
                >
                    {hoveredInteraction ? (
                        <div className={styles.actionLabel}>{hoveredInteraction.label}</div>
                    ) : (
                        <>
                            <div className={styles.categoryLabel}>{config.title}</div>
                            <div className={styles.categorySubLabel}>{config.subtitle}</div>
                        </>
                    )}
                </div>
            </div>

            {/* Direction indicator (for debugging, can be removed) */}
            <div 
                className={styles.cursor}
                style={{
                    left: mousePos.x,
                    top: mousePos.y
                }}
            />
        </div>
    );
}
