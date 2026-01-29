import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import en from './translations/en';
import hi from './translations/hi';
import ta from './translations/ta';
import te from './translations/te';
import bn from './translations/bn';
import mr from './translations/mr';
import ml from './translations/ml';
import kn from './translations/kn';

const translations = { en, hi, ta, te, bn, mr, ml, kn };

export const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];

const LANGUAGE_STORAGE_KEY = '@janpath_language';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
            if (savedLanguage && translations[savedLanguage]) {
                setLanguage(savedLanguage);
            }
        } catch (error) {
            console.error('Failed to load language:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const changeLanguage = async (langCode) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
            setLanguage(langCode);
        } catch (error) {
            console.error('Failed to save language:', error);
        }
    };

    const t = (key, params) => {
        const keys = key.split('.');
        let value = translations[language];
        for (const k of keys) {
            value = value?.[k];
        }
        // Fallback to English if translation not found
        if (value === undefined) {
            value = translations.en;
            for (const k of keys) {
                value = value?.[k];
            }
        }

        let text = value || key;
        if (params && typeof text === 'string') {
            Object.keys(params).forEach(param => {
                text = text.replace(`{${param}}`, params[param]);
            });
        }
        return text;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, isLoading }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageContext;
