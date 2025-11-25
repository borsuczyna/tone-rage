import { useState } from 'react';
import Map from './Components/Map';
import styles from './Styles/MapTestInterface.module.css';

export default function MapTestInterface() {
	const [isVisible] = useState(true);

	if (!isVisible) return null;

	return (
		<div className={styles.mapTestContainer}>
			<div className={styles.mapWrapper}>
				<Map
					defaultZoom={1}
					defaultPosition={{ x: 0, y: 0 }}
					borders={{
						minZoom: 0.5,
						maxZoom: 5,
						minX: -1000,
						maxX: 1000,
						minY: -1000,
						maxY: 1000
					}}
					blips={[
						{ position: { x: 100, y: 200 }, icon: 'DollarSign', label: 'ATM' },
						{ position: { x: -300, y: 400 }, icon: 'Home', label: 'Safehouse' },
						{ position: { x: 200, y: -150 }, icon: 'ShoppingCart', label: 'Store' },
						{ position: { x: -100, y: -200 }, icon: 'Car', label: 'Garage' }
					]}
				/>
			</div>
			<div className={styles.instructions}>
				<h3>Map Component Test</h3>
				<ul>
					<li>Scroll to zoom in/out</li>
					<li>Click and drag to move the map</li>
					<li>Hover over blips to see labels</li>
				</ul>
			</div>
		</div>
	);
}
