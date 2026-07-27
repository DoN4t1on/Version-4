import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './locales/de.json';
import en from './locales/en.json';

export const LANGUAGE_STORAGE_KEY = 'LocalDonationLanguage';

const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
const browserLanguage = navigator.language?.startsWith('de') ? 'de' : 'en';

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: de },
    en: { translation: en },
  },
  lng: savedLanguage || browserLanguage,
  fallbackLng: 'de',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (language) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  document.documentElement.lang = language;
});

document.documentElement.lang = i18n.language;

export default i18n;
