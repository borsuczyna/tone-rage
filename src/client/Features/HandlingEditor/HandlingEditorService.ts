import HandlingData from '@shared/Models/HandlingData';
import EventService from '@/Services/EventService';
import InterfaceService from '@/Services/InterfaceService';
import NotificationService from '@/Services/NotificationService';
import { NotificationType } from '@shared/Models/NotificationType';

/**
 * HandlingEditorService - Manages the handling editor interface for the current player's vehicle
 */
export default class HandlingEditorService {
	private static visible: boolean = false;

	/**
	 * Initialize the service
	 */
	public static init() {
		// Register command to toggle handling editor
		mp.events.add('playerCommand', this.onCommand.bind(this));

		// Register event to receive handling data requests
		// mp.events.add('handlingEditor:getData', this.getVehicleHandlingData.bind(this));
        EventService.registerEventHandler('handlingEditor:getData', this.getVehicleHandlingData.bind(this));

		// Register event to apply handling changes
		// mp.events.add('handlingEditor:applyChanges', this.applyHandlingChanges.bind(this));
        EventService.registerEventHandler('handlingEditor:applyChanges', this.applyHandlingChanges.bind(this));

		// Register event to close the interface
		mp.events.add('handlingEditor:close', this.closeHandlingEditor.bind(this));

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
            NotificationService.addNotification(NotificationType.Warning, 'Handling Editor', 'You must be in a vehicle to use the handling editor.');
			return;
		}

		this.setVisible(!this.visible, vehicle);
	}

	/**
	 * Set the visibility of the handling editor
	 */
	private static setVisible(visible: boolean, vehicle?: VehicleMp) {
		this.visible = visible;

		if (visible) {
			InterfaceService.setInterfaceVisible('HandlingEditorInterface', true);
			InterfaceService.setCursorVisible(true, true);
			if (vehicle) {
				this.sendVehicleHandlingData(vehicle);
			}
		} else {
			InterfaceService.setInterfaceVisible('HandlingEditorInterface', false);
			InterfaceService.setCursorVisible(false, false);
		}
	}

	/**
	 * Close the handling editor
	 */
	private static closeHandlingEditor() {
		this.setVisible(false);
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
            const mass = vehicle.getHandling('fMass');
            NotificationService.addNotification(NotificationType.Info, 'Handling Editor', `Vehicle Mass: ${mass}`);
			const handlingData = {
				// Physical Attributes
				mass: vehicle.getHandling('fMass'),
				initialDragCoeff: vehicle.getHandling('fInitialDragCoeff'),
				downForceModifier: vehicle.getHandling('fDownForceModifier'),
				percentSubmerged: vehicle.getHandling('fPercentSubmerged'),

				// Transmission Attributes
				driveBiasFront: vehicle.getHandling('fDriveBiasFront'),
				initialDriveGears: vehicle.getHandling('nInitialDriveGears'),
				initialDriveForce: vehicle.getHandling('fInitialDriveForce'),
				driveInertia: vehicle.getHandling('fDriveInertia'),
				clutchChangeRateScaleUpShift: vehicle.getHandling('fClutchChangeRateScaleUpShift'),
				clutchChangeRateScaleDownShift: vehicle.getHandling('fClutchChangeRateScaleDownShift'),
				initialDriveMaxFlatVel: vehicle.getHandling('fInitialDriveMaxFlatVel'),
				brakeForce: vehicle.getHandling('fBrakeForce'),
				brakeBiasFront: vehicle.getHandling('fBrakeBiasFront'),
				handBrakeForce: vehicle.getHandling('fHandBrakeForce'),
				steeringLock: vehicle.getHandling('fSteeringLock'),

				// Wheel Traction Attributes
				tractionCurveMax: vehicle.getHandling('fTractionCurveMax'),
				tractionCurveMin: vehicle.getHandling('fTractionCurveMin'),
				tractionCurveLateral: vehicle.getHandling('fTractionCurveLateral'),
				tractionSpringDeltaMax: vehicle.getHandling('fTractionSpringDeltaMax'),
				lowSpeedTractionLossMult: vehicle.getHandling('fLowSpeedTractionLossMult'),
				camberStiffness: vehicle.getHandling('fCamberStiffnesss'),
				tractionBiasFront: vehicle.getHandling('fTractionBiasFront'),
				tractionLossMult: vehicle.getHandling('fTractionLossMult'),

				// Suspension Attributes
				suspensionForce: vehicle.getHandling('fSuspensionForce'),
				suspensionCompDamp: vehicle.getHandling('fSuspensionCompDamp'),
				suspensionReboundDamp: vehicle.getHandling('fSuspensionReboundDamp'),
				suspensionUpperLimit: vehicle.getHandling('fSuspensionUpperLimit'),
				suspensionLowerLimit: vehicle.getHandling('fSuspensionLowerLimit'),
				suspensionRaise: vehicle.getHandling('fSuspensionRaise'),
				suspensionBiasFront: vehicle.getHandling('fSuspensionBiasFront'),
				antiRollBarForce: vehicle.getHandling('fAntiRollBarForce'),
				antiRollBarBiasFront: vehicle.getHandling('fAntiRollBarBiasFront'),
				rollCentreHeightFront: vehicle.getHandling('fRollCentreHeightFront'),
				rollCentreHeightRear: vehicle.getHandling('fRollCentreHeightRear'),

				// Damage Attributes
				collisionDamageMult: vehicle.getHandling('fCollisionDamageMult'),
				weaponDamageMult: vehicle.getHandling('fWeaponDamageMult'),
				deformationDamageMult: vehicle.getHandling('fDeformationDamageMult'),
				engineDamageMult: vehicle.getHandling('fEngineDamageMult'),
				petrolTankVolume: vehicle.getHandling('fPetrolTankVolume'),
				oilVolume: vehicle.getHandling('fOilVolume'),

				// Miscellaneous Attributes
				seatOffsetDistX: vehicle.getHandling('fSeatOffsetDistX'),
				seatOffsetDistY: vehicle.getHandling('fSeatOffsetDistY'),
				seatOffsetDistZ: vehicle.getHandling('fSeatOffsetDistZ')
			};

			InterfaceService.callInterfaceEvent('setHandlingData', handlingData);
		} catch (error) {
			mp.console.logError(`Error getting vehicle handling data: ${error}`);
		}
	}

	/**
	 * Apply handling changes to the vehicle
	 */
	private static applyHandlingChanges(data: HandlingData) {
		const vehicle = mp.players.local.vehicle;

		if (!vehicle) {
            NotificationService.addNotification(NotificationType.Warning, 'Handling Editor', 'You must be in a vehicle to apply handling changes.');
			return;
		}

		try {
			// Apply each handling property
			Object.keys(data).forEach((key: string) => {
				const value = (data as any)[key];
				const fieldName = this.getFieldNameFromKey(key);

				if (fieldName) {
					vehicle.setHandling(fieldName, value);
				} else {
                    NotificationService.addNotification(NotificationType.Warning, 'Handling Editor', `Unknown handling field for key: ${key}`);
                }
			});

            NotificationService.addNotification(NotificationType.Success, 'Handling Editor', 'Handling changes applied successfully.');
		} catch (error) {
			mp.console.logError(`Error applying handling changes: ${error}`);
            NotificationService.addNotification(NotificationType.Error, 'Handling Editor', 'Error applying handling changes.');
		}
	}

	/**
	 * Convert camelCase key to handling field name
	 */
	private static getFieldNameFromKey(key: string): string {
		const fieldMap: { [key: string]: string } = {
			// Physical Attributes
			mass: 'fMass',
			initialDragCoeff: 'fInitialDragCoeff',
			downForceModifier: 'fDownForceModifier',
			percentSubmerged: 'fPercentSubmerged',

			// Transmission Attributes
			driveBiasFront: 'fDriveBiasFront',
			initialDriveGears: 'nInitialDriveGears',
			initialDriveForce: 'fInitialDriveForce',
			driveInertia: 'fDriveInertia',
			clutchChangeRateScaleUpShift: 'fClutchChangeRateScaleUpShift',
			clutchChangeRateScaleDownShift: 'fClutchChangeRateScaleDownShift',
			initialDriveMaxFlatVel: 'fInitialDriveMaxFlatVel',
			brakeForce: 'fBrakeForce',
			brakeBiasFront: 'fBrakeBiasFront',
			handBrakeForce: 'fHandBrakeForce',
			steeringLock: 'fSteeringLock',

			// Wheel Traction Attributes
			tractionCurveMax: 'fTractionCurveMax',
			tractionCurveMin: 'fTractionCurveMin',
			tractionCurveLateral: 'fTractionCurveLateral',
			tractionSpringDeltaMax: 'fTractionSpringDeltaMax',
			lowSpeedTractionLossMult: 'fLowSpeedTractionLossMult',
			camberStiffness: 'fCamberStiffnesss',
			tractionBiasFront: 'fTractionBiasFront',
			tractionLossMult: 'fTractionLossMult',

			// Suspension Attributes
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

			// Damage Attributes
			collisionDamageMult: 'fCollisionDamageMult',
			weaponDamageMult: 'fWeaponDamageMult',
			deformationDamageMult: 'fDeformationDamageMult',
			engineDamageMult: 'fEngineDamageMult',
			petrolTankVolume: 'fPetrolTankVolume',
			oilVolume: 'fOilVolume',

			// Miscellaneous Attributes
			seatOffsetDistX: 'fSeatOffsetDistX',
			seatOffsetDistY: 'fSeatOffsetDistY',
			seatOffsetDistZ: 'fSeatOffsetDistZ'
		};

		return fieldMap[key] || '';
	}
}
