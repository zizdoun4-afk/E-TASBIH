import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { resources } from './resources';

let deviceLanguage = 'ar';

try {
    const locales = getLocales();
    if (locales && locales.length > 0) {
        deviceLanguage = locales[0].languageCode;
    }
} catch (e) {
    console.warn("Error getting device locale", e);
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLanguage, // default language to use.
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    compatibilityJSON: 'v3',
  });

export default i18n;
