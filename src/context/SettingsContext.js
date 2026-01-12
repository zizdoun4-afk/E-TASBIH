import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const THEME_COLORS = [
    '#10B981', // Emerald (Default)
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#14B8A6', // Teal
    '#EC4899', // Pink
];

export const SettingsProvider = ({ children }) => {
    const [language, setLanguage] = useState(i18n.language);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [primaryColor, setPrimaryColor] = useState(THEME_COLORS[0]);
    const [hapticsEnabled, setHapticsEnabled] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const storedLang = await AsyncStorage.getItem('language');
            const storedTheme = await AsyncStorage.getItem('isDarkMode');
            const storedColor = await AsyncStorage.getItem('primaryColor');
            const storedHaptics = await AsyncStorage.getItem('hapticsEnabled');

            if (storedLang) {
                setLanguage(storedLang);
                i18n.changeLanguage(storedLang);
                // Handle RTL if needed, though simple i18n change often suffices for text
                // For layout mirroring, we might need I18nManager.forceRTL and reload
            }

            if (storedTheme !== null) setIsDarkMode(JSON.parse(storedTheme));
            if (storedColor) setPrimaryColor(storedColor);
            if (storedHaptics !== null) setHapticsEnabled(JSON.parse(storedHaptics));
            
            setIsLoaded(true);
        } catch (e) {
            console.error("Failed to load settings", e);
            setIsLoaded(true);
        }
    };

    const changeLanguage = async (lang) => {
        setLanguage(lang);
        await i18n.changeLanguage(lang);
        await AsyncStorage.setItem('language', lang);
        
        const isRTL = ['ar', 'zgh'].includes(lang); // Arabic and Amazigh (often RTL in some contexts, but let's stick to Arabic for strict RTL)
        // Note: Standard Amazigh (Tifinagh) is LTR, Arabic script Amazigh is RTL. 
        // We'll assume 'ar' is the main RTL one. 
        // If the app needs strict RTL layout switching:
        /*
        if (I18nManager.isRTL !== (lang === 'ar')) {
             I18nManager.allowRTL(lang === 'ar');
             I18nManager.forceRTL(lang === 'ar');
             Updates.reloadAsync();
        }
        */
    };

    const toggleTheme = async () => {
        const newVal = !isDarkMode;
        setIsDarkMode(newVal);
        await AsyncStorage.setItem('isDarkMode', JSON.stringify(newVal));
    };

    const changePrimaryColor = async (color) => {
        setPrimaryColor(color);
        await AsyncStorage.setItem('primaryColor', color);
    };

    const toggleHaptics = async () => {
        const newVal = !hapticsEnabled;
        setHapticsEnabled(newVal);
        await AsyncStorage.setItem('hapticsEnabled', JSON.stringify(newVal));
    };

    const theme = {
        dark: isDarkMode,
        colors: {
            primary: primaryColor,
            background: isDarkMode ? '#0F172A' : '#F8FAFC',
            surface: isDarkMode ? '#1E293B' : '#FFFFFF',
            text: isDarkMode ? '#F8FAFC' : '#1E293B',
            textSecondary: isDarkMode ? '#94A3B8' : '#64748B',
            border: isDarkMode ? '#334155' : '#E2E8F0',
            success: '#10B981',
            danger: '#EF4444',
        }
    };

    return (
        <SettingsContext.Provider value={{
            language,
            changeLanguage,
            isDarkMode,
            toggleTheme,
            primaryColor,
            changePrimaryColor,
            hapticsEnabled,
            toggleHaptics,
            theme,
            isLoaded
        }}>
            {children}
        </SettingsContext.Provider>
    );
};
