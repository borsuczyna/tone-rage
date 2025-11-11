import InterfaceService from './InterfaceService';

/**
 * HandlingEditorService - Manages the handling editor interface for the current player's vehicle
 */
export default class HandlingEditorService {
	/**
	 * Initialize the service
	 */
	public static init() {
		// Register command to toggle handling editor
		mp.events.add('playerCommand', this.onCommand.bind(this));

		// Register event to receive handling data requests
		mp.events.add('handlingEditor:getData', this.getVehicleHandlingData.bind(this));

		// Register event to apply handling changes
		mp.events.add('handlingEditor:applyChanges', this.applyHandlingChanges.bind(this));

		mp.console.logInfo('HandlingEditorService initialized');
	}

	/**
	 * Handle player commands
	 */
	private static onCommand(command: string) {
		if (command === 'he') {
			this.toggleHandlingEditor();
		}
	}

	/**
	 * Toggle the handling editor interface
	 */
	private static toggleHandlingEditor() {
		const vehicle = mp.players.local.vehicle;

		if (!vehicle) {
			mp.gui.chat.push('You must be in a vehicle to use the handling editor.');
			return;
		}

		// Toggle interface visibility
		InterfaceService.toggleInterfaceVisibility('HandlingEditorInterface');

		// If opening, send initial data
		const currentlyVisible = InterfaceService.isCursorVisible();
		if (!currentlyVisible) {
			// Interface is being opened, show cursor
			InterfaceService.setCursorVisible(true, true);
			this.sendVehicleHandlingData(vehicle);
		} else {
			// Interface is being closed, hide cursor
			InterfaceService.setCursorVisible(false, false);
		}
	}

	/**
	 * Get vehicle handling data and send to interface
	 */
	private static getVehicleHandlingData() {
		const vehicle = mp.players.local.vehicle;
		if (vehicle) {
			this.sendVehicleHandlingData(vehicle);
		}
	}

	/**
	 * Send vehicle handling data to the interface
	 */
	private static sendVehicleHandlingData(vehicle: VehicleMp) {
		try {
			const handlingData = {
				mass: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fMass'),
				initialDragCoeff: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fInitialDragCoeff'),
				downforceModifier: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fDownforceModifier'),
				percentSubmerged: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fPercentSubmerged'),
				driveBiasFront: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fDriveBiasFront'),
				accelerationMultiplier: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fInitialDriveForce'),
				driveInertia: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fDriveInertia'),
				clutchChangeRateScaleUpShift: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fClutchChangeRateScaleUpShift'),
				clutchChangeRateScaleDownShift: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fClutchChangeRateScaleDownShift'),
				initialDriveMaxFlatVel: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fInitialDriveMaxFlatVel'),
				brakeForce: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fBrakeForce'),
				brakeBiasFront: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fBrakeBiasFront'),
				handBrakeForce: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fHandBrakeForce'),
				steeringLock: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fSteeringLock'),
				tractionCurveMax: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fTractionCurveMax'),
				tractionCurveMin: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fTractionCurveMin'),
				tractionCurveLateral: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fTractionCurveLateral'),
				tractionSpringDeltaMax: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fTractionSpringDeltaMax'),
				lowSpeedTractionLossMult: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fLowSpeedTractionLossMult'),
				camberStiffness: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fCamberStiffnesss'),
				tractionBiasFront: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fTractionBiasFront'),
				tractionLossMult: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fTractionLossMult'),
				suspensionForce: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fSuspensionForce'),
				suspensionCompDamp: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fSuspensionCompDamp'),
				suspensionReboundDamp: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fSuspensionReboundDamp'),
				suspensionUpperLimit: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fSuspensionUpperLimit'),
				suspensionLowerLimit: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fSuspensionLowerLimit'),
				suspensionRaise: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fSuspensionRaise'),
				suspensionBiasFront: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fSuspensionBiasFront'),
				antiRollBarForce: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fAntiRollBarForce'),
				antiRollBarBiasFront: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fAntiRollBarBiasFront'),
				rollCentreHeightFront: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fRollCentreHeightFront'),
				rollCentreHeightRear: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fRollCentreHeightRear'),
				collisionDamageMult: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fCollisionDamageMult'),
				weaponDamageMult: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fWeaponDamageMult'),
				deformationDamageMult: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fDeformationDamageMult'),
				engineDamageMult: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fEngineDamageMult'),
				petrolTankVolume: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fPetrolTankVolume'),
				oilVolume: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fOilVolume'),
				seatOffsetDistX: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fSeatOffsetDistX'),
				seatOffsetDistY: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fSeatOffsetDistY'),
				seatOffsetDistZ: mp.game.vehicle.getVehicleHandlingFloat(vehicle.handle, 'CHandlingData', 'fSeatOffsetDistZ')
			};

			InterfaceService.callInterfaceEvent('setHandlingData', handlingData);
		} catch (error) {
			mp.console.logError(`Error getting vehicle handling data: ${error}`);
		}
	}

	/**
	 * Apply handling changes to the vehicle
	 */
	private static applyHandlingChanges(data: string) {
		const vehicle = mp.players.local.vehicle;

		if (!vehicle) {
			mp.gui.chat.push('You must be in a vehicle to apply handling changes.');
			return;
		}

		try {
			const handlingData = JSON.parse(data);

			// Apply each handling property
			Object.keys(handlingData).forEach((key) => {
				const value = handlingData[key];
				const fieldName = this.getFieldNameFromKey(key);

				if (fieldName) {
					mp.game.vehicle.setVehicleHandlingFloat(vehicle.handle, 'CHandlingData', fieldName, value);
				}
			});

			mp.gui.chat.push('Handling changes applied successfully.');
		} catch (error) {
			mp.console.logError(`Error applying handling changes: ${error}`);
			mp.gui.chat.push('Error applying handling changes.');
		}
	}

	/**
	 * Convert camelCase key to handling field name
	 */
	private static getFieldNameFromKey(key: string): string {
		const fieldMap: { [key: string]: string } = {
			mass: 'fMass',
			initialDragCoeff: 'fInitialDragCoeff',
			downforceModifier: 'fDownforceModifier',
			percentSubmerged: 'fPercentSubmerged',
			driveBiasFront: 'fDriveBiasFront',
			accelerationMultiplier: 'fInitialDriveForce',
			driveInertia: 'fDriveInertia',
			clutchChangeRateScaleUpShift: 'fClutchChangeRateScaleUpShift',
			clutchChangeRateScaleDownShift: 'fClutchChangeRateScaleDownShift',
			initialDriveMaxFlatVel: 'fInitialDriveMaxFlatVel',
			brakeForce: 'fBrakeForce',
			brakeBiasFront: 'fBrakeBiasFront',
			handBrakeForce: 'fHandBrakeForce',
			steeringLock: 'fSteeringLock',
			tractionCurveMax: 'fTractionCurveMax',
			tractionCurveMin: 'fTractionCurveMin',
			tractionCurveLateral: 'fTractionCurveLateral',
			tractionSpringDeltaMax: 'fTractionSpringDeltaMax',
			lowSpeedTractionLossMult: 'fLowSpeedTractionLossMult',
			camberStiffness: 'fCamberStiffnesss',
			tractionBiasFront: 'fTractionBiasFront',
			tractionLossMult: 'fTractionLossMult',
			suspensionForce: 'fSuspensionForce',
			suspensionCompDamp: 'fSuspensionCompDamp',
			suspensionReboundDamp: 'fSuspensionReboundDamp',
			suspensionUpperLimit: 'fSuspensionUpperLimit',
			suspensionLowerLimit: 'fSuspensionLowerLimit',
			suspensionRaise: 'fSuspensionRaise',
			suspensionBiasFront: 'fSuspensionBiasFront',
			antiRollBarForce: 'fAntiRollBarForce',
			antiRollBarBiasFront: 'fAntiRollBarBiasFront',
			rollCentreHeightFront: 'fRollCentreHeightFront',
			rollCentreHeightRear: 'fRollCentreHeightRear',
			collisionDamageMult: 'fCollisionDamageMult',
			weaponDamageMult: 'fWeaponDamageMult',
			deformationDamageMult: 'fDeformationDamageMult',
			engineDamageMult: 'fEngineDamageMult',
			petrolTankVolume: 'fPetrolTankVolume',
			oilVolume: 'fOilVolume',
			seatOffsetDistX: 'fSeatOffsetDistX',
			seatOffsetDistY: 'fSeatOffsetDistY',
			seatOffsetDistZ: 'fSeatOffsetDistZ'
		};

		return fieldMap[key] || '';
	}
}
