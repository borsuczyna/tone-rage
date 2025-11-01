import translate from './Translation/Translation';

const rulesData = [
	{
		title: translate('rules.general.title'),
		icon: 'Shield',
		rules: [
			translate('rules.general.rule1'),
			translate('rules.general.rule2'),
			translate('rules.general.rule3'),
			translate('rules.general.rule4')
		]
	},
	{
		title: translate('rules.racing.title'),
		icon: 'Car',
		rules: [translate('rules.racing.rule1'), translate('rules.racing.rule2'), translate('rules.racing.rule3'), translate('rules.racing.rule4')]
	},
	{
		title: translate('rules.prohibited.title'),
		icon: 'Ban',
		rules: [
			translate('rules.prohibited.rule1'),
			translate('rules.prohibited.rule2'),
			translate('rules.prohibited.rule3'),
			translate('rules.prohibited.rule4')
		]
	},
	{
		title: translate('rules.consequences.title'),
		icon: 'Gavel',
		rules: [
			translate('rules.consequences.rule1'),
			translate('rules.consequences.rule2'),
			translate('rules.consequences.rule3'),
			translate('rules.consequences.rule4')
		]
	}
];

export default rulesData;
