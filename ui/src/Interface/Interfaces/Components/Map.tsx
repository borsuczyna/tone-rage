import { useRef, useEffect, useState, useCallback } from 'react';
import * as Icons from 'lucide-react';
import styles from './Map.module.css';

interface Position {
	x: number;
	y: number;
}

interface Blip {
	position: Position;
	icon: string; // lucide-react icon name (e.g., 'MapPin', 'Home', 'DollarSign')
	color?: string; // hex color for the icon (e.g., '#ff0000', '#00ff00')
	label: string;
	id?: string | number;
}

interface Borders {
	minZoom?: number;
	maxZoom?: number;
	minX?: number;
	maxX?: number;
	minY?: number;
	maxY?: number;
}

interface MapProps {
	image?: string | null;
	defaultZoom?: number;
	defaultPosition?: Position;
	borders?: Borders;
	blips?: Blip[];
	mapSize?: number;
	blipSize?: number;
	zoomSensitivity?: number;
}

const DEFAULT_IMAGE = '/images/map-grayscale.png';
const DEFAULT_MAP_SIZE = 6000; // GTA 5 map coordinate system size
const DEFAULT_BLIP_SIZE = 32; // Base size for blip icons in pixels
const DEFAULT_ZOOM_SENSITIVITY = 1000; // Higher = slower zoom

export default function Map({
	image = null,
	defaultZoom = 1,
	defaultPosition = { x: 0, y: 0 },
	borders = {},
	blips = [],
	mapSize = DEFAULT_MAP_SIZE,
	blipSize = DEFAULT_BLIP_SIZE,
	zoomSensitivity = DEFAULT_ZOOM_SENSITIVITY
}: MapProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const [zoom, setZoom] = useState(defaultZoom);
	const [position, setPosition] = useState(defaultPosition);
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
	const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

	// Default borders
	const {
		minZoom = 0.5,
		maxZoom = 5,
		minX = -Infinity,
		maxX = Infinity,
		minY = -Infinity,
		maxY = Infinity
	} = borders;

	// Update container size on mount and resize
	useEffect(() => {
		const updateSize = () => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				setContainerSize({ width: rect.width, height: rect.height });
			}
		};

		updateSize();
		window.addEventListener('resize', updateSize);
		return () => window.removeEventListener('resize', updateSize);
	}, []);

	// Clamp position within borders
	const clampPosition = useCallback(
		(pos: Position, currentZoom: number): Position => {
			const maxSize = Math.max(containerSize.width, containerSize.height);
			const mapPixelSize = maxSize * currentZoom;
			const mapX = (pos.x / mapSize) * mapPixelSize;
			const mapY = (pos.y / mapSize) * mapPixelSize;
			const mapLeft = containerSize.width / 2 - mapPixelSize / 2 - mapX;
			const mapTop = containerSize.height / 2 - mapPixelSize / 2 + mapY;
			const mapRight = mapLeft + mapPixelSize;
			const mapBottom = mapTop + mapPixelSize;

			let newX = pos.x;
			let newY = pos.y;

			// Apply coordinate boundaries
			newX = Math.max(minX, Math.min(maxX, newX));
			newY = Math.max(minY, Math.min(maxY, newY));

			// Keep map within container bounds
			const bounds = {
				x: 0,
				y: 0
			};

			if (mapRight + bounds.x < containerSize.width) {
				newX += ((mapRight + bounds.x - containerSize.width) * mapSize) / mapPixelSize;
			}

			if (mapLeft - bounds.x > 0) {
				newX += ((mapLeft - bounds.x) * mapSize) / mapPixelSize;
			}

			if (mapBottom + bounds.y < containerSize.height) {
				newY -= ((mapBottom + bounds.y - containerSize.height) * mapSize) / mapPixelSize;
			}

			if (mapTop - bounds.y > 0) {
				newY -= ((mapTop - bounds.y) * mapSize) / mapPixelSize;
			}

			return { x: newX, y: newY };
		},
		[containerSize, minX, maxX, minY, maxY, mapSize]
	);

	// Handle mouse wheel for zooming
	const handleWheel = useCallback(
		(e: WheelEvent) => {
			e.preventDefault();

			if (!containerRef.current) return;

			const delta = -e.deltaY / zoomSensitivity;
			const rect = containerRef.current.getBoundingClientRect();
			const cursorX = e.clientX - rect.left;
			const cursorY = e.clientY - rect.top;
			const cursorXPercent = cursorX / rect.width - 0.5;
			const cursorYPercent = -cursorY / rect.height + 0.5;
			const cursorXMap = cursorXPercent * mapSize;
			const cursorYMap = cursorYPercent * mapSize;
			const cursorXMapOld = cursorXMap / zoom;
			const cursorYMapOld = cursorYMap / zoom;

			const newZoom = Math.min(Math.max(zoom + delta, minZoom), maxZoom);
			const cursorXMapNew = cursorXMap / newZoom;
			const cursorYMapNew = cursorYMap / newZoom;

			const newPos = {
				x: position.x + (cursorXMapOld - cursorXMapNew),
				y: position.y + (cursorYMapOld - cursorYMapNew)
			};

			setZoom(newZoom);
			setPosition(clampPosition(newPos, newZoom));
		},
		[zoom, position, minZoom, maxZoom, clampPosition, mapSize, zoomSensitivity]
	);

	// Handle mouse down for dragging
	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			// Only handle left mouse button (button 0)
			if (e.button !== 0) return;
			setIsDragging(true);
			setDragStart({ x: e.clientX, y: e.clientY });
			e.preventDefault();
		},
		[]
	);

	// Handle mouse move for dragging
	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging || !imageRef.current) return;

			const rect = imageRef.current.getBoundingClientRect();
			const deltaX = e.clientX - dragStart.x;
			const deltaY = e.clientY - dragStart.y;
			const deltaXMap = (deltaX * mapSize) / rect.width;
			const deltaYMap = (deltaY * mapSize) / rect.height;

			const newPos = {
				x: position.x - deltaXMap,
				y: position.y + deltaYMap
			};

			setPosition(clampPosition(newPos, zoom));
			setDragStart({ x: e.clientX, y: e.clientY });
		},
		[isDragging, dragStart, position, zoom, clampPosition, mapSize]
	);

	// Handle mouse up to stop dragging
	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	// Add/remove event listeners for dragging and zooming
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		container.addEventListener('wheel', handleWheel, { passive: false });
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			container.removeEventListener('wheel', handleWheel);
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [handleWheel, handleMouseMove, handleMouseUp]);

	// Calculate map transform
	const maxSize = Math.max(containerSize.width, containerSize.height);
	const mapPixelSize = maxSize * zoom;
	const mapX = (position.x / mapSize) * mapPixelSize;
	const mapY = (position.y / mapSize) * mapPixelSize;
	const mapLeft = containerSize.width / 2 - mapPixelSize / 2 - mapX;
	const mapTop = containerSize.height / 2 - mapPixelSize / 2 + mapY;
	const mapCenterX = mapLeft + mapPixelSize / 2;
	const mapCenterY = mapTop + mapPixelSize / 2;

	return (
		<div ref={containerRef} className={styles.mapContainer} onMouseDown={handleMouseDown}>
			<img
				ref={imageRef}
				src={image || DEFAULT_IMAGE}
				alt="Map"
				className={styles.mapImage}
				style={{
					width: `${mapPixelSize}px`,
					height: `${mapPixelSize}px`,
					left: `${mapLeft}px`,
					top: `${mapTop}px`
				}}
				draggable={false}
			/>

			{/* Render blips */}
			{blips.map((blip, index) => {
				const blipX = mapCenterX + (blip.position.x / mapSize) * mapPixelSize;
				const blipY = mapCenterY - (blip.position.y / mapSize) * mapPixelSize;
				const blipPixelSize = blipSize * zoom;
				const blipKey = blip.id ?? `${blip.position.x}-${blip.position.y}-${index}`;

				// Get the Icon component from lucide-react
				const IconComponent = (Icons as any)[blip.icon] || Icons.MapPin;

				return (
					<div
						key={blipKey}
						className={styles.blip}
						style={{
							left: `${blipX}px`,
							top: `${blipY}px`,
							width: `${blipPixelSize}px`,
							height: `${blipPixelSize}px`,
							backgroundColor: blip.color || '#ffffff',
							borderRadius: '50%'
						}}
					>
						<IconComponent 
							size={blipPixelSize * 0.6}
							color='#ffffff'
							className={styles.blipIcon}
							title={blip.label}
						/>
						{blip.label && <div className={styles.blipLabel}>{blip.label}</div>}
					</div>
				);
			})}
		</div>
	);
}
