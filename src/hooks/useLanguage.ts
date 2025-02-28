import { useState, useCallback, useEffect } from 'react';

export function useLanguage() {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or use browser language or default to English
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && ['en', 'es', 'fr', 'de'].includes(savedLanguage)) {
      return savedLanguage;
    }
    
    // Try to get browser language
    const browserLang = navigator.language.split('-')[0];
    if (['en', 'es', 'fr', 'de'].includes(browserLang)) {
      return browserLang;
    }
    
    return 'en'; // Default to English
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('app-language', language);
    
    // Update document language attribute
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const changeLanguage = useCallback(async (newLanguage: string) => {
    try {
      if (['en', 'es', 'fr', 'de'].includes(newLanguage)) {
        setLanguage(newLanguage);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  }, []);

  return {
    language,
    changeLanguage,
    supportedLanguages: ['en', 'es', 'fr', 'de']
  };
}