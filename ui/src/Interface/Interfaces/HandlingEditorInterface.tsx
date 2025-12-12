import { useState, useEffect, useCallback } from 'react';
import styles from './Styles/HandlingEditorInterface.module.css';
import { triggerEvent } from 'src/Hooks/Fetch';
import { useRageEvent } from 'src/Hooks/RageEventProvider';
import * as Icons from 'lucide-react';
import type HandlingData from '@shared/Models/HandlingData';

const handlingCategories = {
	'Physical': [
		{ key: 'mass', label: 'Mass (kg)', min: 0, max: 10000, step: 10 },
		{ key: 'initialDragCoeff', label: 'Initial Drag Coefficient', min: 10, max: 120, step: 0.1 },
		{ key: 'downForceModifier', label: 'Downforce Modifier', min: 0, max: 100, step: 0.1 },
		{ key: 'percentSubmerged', label: 'Percent Submerged', min: 0, max: 1, step: 0.01 }
	],
	'Transmission': [
		{ key: 'driveBiasFront', label: 'Drive Bias Front', min: 0, max: 1, step: 0.01 },
		{ key: 'initialDriveGears', label: 'Initial Drive Gears', min: 1, max: 8, step: 1 },
		{ key: 'initialDriveForce', label: 'Initial Drive Force', min: 0.01, max: 2, step: 0.01 },
		{ key: 'driveInertia', label: 'Drive Inertia', min: 0.01, max: 2, step: 0.01 },
		{ key: 'clutchChangeRateScaleUpShift', label: 'Clutch Rate Up Shift', min: 0, max: 13, step: 0.1 },
		{ key: 'clutchChangeRateScaleDownShift', label: 'Clutch Rate Down Shift', min: 0, max: 13, step: 0.1 },
		{ key: 'initialDriveMaxFlatVel', label: 'Max Flat Velocity', min: 0, max: 500, step: 1 },
		{ key: 'brakeForce', label: 'Brake Force', min: 0.01, max: 2, step: 0.01 },
		{ key: 'brakeBiasFront', label: 'Brake Bias Front', min: 0, max: 1, step: 0.01 },
		{ key: 'handBrakeForce', label: 'Hand Brake Force', min: 0, max: 10, step: 0.1 },
		{ key: 'steeringLock', label: 'Steering Lock (degrees)', min: 1, max: 90, step: 1 }
	],
	'Traction': [
		{ key: 'tractionCurveMax', label: 'Traction Curve Max', min: 0, max: 10, step: 0.1 },
		{ key: 'tractionCurveMin', label: 'Traction Curve Min', min: 0, max: 10, step: 0.1 },
		{ key: 'tractionCurveLateral', label: 'Traction Curve Lateral', min: 0, max: 100, step: 0.1 },
		{ key: 'tractionSpringDeltaMax', label: 'Traction Spring Delta Max', min: 0, max: 10, step: 0.1 },
		{ key: 'lowSpeedTractionLossMult', label: 'Low Speed Traction Loss', min: 0, max: 10, step: 0.1 },
		{ key: 'camberStiffness', label: 'Camber Stiffness', min: -10, max: 10, step: 0.1 },
		{ key: 'tractionBiasFront', label: 'Traction Bias Front', min: 0.01, max: 0.99, step: 0.01 },
		{ key: 'tractionLossMult', label: 'Traction Loss Multiplier', min: 0, max: 10, step: 0.1 }
	],
	'Suspension': [
		{ key: 'suspensionForce', label: 'Suspension Force', min: 0, max: 10, step: 0.1 },
		{ key: 'suspensionCompDamp', label: 'Suspension Comp Damp', min: 0, max: 10, step: 0.1 },
		{ key: 'suspensionReboundDamp', label: 'Suspension Rebound Damp', min: 0, max: 10, step: 0.1 },
		{ key: 'suspensionUpperLimit', label: 'Suspension Upper Limit', min: -1, max: 1, step: 0.01 },
		{ key: 'suspensionLowerLimit', label: 'Suspension Lower Limit', min: -1, max: 1, step: 0.01 },
		{ key: 'suspensionRaise', label: 'Suspension Raise', min: -1, max: 1, step: 0.01 },
		{ key: 'suspensionBiasFront', label: 'Suspension Bias Front', min: 0, max: 1, step: 0.01 },
		{ key: 'antiRollBarForce', label: 'Anti Roll Bar Force', min: 0, max: 10, step: 0.1 },
		{ key: 'antiRollBarBiasFront', label: 'Anti Roll Bar Bias Front', min: 0, max: 1, step: 0.01 },
		{ key: 'rollCentreHeightFront', label: 'Roll Centre Height Front', min: 0, max: 1, step: 0.01 },
		{ key: 'rollCentreHeightRear', label: 'Roll Centre Height Rear', min: 0, max: 1, step: 0.01 }
	],
	'Damage': [
		{ key: 'collisionDamageMult', label: 'Collision Damage Multiplier', min: 0, max: 10, step: 0.1 },
		{ key: 'weaponDamageMult', label: 'Weapon Damage Multiplier', min: 0, max: 10, step: 0.1 },
		{ key: 'deformationDamageMult', label: 'Deformation Damage Multiplier', min: 0, max: 10, step: 0.1 },
		{ key: 'engineDamageMult', label: 'Engine Damage Multiplier', min: 0, max: 10, step: 0.1 }
	],
	'Miscellaneous': [
		{ key: 'petrolTankVolume', label: 'Petrol Tank Volume', min: 0, max: 200, step: 1 },
		{ key: 'oilVolume', label: 'Oil Volume', min: 0, max: 100, step: 1 },
		{ key: 'seatOffsetDistX', label: 'Seat Offset X', min: -5, max: 5, step: 0.01 },
		{ key: 'seatOffsetDistY', label: 'Seat Offset Y', min: -5, max: 5, step: 0.01 },
		{ key: 'seatOffsetDistZ', label: 'Seat Offset Z', min: -5, max: 5, step: 0.01 }
	]
};

export default function HandlingEditorInterface() {
	const [handlingData, setHandlingData] = useState<HandlingData | null>(null);
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Physical']));
	const [hasChanges, setHasChanges] = useState(false);

	useRageEvent('setHandlingData', useCallback((data: HandlingData) => {
        console.log('Received handling data:', data);
		setHandlingData(data);
		setHasChanges(false);
	}, []));

	useEffect(() => {
		// Request initial data
		triggerEvent('handlingEditor:getData', null);

		// Handle ESC key to close
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				handleClose();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	const handleClose = () => {
		if (typeof mp !== 'undefined') {
			mp.trigger('handlingEditor:close');
		}
	};

	const toggleCategory = (category: string) => {
		setExpandedCategories((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(category)) {
				newSet.delete(category);
			} else {
				newSet.add(category);
			}
			return newSet;
		});
	};

	const handleValueChange = (key: string, value: number) => {
		if (!handlingData) return;

		setHandlingData((prev) => {
			if (!prev) return prev;
			return {
				...prev,
				[key]: value
			};
		});
		setHasChanges(true);
	};

	const handleApply = () => {
		if (!handlingData) return;

		triggerEvent('handlingEditor:applyChanges', handlingData);
		setHasChanges(false);
	};

	const handleReset = () => {
		triggerEvent('handlingEditor:getData', null);
		setHasChanges(false);
	};

	if (!handlingData) {
		return (
			<div className={styles.container}>
				<div className={styles.loading}>Loading...</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.panel}>
				<div className={styles.header}>
					<div className={styles.headerTop}>
						<div className={styles.titleWrapper}>
							<Icons.Settings size="1.5rem" />
							<h1>Vehicle Handling Editor</h1>
						</div>
						<button className={styles.closeButton} onClick={handleClose}>
							<Icons.X size="1.5rem" />
						</button>
					</div>
					<p className={styles.subtitle}>Adjust vehicle handling properties in real-time</p>
				</div>

				<div className={styles.content}>
					{Object.entries(handlingCategories).map(([category, fields]) => (
						<div key={category} className={styles.categorySection}>
							<button className={styles.categoryHeader} onClick={() => toggleCategory(category)}>
								<div className={styles.categoryTitle}>
									<Icons.ChevronDown
										size="1.2rem"
										className={`${styles.chevron} ${expandedCategories.has(category) ? styles.expanded : ''}`}
									/>
									<span>{category}</span>
								</div>
							</button>

							{expandedCategories.has(category) && (
								<div className={styles.fieldsGrid}>
									{fields.map((field) => (
										<div key={field.key} className={styles.field}>
											<label className={styles.fieldLabel}>{field.label}</label>
											<div className={styles.fieldControl}>
												<input
													type="number"
													className={styles.fieldInput}
													value={(handlingData as any)[field.key] || 0}
													onChange={(e) => handleValueChange(field.key, parseFloat(e.target.value) || 0)}
													step={field.step}
													min={field.min}
													max={field.max}
												/>
												<input
													type="range"
													className={styles.fieldSlider}
													value={(handlingData as any)[field.key] || 0}
													onChange={(e) => handleValueChange(field.key, parseFloat(e.target.value) || 0)}
													step={field.step}
													min={field.min}
													max={field.max}
												/>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					))}
				</div>

				<div className={styles.footer}>
					<button className={styles.resetButton} onClick={handleReset} disabled={!hasChanges}>
						<Icons.RotateCcw size="1rem" />
						Reset
					</button>
					<button className={styles.applyButton} onClick={handleApply} disabled={!hasChanges}>
						<Icons.Check size="1rem" />
						Apply Changes
					</button>
				</div>
			</div>
		</div>
	);
}
