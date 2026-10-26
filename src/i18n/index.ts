import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ca from './locales/ca.json';
import en from './locales/en.json';
import es from './locales/es.json';
import eu from './locales/eu.json';
import fr from './locales/fr.json';

export const supportedLanguages = ['en', 'eu', 'es', 'fr', 'ca'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

/**
 * @description Initializes i18next for the Iturrieta client.
 * @returns {typeof i18n} Configured i18n instance.
 */
export function initI18n(): typeof i18n {
  if (i18n.isInitialized) {
    return i18n;
  }

  void i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      eu: { translation: eu },
      es: { translation: es },
      fr: { translation: fr },
      ca: { translation: ca },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

  return i18n;
}

initI18n();

export default i18n;
