import translate from './Translation/Translation';

export function toHumanReadableTime(seconds: number): string {
	const parts: [string, number][] = [];
	const addPart = (name: string, divideBy: number) => {
		const value = Math.floor(seconds / divideBy);
		if (value > 0) {
			parts.push([name, value]);
			seconds %= divideBy;
		}
	};

	addPart(translate('weeks_abbr'), 604800);
	addPart(translate('days_abbr'), 86400);
	addPart(translate('hours_abbr'), 3600);
	addPart(translate('minutes_abbr'), 60);

	if (seconds > 0 || parts.length === 0) {
		parts.push([translate('seconds_abbr'), seconds]);
	}

	return parts.map(([name, value]) => `${value}${name}`).join(' ');
}
