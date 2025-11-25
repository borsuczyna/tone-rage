import { useEffect, useRef, useState, type CSSProperties } from 'react';
import * as Icons from 'lucide-react';
import styles from './Map.module.css';

interface Position {
	x: number;
	y: number;
}

interface Borders {
	minZoom?: number;
	maxZoom?: number;
	minX?: number;
	maxX?: number;
	minY?: number;
	maxY?: number;
}

interface Blip {
	position: Position;
	icon: keyof typeof Icons;
	label: string;
}

interface MapProps {
	image?: string | null;
	defaultZoom?: number;
	defaultPosition?: Position;
	borders?: Borders;
	blips?: Blip[];
	style?: CSSProperties;
	className?: string;
}

const DEFAULT_IMAGE = '/maps/gta5-map-grayscale.svg';

export default function Map({
	image = null,
	defaultZoom = 1,
	defaultPosition = { x: 0, y: 0 },
	borders = {},
	blips = [],
	style,
	className = ''
}: MapProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [zoom, setZoom] = useState(defaultZoom);
	const [position, setPosition] = useState(defaultPosition);
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });

	// Merge default borders with provided borders
	const {
		minZoom = 0.5,
		maxZoom = 5,
		minX = -Infinity,
		maxX = Infinity,
		minY = -Infinity,
		maxY = Infinity
	} = borders;

	const mapImage = image === null ? DEFAULT_IMAGE : image;

	// Clamp function to limit values between min and max
	const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

	// Handle mouse wheel zoom
	const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
		e.preventDefault();

		const delta = e.deltaY > 0 ? -0.1 : 0.1;
		const newZoom = clamp(zoom + delta, minZoom, maxZoom);
		setZoom(newZoom);
	};

	// Handle mouse down - start dragging
	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.button !== 0) return; // Only left mouse button
		setIsDragging(true);
		setDragStart({
			x: e.clientX - position.x,
			y: e.clientY - position.y
		});
	};

	// Handle mouse move - dragging
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isDragging) return;

		const newX = clamp(e.clientX - dragStart.x, minX, maxX);
		const newY = clamp(e.clientY - dragStart.y, minY, maxY);

		setPosition({ x: newX, y: newY });
	};

	// Handle mouse up - stop dragging
	const handleMouseUp = () => {
		setIsDragging(false);
	};

	// Add global mouse up listener to handle mouse up outside the component
	useEffect(() => {
		const handleGlobalMouseUp = () => {
			if (isDragging) {
				setIsDragging(false);
			}
		};

		window.addEventListener('mouseup', handleGlobalMouseUp);
		return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
	}, [isDragging]);

	// Prevent context menu on right click
	const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	// Calculate blip positions
	const getBlipScreenPosition = (blipPos: Position) => {
		return {
			x: position.x + blipPos.x * zoom,
			y: position.y + blipPos.y * zoom
		};
	};

	return (
		<div
			ref={containerRef}
			className={`${styles.mapContainer} ${className}`}
			style={style}
			onWheel={handleWheel}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onContextMenu={handleContextMenu}
		>
			{/* Map Image */}
			<div
				className={styles.mapImage}
				style={{
					backgroundImage: `url(${mapImage})`,
					transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
					cursor: isDragging ? 'grabbing' : 'grab'
				}}
			/>

			{/* Blips */}
			{blips.map((blip, index) => {
				const screenPos = getBlipScreenPosition(blip.position);
				const IconComponent = (Icons[blip.icon] || Icons.MapPin) as React.ComponentType<{ size?: number }>;

				return (
					<div
						key={index}
						className={styles.blip}
						style={{
							left: `${screenPos.x}px`,
							top: `${screenPos.y}px`
						}}
						title={blip.label}
					>
						<div className={styles.blipIcon}>
							<IconComponent size={24} />
						</div>
						<div className={styles.blipLabel}>{blip.label}</div>
					</div>
				);
			})}
		</div>
	);
}
