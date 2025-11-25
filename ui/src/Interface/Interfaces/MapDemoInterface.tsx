import Map from './Components/Map';
import styles from './Styles/MapDemoInterface.module.css';

export default function MapDemoInterface() {
	return (
		<div className={styles.container}>
			<div className={styles.mapWrapper}>
				<Map
					defaultZoom={1}
					defaultPosition={{ x: 0, y: 0 }}
					borders={{
						minZoom: 0.5,
						maxZoom: 5,
						minX: -3000,
						maxX: 3000,
						minY: -3000,
						maxY: 3000
					}}
					blips={[
						{ position: { x: 500, y: 800 }, icon: '/images/blips/money.svg', label: 'ATM #1' },
						{ position: { x: -700, y: 1200 }, icon: '/images/blips/house.svg', label: 'Safehouse' },
						{ position: { x: 1000, y: -500 }, icon: '/images/blips/money.svg', label: 'ATM #2' },
						{ position: { x: -500, y: -800 }, icon: '/images/blips/house.svg', label: 'Apartment' }
					]}
				/>
			</div>
			<div className={styles.instructions}>
				<h3>Map Controls:</h3>
				<ul>
					<li>🖱️ Mouse Wheel: Zoom in/out</li>
					<li>🖱️ Left Click + Drag: Pan the map</li>
					<li>🎯 Hover over blips: Show labels</li>
				</ul>
			</div>
		</div>
	);
}
