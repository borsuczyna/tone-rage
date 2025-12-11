import English from './Languages/en.json';
import Polish from './Languages/pl.json';
import Russian from './Languages/ru.json';

export type LanguageCode = 'en' | 'ru' | 'pl';
export const ServerLanguage: LanguageCode = 'en';

export type TranslationKey = keyof typeof English;

export interface LanguageData {
	name: string;
	data: Record<string, string>;
}

export const Languages: Record<LanguageCode, LanguageData> = {
	en: {
		name: 'English',
		data: English
	},
    ru: {
        name: 'Русский',
        data: Russian
    },
    pl: {
        name: 'Polski',
        data: Polish
    }
};

export default function translate(key: TranslationKey, options?: Record<string, any>, lang: LanguageCode = ServerLanguage): string {
	let translation = Languages[lang]?.data[key] ?? key;
    if (options) {
        for (const [optionKey, optionValue] of Object.entries(options)) {
            translation = translation.replace(`{${optionKey}}`, String(optionValue));
        }
    }

    return translation;
}