import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Imports des traductions locales (sans backend)
import frTranslation from './i18n/fr.json';
import mgTranslation from './i18n/mg.json';

// Configuration i18next
i18n
  // Détection automatique de la langue
  .use(LanguageDetector)
  // Pour React
  .use(initReactI18next)
  .init({
    // Langues supportées
    supportedLngs: ['fr', 'mg'],
    
    // Langue par défaut
    fallbackLng: 'fr',
    
    // Répertoire des ressources
    resources: {
      fr: {
        translation: frTranslation
      },
      mg: {
        translation: mgTranslation
      }
    },
    
    // Configuration de détection
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
    
    // Options de React
    react: {
      useSuspense: false, // Désactiver Suspense pour éviter les erreurs
    },
    
    // Options générales
    interpolation: {
      escapeValue: false, // React s'occupe déjà du XSS
    },
    
    // Mode de chargement
    load: 'languageOnly',
    
    // Debug en développement
    debug: process.env.NODE_ENV === 'development',
    
    // Configuration du détecteur
    saveMissing: true,
    missingKeyHandler: (lng, ns, key) => {
      console.warn(`Traduction manquante: ${key} en ${lng}`);
    }
  });

export default i18n;