import English from './Languages/en.json';
import Polish from './Languages/pl.json';
import Russian from './Languages/ru.json';
export const ServerLanguage = 'en';
export const Languages = {
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
export default function translate(key, options, lang = ServerLanguage) {
    let translation = Languages[lang]?.data[key] ?? key;
    if (options) {
        for (const [optionKey, optionValue] of Object.entries(options)) {
            translation = translation.replace(`{${optionKey}}`, String(optionValue));
        }
    }
    return translation;
}
