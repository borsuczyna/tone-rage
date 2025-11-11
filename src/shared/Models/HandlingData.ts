export default interface HandlingData {
	// Physical Attributes
	mass: number;
	initialDragCoeff: number;
	downForceModifier: number;
	percentSubmerged: number;

	// Transmission Attributes
	driveBiasFront: number;
	initialDriveGears: number;
	initialDriveForce: number;
	driveInertia: number;
	clutchChangeRateScaleUpShift: number;
	clutchChangeRateScaleDownShift: number;
	initialDriveMaxFlatVel: number;
	brakeForce: number;
	brakeBiasFront: number;
	handBrakeForce: number;
	steeringLock: number;

	// Wheel Traction Attributes
	tractionCurveMax: number;
	tractionCurveMin: number;
	tractionCurveLateral: number;
	tractionSpringDeltaMax: number;
	lowSpeedTractionLossMult: number;
	camberStiffness: number;
	tractionBiasFront: number;
	tractionLossMult: number;

	// Suspension Attributes
	suspensionForce: number;
	suspensionCompDamp: number;
	suspensionReboundDamp: number;
	suspensionUpperLimit: number;
	suspensionLowerLimit: number;
	suspensionRaise: number;
	suspensionBiasFront: number;
	antiRollBarForce: number;
	antiRollBarBiasFront: number;
	rollCentreHeightFront: number;
	rollCentreHeightRear: number;

	// Damage Attributes
	collisionDamageMult: number;
	weaponDamageMult: number;
	deformationDamageMult: number;
	engineDamageMult: number;
	petrolTankVolume: number;
	oilVolume: number;

	// Miscellaneous Attributes
	seatOffsetDistX: number;
	seatOffsetDistY: number;
	seatOffsetDistZ: number;
}