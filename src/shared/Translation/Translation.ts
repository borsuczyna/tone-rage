import English from './Languages/en.json';

export type LanguageCode = 'en';
export const ServerLanguage: LanguageCode = 'en';

// Translation key types
export type TranslationKey = keyof typeof English;

export interface LanguageData {
	name: string;
	data: Record<string, string>;
}

export const Languages: Record<LanguageCode, LanguageData> = {
	en: {
		name: 'English',
		data: English
	}
};

export default function translate(key: TranslationKey, lang: LanguageCode = ServerLanguage): string {
	const translation = Languages[lang]?.data[key];
	return translation || key;
}
